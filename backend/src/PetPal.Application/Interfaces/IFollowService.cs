using System;
using System.Threading;
using System.Threading.Tasks;

namespace PetPal.Application.Interfaces
{
    public interface IFollowService
    {
        Task<bool> ToggleFollowAsync(Guid followingId, CancellationToken ct);

        Task<IEnumerable<Guid>> GetFollowersAsync(Guid userId, CancellationToken ct);
        Task<IEnumerable<Guid>> GetFollowingAsync(Guid userId, CancellationToken ct);
    }
}