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
    public class VaccinationRepository : GenericRepository<Vaccination>, IVaccinationRepository
    {
        public VaccinationRepository(PetPalDbContext context) : base(context) { }

        public async Task<IReadOnlyList<Vaccination>> GetByPetIdAsync(Guid petId, CancellationToken ct = default)
            => await _dbContext.Vaccinations.AsNoTracking()
                .Where(v => v.PetId == petId)
                .OrderByDescending(v => v.DateGiven)
                .ThenByDescending(v => v.CreatedAt)
                .ToListAsync(ct);

        public async Task<Vaccination?> GetByIdForPetAsync(Guid id, Guid petId, bool asTracking = false, CancellationToken ct = default)
        {
            IQueryable<Vaccination> query = _dbContext.Vaccinations;

            if (!asTracking)
                query = query.AsNoTracking();

            return await query.FirstOrDefaultAsync(v => v.Id == id && v.PetId == petId, ct);
        }
    }
}
