using PetPal.Application.DTOs.Vaccinations;
using PetPal.Application.Exceptions;
using PetPal.Application.Interfaces;
using PetPal.Domain.Entities;
using PetPal.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PetPal.Application.Services
{
    public class VaccinationService : IVaccinationService
    {
        private const int DueSoonDays = 30;

        private readonly IUnitOfWork _uow;
        private readonly ICurrentUserService _currentUser;
        private readonly ISchedulingClock _clock;

        public VaccinationService(IUnitOfWork uow, ICurrentUserService currentUser, ISchedulingClock clock)
        {
            _uow = uow;
            _currentUser = currentUser;
            _clock = clock;
        }

        private Guid UserId => _currentUser.UserId
            ?? throw new UnauthorizedAccessException("User is not authenticated.");

        public async Task<VaccinationLogDto> GetLogAsync(Guid petId, CancellationToken ct = default)
        {
            await EnsurePetOwnedAsync(petId, ct);

            return await BuildLogAsync(petId, ct);
        }

        public async Task<VaccinationDto> GetByIdAsync(Guid petId, Guid id, CancellationToken ct = default)
        {
            await EnsurePetOwnedAsync(petId, ct);

            var log = await BuildLogAsync(petId, ct);

            return log.Items.FirstOrDefault(i => i.Id == id)
                ?? throw new NotFoundException("Vaccination record not found.");
        }

        public async Task<VaccinationDto> CreateAsync(Guid petId, VaccinationRequest request, CancellationToken ct = default)
        {
            var pet = await GetOwnedPetAsync(petId, ct);
            Validate(request, pet.BirthDate);

            var item = new Vaccination { PetId = petId };
            Apply(item, request);

            await _uow.Vaccinations.AddAsync(item, ct);
            await _uow.SaveChangesAsync(ct);

            return await GetByIdAsync(petId, item.Id, ct);
        }

        public async Task<VaccinationDto> UpdateAsync(Guid petId, Guid id, VaccinationRequest request, CancellationToken ct = default)
        {
            var pet = await GetOwnedPetAsync(petId, ct);

            var item = await _uow.Vaccinations.GetByIdForPetAsync(id, petId, true, ct)
                ?? throw new NotFoundException("Vaccination record not found.");

            Validate(request, pet.BirthDate);
            Apply(item, request);

            await _uow.SaveChangesAsync(ct);

            return await GetByIdAsync(petId, id, ct);
        }

        public async Task DeleteAsync(Guid petId, Guid id, CancellationToken ct = default)
        {
            await EnsurePetOwnedAsync(petId, ct);

            var item = await _uow.Vaccinations.GetByIdForPetAsync(id, petId, true, ct)
                ?? throw new NotFoundException("Vaccination record not found.");

            _uow.Vaccinations.Delete(item);
            await _uow.SaveChangesAsync(ct);
        }

        // ---------- log + status calculation ----------

        private async Task<VaccinationLogDto> BuildLogAsync(Guid petId, CancellationToken ct)
        {
            var records = await _uow.Vaccinations.GetByPetIdAsync(petId, ct);
            var today = _clock.TodayLocal;

            // The newest record of each vaccine decides whether that vaccine is up to date.
            // Older doses stay in the history only (e.g. last year's rabies shot after this year's booster).
            var latestIds = records
                .GroupBy(v => NameKey(v.Name))
                .Select(g => g.OrderByDescending(v => v.DateGiven)
                              .ThenByDescending(v => v.CreatedAt)
                              .First().Id)
                .ToHashSet();

            var items = records
                .Select(v => ToDto(v, latestIds.Contains(v.Id) ? StatusOf(v, today) : VaccinationStatus.Superseded, today))
                .ToList();

            var current = items.Where(i => i.Status != VaccinationStatus.Superseded).ToList();

            var next = current
                .Where(i => i.NextDueDate is not null && i.NextDueDate >= today)
                .OrderBy(i => i.NextDueDate)
                .FirstOrDefault();

            return new VaccinationLogDto
            {
                Items = items,
                Summary = new VaccinationSummaryDto
                {
                    Total = current.Count,
                    UpToDateCount = current.Count(i => i.Status == VaccinationStatus.UpToDate || i.Status == VaccinationStatus.DueSoon),
                    DueSoonCount = current.Count(i => i.Status == VaccinationStatus.DueSoon),
                    OverdueCount = current.Count(i => i.Status == VaccinationStatus.Overdue),
                    NextDueName = next?.Name,
                    NextDueDate = next?.NextDueDate
                }
            };
        }

        private static VaccinationStatus StatusOf(Vaccination v, DateOnly today)
        {
            if (v.NextDueDate is not { } due)
                return VaccinationStatus.UpToDate;   // no further dose needed

            if (due < today)
                return VaccinationStatus.Overdue;

            return due <= today.AddDays(DueSoonDays)
                ? VaccinationStatus.DueSoon
                : VaccinationStatus.UpToDate;
        }

        private static VaccinationDto ToDto(Vaccination v, VaccinationStatus status, DateOnly today) => new()
        {
            Id = v.Id,
            PetId = v.PetId,
            Name = v.Name,
            DateGiven = v.DateGiven,
            NextDueDate = v.NextDueDate,
            Notes = v.Notes,
            Status = status,
            DaysUntilNextDue = status != VaccinationStatus.Superseded && v.NextDueDate is { } due
                ? due.DayNumber - today.DayNumber
                : null
        };

        private static string NameKey(string name) => name.Trim().ToLowerInvariant();

        // ---------- validation + helpers ----------

        private void Validate(VaccinationRequest r, DateOnly petBirthDate)
        {
            var today = _clock.TodayLocal;

            if (r.DateGiven > today)
                throw new BadRequestException("Date given cannot be in the future.");

            if (r.DateGiven < today.AddYears(-40))
                throw new BadRequestException("Date given is not valid.");

            if (r.DateGiven < petBirthDate)
                throw new BadRequestException("Date given cannot be before the pet's birth date.");

            if (r.NextDueDate is { } next)
            {
                if (next <= r.DateGiven)
                    throw new BadRequestException("Next due date must be after the date given.");

                if (next > r.DateGiven.AddYears(10))
                    throw new BadRequestException("Next due date is too far in the future.");
            }
        }

        private static void Apply(Vaccination v, VaccinationRequest r)
        {
            v.Name = r.Name.Trim();
            v.DateGiven = r.DateGiven;
            v.NextDueDate = r.NextDueDate;
            v.Notes = string.IsNullOrWhiteSpace(r.Notes) ? null : r.Notes.Trim();
        }

        // Returns 404 if the pet doesn't exist or belongs to another user.
        private async Task EnsurePetOwnedAsync(Guid petId, CancellationToken ct)
        {
            if (!await _uow.Pets.ExistsForOwnerAsync(petId, UserId, ct))
                throw new NotFoundException("Pet not found.");
        }

        private async Task<Pet> GetOwnedPetAsync(Guid petId, CancellationToken ct)
            => await _uow.Pets.GetByIdForOwnerAsync(petId, UserId, false, ct)
                ?? throw new NotFoundException("Pet not found.");
    }
}
