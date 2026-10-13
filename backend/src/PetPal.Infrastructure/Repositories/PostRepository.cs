using Microsoft.EntityFrameworkCore;
using PetPal.Application.Interfaces.Repositories;
using PetPal.Domain.Entities;
using PetPal.Infrastructure.Data;

namespace PetPal.Infrastructure.Repositories
{
    public class PostRepository : GenericRepository<Post>, IPostRepository
    {
        private readonly PetPalDbContext _context;

        public PostRepository(PetPalDbContext context) : base(context)
        {
            _context = context;
        }

        public async Task<List<Post>> GetAllWithImagesAsync(CancellationToken ct)
        {
            return await _context.Set<Post>()
                .Include(p => p.Images) 
                .OrderByDescending(p => p.CreatedAt) 
                .ToListAsync(ct);
        }

        public async Task<bool> ToggleSavePostAsync(Guid userId, Guid postId, CancellationToken ct)
        {
            var savedPost = await _context.Set<SavedPost>()
                .FirstOrDefaultAsync(sp => sp.UserId == userId && sp.PostId == postId, ct);

            if (savedPost == null)
            {
                await _context.Set<SavedPost>().AddAsync(new SavedPost
                {
                    UserId = userId,
                    PostId = postId
                }, ct);

                return true; 
            }
            else
            {
                _context.Set<SavedPost>().Remove(savedPost);

                return false;
            }
        }

        public async Task<List<Post>> GetSavedPostsAsync(Guid userId, CancellationToken ct)
        {
            return await _context.Set<SavedPost>()
                .Where(sp => sp.UserId == userId)
                .Include(sp => sp.Post)
                    .ThenInclude(p => p.Images) 
                .OrderByDescending(sp => sp.CreatedAt)
                .Select(sp => sp.Post)
                .ToListAsync(ct);
        }

        public async Task<bool> ToggleLikeAsync(Guid userId, Guid postId, CancellationToken ct)
        {
            var like = await _context.Set<PostLike>()
                .FirstOrDefaultAsync(l => l.UserId == userId && l.PostId == postId, ct);

            if (like == null)
            {
                await _context.Set<PostLike>().AddAsync(new PostLike { UserId = userId, PostId = postId }, ct);
                return true; 
            }
            else
            {
                _context.Set<PostLike>().Remove(like);
                return false;
            }
        }

        public async Task<List<Comment>> GetCommentsByPostIdAsync(Guid postId, CancellationToken ct)
        {
            return await _context.Set<Comment>()
                .Where(c => c.PostId == postId)
                .ToListAsync(ct);
        }

        public async Task<List<Post>> GetHomeFeedAsync(Guid userId, CancellationToken ct)
        {
            var followingIds = await _context.Set<UserFollow>()
                .Where(f => f.FollowerId == userId)
                .Select(f => f.FollowingId)
                .ToListAsync(ct);

            followingIds.Add(userId);

            return await _context.Set<Post>()
                .Where(p => followingIds.Contains(p.UserId))
                .Include(p => p.Images)
                .Include(p => p.Likes)    
                .Include(p => p.Comments) 
                .OrderByDescending(p => p.CreatedAt)
                .ToListAsync(ct);
        }
        public async Task<int> GetPostsCountAsync(Guid userId, CancellationToken ct)
        {
            return await _context.Set<Post>()
                .CountAsync(p => p.UserId == userId, ct);
        }
    }
}