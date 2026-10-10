using PetPal.Application.DTOs.Pets;
using PetPal.Application.Exceptions;
using PetPal.Application.Interfaces;
using PetPal.Application.Interfaces.Repositories;
using PetPal.Application.Mappings;
using PetPal.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PetPal.Application.Services
{
    public class PetService : IPetService
    {
        private readonly IUnitOfWork _uow;
        private readonly ICurrentUserService _currentUser;

        public PetService(IUnitOfWork uow, ICurrentUserService currentUser)
        {
            _uow = uow;
            _currentUser = currentUser;
        }

        private Guid UserId => _currentUser.UserId
            ?? throw new UnauthorizedAccessException("User is not authenticated.");

        public async Task<IReadOnlyList<PetDto>> GetMyPetsAsync(CancellationToken ct = default)
        {
            var pets = await _uow.Pets.GetByOwnerIdAsync(UserId, ct);

            return pets.Select(p => p.ToDto()).ToList();
        }

        public async Task<PetDto> GetByIdAsync(Guid id, CancellationToken ct = default)
        {
            var pet = await _uow.Pets.GetByIdForOwnerAsync(id, UserId, false, ct)
                ?? throw new NotFoundException("Pet not found.");

            return pet.ToDto();
        }

        public async Task<PetDto> CreateAsync(PetRequest request, CancellationToken ct = default)
        {
            var ownerId = UserId;
            await ValidateAsync(request, ct);

            var pet = new Pet { OwnerId = ownerId };
            Apply(pet, request);

            await _uow.Pets.AddAsync(pet, ct);
            await _uow.SaveChangesAsync(ct);

            return await GetByIdAsync(pet.Id, ct);
        }

        public async Task<PetDto> UpdateAsync(Guid id, PetRequest request, CancellationToken ct = default)
        {
            var pet = await _uow.Pets.GetByIdForOwnerAsync(id, UserId, true, ct)
                ?? throw new NotFoundException("Pet not found.");

            await ValidateAsync(request, ct);
            Apply(pet, request);

            await _uow.SaveChangesAsync(ct);

            return await GetByIdAsync(id, ct);
        }

        public async Task DeleteAsync(Guid id, CancellationToken ct = default)
        {
            var pet = await _uow.Pets.GetByIdForOwnerAsync(id, UserId, true, ct)
                ?? throw new NotFoundException("Pet not found.");

            await _uow.Pets.RemoveAIConversationsAsync(id, ct);
            _uow.Pets.Delete(pet);

            await _uow.SaveChangesAsync(ct);
        }

        private async Task ValidateAsync(PetRequest r, CancellationToken ct)
        {
            var today = DateOnly.FromDateTime(DateTime.UtcNow);

            if (r.BirthDate > today || r.BirthDate < today.AddYears(-40))
                throw new BadRequestException("Birth date is not valid.");

            if (!await _uow.Breeds.ExistsForPetTypeAsync(r.BreedId, r.PetTypeId, ct))
                throw new BadRequestException("Breed does not belong to the selected pet type.");
        }

        private static void Apply(Pet pet, PetRequest r)
        {
            pet.PetTypeId = r.PetTypeId;
            pet.BreedId = r.BreedId;
            pet.Name = r.Name.Trim();
            pet.BirthDate = r.BirthDate;
            pet.WeightKg = r.WeightKg;
            pet.HeightCm = r.HeightCm;
            pet.Gender = r.Gender;
            pet.BloodType = r.BloodType;
            pet.Personality = r.Personality;
            pet.ProfileImageUrl = r.ProfileImageUrl;
        }
    }
}
