using PetPal.Application.DTOs.MedicalHistory;
using PetPal.Application.Exceptions;
using PetPal.Application.Interfaces;
using PetPal.Application.Mappings;
using PetPal.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PetPal.Application.Services
{
    public class MedicalHistoryService : IMedicalHistoryService
    {
        private readonly IUnitOfWork _uow;
        private readonly ICurrentUserService _currentUser;

        public MedicalHistoryService(IUnitOfWork uow, ICurrentUserService currentUser)
        {
            _uow = uow;
            _currentUser = currentUser;
        }

        private Guid UserId => _currentUser.UserId
            ?? throw new UnauthorizedAccessException("User is not authenticated.");

        public async Task<IReadOnlyList<MedicalHistoryDto>> GetAllAsync(Guid petId, CancellationToken ct = default)
        {
            await EnsurePetOwnedAsync(petId, ct);

            var items = await _uow.MedicalHistories.GetByPetIdAsync(petId, ct);

            return items.Select(m => m.ToDto()).ToList();
        }

        public async Task<MedicalHistoryDto> GetByIdAsync(Guid petId, Guid id, CancellationToken ct = default)
        {
            await EnsurePetOwnedAsync(petId, ct);

            var item = await _uow.MedicalHistories.GetByIdForPetAsync(id, petId, false, ct)
                ?? throw new NotFoundException("Medical history record not found.");

            return item.ToDto();
        }

        public async Task<MedicalHistoryDto> CreateAsync(Guid petId, MedicalHistoryRequest request, CancellationToken ct = default)
        {
            await EnsurePetOwnedAsync(petId, ct);

            var item = new MedicalHistory
            {
                PetId = petId,
                Title = request.Title.Trim(),
                Description = request.Description?.Trim()
            };

            await _uow.MedicalHistories.AddAsync(item, ct);
            await _uow.SaveChangesAsync(ct);

            return item.ToDto();
        }

        public async Task<MedicalHistoryDto> UpdateAsync(Guid petId, Guid id, MedicalHistoryRequest request, CancellationToken ct = default)
        {
            await EnsurePetOwnedAsync(petId, ct);

            var item = await _uow.MedicalHistories.GetByIdForPetAsync(id, petId, true, ct)
                ?? throw new NotFoundException("Medical history record not found.");

            item.Title = request.Title.Trim();
            item.Description = request.Description?.Trim();

            await _uow.SaveChangesAsync(ct);

            return item.ToDto();
        }

        public async Task DeleteAsync(Guid petId, Guid id, CancellationToken ct = default)
        {
            await EnsurePetOwnedAsync(petId, ct);

            var item = await _uow.MedicalHistories.GetByIdForPetAsync(id, petId, true, ct)
                ?? throw new NotFoundException("Medical history record not found.");

            _uow.MedicalHistories.Delete(item);
            await _uow.SaveChangesAsync(ct);
        }

        // Returns 404 if the pet doesn't exist or belongs to another user.
        private async Task EnsurePetOwnedAsync(Guid petId, CancellationToken ct)
        {
            if (!await _uow.Pets.ExistsForOwnerAsync(petId, UserId, ct))
                throw new NotFoundException("Pet not found.");
        }
    }
}
