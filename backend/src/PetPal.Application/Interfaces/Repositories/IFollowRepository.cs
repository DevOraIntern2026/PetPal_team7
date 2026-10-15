using System;
using System.Threading;
using System.Threading.Tasks;

namespace PetPal.Application.Interfaces.Repositories
{
    public interface IFollowRepository
    {
        Task<bool> ToggleFollowAsync(Guid followerId, Guid followingId, CancellationToken ct);

        Task<List<Guid>> GetFollowersAsync(Guid userId, CancellationToken ct);
        Task<List<Guid>> GetFollowingAsync(Guid userId, CancellationToken ct);
    }
}