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
    public class PetRepository : GenericRepository<Pet>, IPetRepository
    {

        public PetRepository(PetPalDbContext dbcontext) : base(dbcontext)
        {
        }

        public async Task<IReadOnlyList<Pet>> GetByOwnerIdAsync(Guid ownerId, CancellationToken ct = default)
            => await _dbContext.Pets.AsNoTracking()
                .Include(p => p.PetType)
                .Include(p => p.Breed)
                .Where(p => p.OwnerId == ownerId)
                .OrderBy(p => p.CreatedAt)
                .ToListAsync(ct);

        public async Task<Pet?> GetByIdForOwnerAsync(Guid id, Guid ownerId, bool asTracking = false, CancellationToken ct = default)
        {
            IQueryable<Pet> query = _dbContext.Pets
                .Include(p => p.PetType)
                .Include(p => p.Breed);

            if (!asTracking)
                query = query.AsNoTracking();

            return await query.FirstOrDefaultAsync(p => p.Id == id && p.OwnerId == ownerId, ct);
        }

        public async Task<bool> ExistsForOwnerAsync(Guid petId, Guid ownerId, CancellationToken ct = default)
    => await _dbContext.Pets.AnyAsync(p => p.Id == petId && p.OwnerId == ownerId, ct);

        public async Task RemoveAIConversationsAsync(Guid petId, CancellationToken ct = default)
        {
            var conversations = await _dbContext.AIConversations
                .Where(c => c.PetId == petId)
                .ToListAsync(ct);

            _dbContext.AIConversations.RemoveRange(conversations);
        }
    }
}
