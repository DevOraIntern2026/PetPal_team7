using PetPal.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PetPal.Application.Interfaces.Repositories
{
    public interface IRefreshTokenRepository : IGenericRepository<RefreshToken>
    {
        Task<RefreshToken?> GetByHashAsync(string tokenHash, CancellationToken ct = default);

        Task<bool> TryRevokeAsync(Guid id, DateTime nowUtc, string? replacedByHash, CancellationToken ct = default);

        Task RevokeAllForUserAsync(Guid userId, DateTime nowUtc, CancellationToken ct = default);

        Task DeleteExpiredForUserAsync(Guid userId, DateTime nowUtc, CancellationToken ct = default);
    }
}
