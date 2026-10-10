using PetPal.Application.DTOs.Pets;
using PetPal.Application.Interfaces;
using PetPal.Application.Interfaces.Repositories;
using PetPal.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PetPal.Application.Services
{
    public class LookupService : ILookupService
    {
        private readonly IUnitOfWork _uow;

        public LookupService(IUnitOfWork uow) => _uow = uow;

        public async Task<IReadOnlyList<PetTypeDto>> GetPetTypesAsync(CancellationToken ct = default)
        {
            var types = await _uow.Repository<PetType>().GetAllAsync(ct);

            return types.OrderBy(t => t.Name)
                .Select(t => new PetTypeDto { Id = t.Id, Name = t.Name })
                .ToList();
        }

        public async Task<IReadOnlyList<BreedDto>> GetBreedsAsync(Guid petTypeId, CancellationToken ct = default)
        {
            var breeds = await _uow.Breeds.GetByPetTypeIdAsync(petTypeId, ct);

            return breeds.Select(b => new BreedDto { Id = b.Id, Name = b.Name }).ToList();
        }
    }
}
