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
    public class RefreshTokenRepository : GenericRepository<RefreshToken>, IRefreshTokenRepository
    {
        public RefreshTokenRepository(PetPalDbContext context) : base(context) { }

        public async Task<RefreshToken?> GetByHashAsync(string tokenHash, CancellationToken ct = default)
            => await _dbContext.RefreshTokens.AsNoTracking()
                .FirstOrDefaultAsync(t => t.TokenHash == tokenHash, ct);

        public async Task<bool> TryRevokeAsync(Guid id, DateTime nowUtc, string? replacedByHash, CancellationToken ct = default)
        {
            var affected = await _dbContext.RefreshTokens
                .Where(t => t.Id == id && t.RevokedAtUtc == null)
                .ExecuteUpdateAsync(s => s
                    .SetProperty(t => t.RevokedAtUtc, (DateTime?)nowUtc)
                    .SetProperty(t => t.ReplacedByTokenHash, replacedByHash), ct);

            return affected == 1;
        }

        public async Task RevokeAllForUserAsync(Guid userId, DateTime nowUtc, CancellationToken ct = default)
            => await _dbContext.RefreshTokens
                .Where(t => t.UserId == userId && t.RevokedAtUtc == null)
                .ExecuteUpdateAsync(s => s.SetProperty(t => t.RevokedAtUtc, (DateTime?)nowUtc), ct);

        public async Task DeleteExpiredForUserAsync(Guid userId, DateTime nowUtc, CancellationToken ct = default)
            => await _dbContext.RefreshTokens
                .Where(t => t.UserId == userId && t.ExpiresAtUtc < nowUtc)
                .ExecuteDeleteAsync(ct);
    }
}
