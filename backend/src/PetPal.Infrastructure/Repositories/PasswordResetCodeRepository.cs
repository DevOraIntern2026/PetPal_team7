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
    public class PasswordResetCodeRepository : GenericRepository<PasswordResetCode>, IPasswordResetCodeRepository
    {
        public PasswordResetCodeRepository(PetPalDbContext context) : base(context) { }

        public async Task<PasswordResetCode?> GetLatestActiveAsync(Guid userId, DateTime nowUtc, CancellationToken ct = default)
            => await _dbContext.PasswordResetCodes.AsNoTracking()
                .Where(c => c.UserId == userId && c.UsedAtUtc == null && c.ExpiresAtUtc > nowUtc)
                .OrderByDescending(c => c.CreatedAt)
                .FirstOrDefaultAsync(ct);

        public async Task<DateTime?> GetLatestCreatedAtAsync(Guid userId, CancellationToken ct = default)
            => await _dbContext.PasswordResetCodes.AsNoTracking()
                .Where(c => c.UserId == userId)
                .OrderByDescending(c => c.CreatedAt)
                .Select(c => (DateTime?)c.CreatedAt)
                .FirstOrDefaultAsync(ct);

        public async Task InvalidateActiveAsync(Guid userId, DateTime nowUtc, CancellationToken ct = default)
            => await _dbContext.PasswordResetCodes
                .Where(c => c.UserId == userId && c.UsedAtUtc == null)
                .ExecuteUpdateAsync(s => s.SetProperty(c => c.UsedAtUtc, (DateTime?)nowUtc), ct);

        public async Task IncrementFailedAttemptsAsync(Guid id, CancellationToken ct = default)
            => await _dbContext.PasswordResetCodes
                .Where(c => c.Id == id)
                .ExecuteUpdateAsync(s => s.SetProperty(c => c.FailedAttempts, c => c.FailedAttempts + 1), ct);

        public async Task<bool> TryConsumeAsync(Guid id, DateTime nowUtc, CancellationToken ct = default)
        {
            var affected = await _dbContext.PasswordResetCodes
                .Where(c => c.Id == id && c.UsedAtUtc == null)
                .ExecuteUpdateAsync(s => s.SetProperty(c => c.UsedAtUtc, (DateTime?)nowUtc), ct);

            return affected == 1;
        }

        public async Task DeleteExpiredForUserAsync(Guid userId, DateTime nowUtc, CancellationToken ct = default)
            => await _dbContext.PasswordResetCodes
                .Where(c => c.UserId == userId && c.ExpiresAtUtc < nowUtc)
                .ExecuteDeleteAsync(ct);
    }
}
