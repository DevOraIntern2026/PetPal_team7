using Microsoft.AspNetCore.Mvc;
using PetPal.Application.DTOs.Posts;
using PetPal.Application.Interfaces;

namespace PetPal.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PostsController : ControllerBase
    {
        private readonly IPostService _postService;

        public PostsController(IPostService postService)
            => _postService = postService;

        [HttpPost]
        public async Task<IActionResult> Create(
            [FromForm] string content,
            [FromForm] string? location,
            [FromForm] string? tags,
            [FromForm] List<IFormFile>? images,
            CancellationToken ct)
        {
            var request = new CreatePostRequest
            {
                Content = content,
                Location = location,
                Tags = tags
            };

            if (images != null && images.Any())
            {
                request.Images = new List<ImageUploadDto>();
                foreach (var img in images)
                {
                    request.Images.Add(new ImageUploadDto
                    {
                        Content = img.OpenReadStream(),
                        Length = img.Length
                    });
                }
            }

            var postId = await _postService.CreateAsync(request, ct);
            return Ok(new { Id = postId, Message = "Post created successfully!" });
        }
        [HttpGet]
        public async Task<IActionResult> GetAll(CancellationToken ct)
        {
            var posts = await _postService.GetAllPostsAsync(ct);
            return Ok(posts);
        }

        [HttpPost("{postId}/save")]
        public async Task<IActionResult> ToggleSave(Guid postId, CancellationToken ct)
        {
            var isSaved = await _postService.ToggleSavePostAsync(postId, ct);

            var message = isSaved ? "Post saved successfully!" : "Post removed from saved.";
            return Ok(new { IsSaved = isSaved, Message = message });
        }

        [HttpGet("saved")]
        public async Task<IActionResult> GetSavedPosts(CancellationToken ct)
        {
            var posts = await _postService.GetSavedPostsAsync(ct);
            return Ok(posts);
        }

        [HttpPost("{postId}/like")]
        public async Task<IActionResult> ToggleLike(Guid postId, CancellationToken ct)
        {
            var isLiked = await _postService.ToggleLikeAsync(postId, ct);
            var message = isLiked ? "Post liked successfully!" : "Post unliked.";
            return Ok(new { IsLiked = isLiked, Message = message });
        }

        [HttpPost("{postId}/comments")]
        public async Task<IActionResult> AddComment(Guid postId, [FromBody] CreateCommentRequest request, CancellationToken ct)
        {
            var commentId = await _postService.AddCommentAsync(postId, request, ct);
            return Ok(new { Message = "Comment added successfully!", CommentId = commentId });
        }

        [HttpGet("{postId}/comments")]
        public async Task<IActionResult> GetComments(Guid postId, CancellationToken ct)
        {
            var comments = await _postService.GetCommentsAsync(postId, ct);
            return Ok(comments);
        }

        [HttpGet("feed")]
        public async Task<IActionResult> GetHomeFeed(CancellationToken ct)
        {
            var feed = await _postService.GetHomeFeedAsync(ct);
            return Ok(feed);
        }
    }
}