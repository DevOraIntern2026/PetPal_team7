using Microsoft.AspNetCore.Identity;
using PetPal.Application.DTOs.Posts;
using PetPal.Application.Interfaces;
using PetPal.Domain.Entities;
using PetPal.Infrastructure.Identity;

namespace PetPal.Infrastructure.Services
{
    public class PostService : IPostService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly ICurrentUserService _currentUserService;
        private readonly IFileStorageService _fileStorageService;
        private readonly UserManager<ApplicationUser> _userManager;

        public PostService(
            IUnitOfWork unitOfWork,
            ICurrentUserService currentUserService,
            IFileStorageService fileStorageService,
            UserManager<ApplicationUser> userManager)
        {
            _unitOfWork = unitOfWork;
            _currentUserService = currentUserService;
            _fileStorageService = fileStorageService;
            _userManager = userManager;
        }

        public async Task<Guid> CreateAsync(CreatePostRequest request, CancellationToken ct)
        {
            if (!_currentUserService.IsAuthenticated || _currentUserService.UserId == null)
                throw new UnauthorizedAccessException("User is not logged in.");

            var post = new Post
            {
                UserId = _currentUserService.UserId.Value,
                Content = request.Content,
                Location = request.Location,
                Tags = request.Tags
            };

            await _unitOfWork.Repository<Post>().AddAsync(post);

            if (request.Images != null && request.Images.Any())
            {
                foreach (var image in request.Images)
                {
                    var imageUrl = await _fileStorageService.SaveImageAsync(image.Content, image.Length, "posts", ct);

                    var postImage = new PostImage
                    {
                        Post = post,
                        ImageUrl = imageUrl
                    };
                    await _unitOfWork.Repository<PostImage>().AddAsync(postImage);
                }
            }

            await _unitOfWork.SaveChangesAsync(ct);

            return post.Id;
        }


        public async Task<IEnumerable<PostResponseDto>> GetAllPostsAsync(CancellationToken ct)
        {
            var posts = await _unitOfWork.Posts.GetAllWithImagesAsync(ct);

            var result = posts.Select(p => new PostResponseDto
            {
                Id = p.Id,
                Content = p.Content,
                Location = p.Location,
                Tags = p.Tags,
                CreatedAt = p.CreatedAt,
                UserId = p.UserId,
                Images = p.Images != null ? p.Images.Select(img => img.ImageUrl).ToList() : new List<string>()
            }).ToList();

            return result;
        }

        public async Task<bool> ToggleSavePostAsync(Guid postId, CancellationToken ct)
        {
            if (!_currentUserService.IsAuthenticated || _currentUserService.UserId == null)
                throw new UnauthorizedAccessException("User is not logged in.");

            var isSaved = await _unitOfWork.Posts.ToggleSavePostAsync(_currentUserService.UserId.Value, postId, ct);

            await _unitOfWork.SaveChangesAsync(ct);

            return isSaved;
        }

        public async Task<IEnumerable<PostResponseDto>> GetSavedPostsAsync(CancellationToken ct)
        {
            if (!_currentUserService.IsAuthenticated || _currentUserService.UserId == null)
                throw new UnauthorizedAccessException("User is not logged in.");

            var posts = await _unitOfWork.Posts.GetSavedPostsAsync(_currentUserService.UserId.Value, ct);

            var result = posts.Select(p => new PostResponseDto
            {
                Id = p.Id,
                Content = p.Content,
                Location = p.Location,
                Tags = p.Tags,
                CreatedAt = p.CreatedAt,
                UserId = p.UserId,
                Images = p.Images != null ? p.Images.Select(img => img.ImageUrl).ToList() : new List<string>()
            }).ToList();

            return result;
        }

        public async Task<bool> ToggleLikeAsync(Guid postId, CancellationToken ct)
        {
            if (!_currentUserService.IsAuthenticated || _currentUserService.UserId == null)
                throw new UnauthorizedAccessException("User is not logged in.");

            var currentUserId = _currentUserService.UserId.Value;
            var isLiked = await _unitOfWork.Posts.ToggleLikeAsync(currentUserId, postId, ct);

    
            if (isLiked)
            {
               
                var post = await _unitOfWork.Repository<Post>().GetByIdAsync(postId);

           
                if (post != null && post.UserId != currentUserId)
                {
                    var notification = new Notification
                    {
                        UserId = post.UserId,
                        TriggerById = currentUserId, 
                        Type = "Like",
                        Message = "liked your post",
                        ReferenceId = postId 
                    };
                    await _unitOfWork.Notifications.AddNotificationAsync(notification, ct);
                }
            }
     

            await _unitOfWork.SaveChangesAsync(ct);

            return isLiked;
        }

        public async Task<Guid> AddCommentAsync(Guid postId, CreateCommentRequest request, CancellationToken ct)
        {
            if (!_currentUserService.IsAuthenticated || _currentUserService.UserId == null)
                throw new UnauthorizedAccessException("User is not logged in.");

            var currentUserId = _currentUserService.UserId.Value;

            var comment = new Comment
            {
                PostId = postId,
                UserId = currentUserId,
                Content = request.Content
            };

            await _unitOfWork.Repository<Comment>().AddAsync(comment);

         
            var post = await _unitOfWork.Repository<Post>().GetByIdAsync(postId);

            if (post != null && post.UserId != currentUserId)
            {
                var notification = new Notification
                {
                    UserId = post.UserId,
                    TriggerById = currentUserId,
                    Type = "Comment",
                    Message = "commented on your post",
                    ReferenceId = postId
                };
                await _unitOfWork.Notifications.AddNotificationAsync(notification, ct);
            }
         

            await _unitOfWork.SaveChangesAsync(ct);

            return comment.Id;
        }



        public async Task<IEnumerable<CommentResponseDto>> GetCommentsAsync(Guid postId, CancellationToken ct)
        {
            var comments = await _unitOfWork.Posts.GetCommentsByPostIdAsync(postId, ct);

            return comments.Select(c => new CommentResponseDto
            {
                Id = c.Id,
                Content = c.Content,
                UserId = c.UserId,
                PostId = c.PostId
            }).ToList();
        }

        public async Task<IEnumerable<PostResponseDto>> GetHomeFeedAsync(CancellationToken ct)
        {
            if (!_currentUserService.IsAuthenticated || _currentUserService.UserId == null)
                throw new UnauthorizedAccessException("User is not logged in.");

            var posts = await _unitOfWork.Posts.GetHomeFeedAsync(_currentUserService.UserId.Value, ct);

            var result = new List<PostResponseDto>();

            foreach (var p in posts)
            {
                var user = await _userManager.FindByIdAsync(p.UserId.ToString());

                result.Add(new PostResponseDto
                {
                    Id = p.Id,
                    Content = p.Content,
                    Location = p.Location,
                    Tags = p.Tags,
                    CreatedAt = p.CreatedAt,
                    UserId = p.UserId,
                    Images = p.Images != null ? p.Images.Select(img => img.ImageUrl).ToList() : new List<string>(),

                    UserName = user?.FullName ?? "Unknown User",
                    UserProfileImageUrl = user?.ProfileImageUrl,
                    LikesCount = p.Likes?.Count ?? 0,
                    CommentsCount = p.Comments?.Count ?? 0
                });
            }

            return result;
        }
    }
}