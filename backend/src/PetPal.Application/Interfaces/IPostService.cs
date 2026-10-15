using PetPal.Application.DTOs.Posts;

namespace PetPal.Application.Interfaces
{
    public interface IPostService
    {
        Task<Guid> CreateAsync(CreatePostRequest request, CancellationToken ct);
        Task<IEnumerable<PostResponseDto>> GetAllPostsAsync(CancellationToken ct);
        Task<bool> ToggleSavePostAsync(Guid postId, CancellationToken ct);
        Task<IEnumerable<PostResponseDto>> GetSavedPostsAsync(CancellationToken ct);
        Task<bool> ToggleLikeAsync(Guid postId, CancellationToken ct);
        Task<Guid> AddCommentAsync(Guid postId, CreateCommentRequest request, CancellationToken ct);
        Task<IEnumerable<CommentResponseDto>> GetCommentsAsync(Guid postId, CancellationToken ct);
        Task<IEnumerable<PostResponseDto>> GetHomeFeedAsync(CancellationToken ct);
    }
}