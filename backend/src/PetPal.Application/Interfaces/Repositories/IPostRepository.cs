using PetPal.Domain.Entities;

namespace PetPal.Application.Interfaces.Repositories
{
    public interface IPostRepository : IGenericRepository<Post>
    {
        Task<List<Post>> GetAllWithImagesAsync(CancellationToken ct);

        Task<bool> ToggleSavePostAsync(Guid userId, Guid postId, CancellationToken ct);
        Task<List<Post>> GetSavedPostsAsync(Guid userId, CancellationToken ct);
        Task<bool> ToggleLikeAsync(Guid userId, Guid postId, CancellationToken ct);
        Task<List<Comment>> GetCommentsByPostIdAsync(Guid postId, CancellationToken ct);

        Task<List<Post>> GetHomeFeedAsync(Guid userId, CancellationToken ct);
        Task<int> GetPostsCountAsync(Guid userId, CancellationToken ct);
    }
}