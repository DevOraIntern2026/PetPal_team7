using Microsoft.EntityFrameworkCore;
using PetPal.Application.Interfaces.Repositories;
using PetPal.Domain.Entities;
using PetPal.Infrastructure.Data;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PetPal.Infrastructure.Repositories
{
    public class BreedRepository : GenericRepository<Breed>, IBreedRepository
    {
        public BreedRepository(PetPalDbContext context) : base(context) { }

        public async Task<IReadOnlyList<Breed>> GetByPetTypeIdAsync(Guid petTypeId, CancellationToken ct = default)
            => await _dbContext.Breeds.AsNoTracking()
                .Where(b => b.PetTypeId == petTypeId)
                .OrderBy(b => b.Name)
                .ToListAsync(ct);

        public async Task<bool> ExistsForPetTypeAsync(Guid breedId, Guid petTypeId, CancellationToken ct = default)
            => await _dbContext.Breeds.AnyAsync(b => b.Id == breedId && b.PetTypeId == petTypeId, ct);
    }
}
