using PetPal.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PetPal.Application.Interfaces.Repositories
{
    public interface IPasswordResetCodeRepository : IGenericRepository<PasswordResetCode>
    {
        Task<PasswordResetCode?> GetLatestActiveAsync(Guid userId, DateTime nowUtc, CancellationToken ct = default);

        Task<DateTime?> GetLatestCreatedAtAsync(Guid userId, CancellationToken ct = default);

        Task InvalidateActiveAsync(Guid userId, DateTime nowUtc, CancellationToken ct = default);

        Task IncrementFailedAttemptsAsync(Guid id, CancellationToken ct = default);

        // Atomic: false if the code was already used.
        Task<bool> TryConsumeAsync(Guid id, DateTime nowUtc, CancellationToken ct = default);

        Task DeleteExpiredForUserAsync(Guid userId, DateTime nowUtc, CancellationToken ct = default);
    }
}
