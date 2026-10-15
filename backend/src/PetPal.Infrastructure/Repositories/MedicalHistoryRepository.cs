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
    public class MedicalHistoryRepository : GenericRepository<MedicalHistory>, IMedicalHistoryRepository
    {
        public MedicalHistoryRepository(PetPalDbContext context) : base(context) { }

        public async Task<IReadOnlyList<MedicalHistory>> GetByPetIdAsync(Guid petId, CancellationToken ct = default)
            => await _dbContext.MedicalHistories.AsNoTracking()
                .Where(m => m.PetId == petId)
                .OrderByDescending(m => m.CreatedAt)
                .ToListAsync(ct);

        public async Task<MedicalHistory?> GetByIdForPetAsync(Guid id, Guid petId, bool asTracking = false, CancellationToken ct = default)
        {
            IQueryable<MedicalHistory> query = _dbContext.MedicalHistories;

            if (!asTracking)
                query = query.AsNoTracking();

            return await query.FirstOrDefaultAsync(m => m.Id == id && m.PetId == petId, ct);
        }
    }
}
