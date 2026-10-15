using Microsoft.EntityFrameworkCore;
using PetPal.Application.Interfaces.Repositories;
using PetPal.Domain.Entities;
using PetPal.Infrastructure.Data;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace PetPal.Infrastructure.Repositories
{
    public class FollowRepository : IFollowRepository
    {
        private readonly PetPalDbContext _context;
        public FollowRepository(PetPalDbContext context) => _context = context;

        public async Task<bool> ToggleFollowAsync(Guid followerId, Guid followingId, CancellationToken ct)
        {
            var follow = await _context.Set<UserFollow>()
                .FirstOrDefaultAsync(f => f.FollowerId == followerId && f.FollowingId == followingId, ct);

            if (follow == null)
            {
                await _context.Set<UserFollow>().AddAsync(new UserFollow { FollowerId = followerId, FollowingId = followingId }, ct);
                return true; 
            }
            else
            {
                _context.Set<UserFollow>().Remove(follow);
                return false;
            }
        }

        public async Task<List<Guid>> GetFollowersAsync(Guid userId, CancellationToken ct)
        {
            // بنجيب الناس اللي بتتابع اليوزر ده
            return await _context.Set<UserFollow>()
                .Where(f => f.FollowingId == userId)
                .Select(f => f.FollowerId)
                .ToListAsync(ct);
        }

        public async Task<List<Guid>> GetFollowingAsync(Guid userId, CancellationToken ct)
        {
            return await _context.Set<UserFollow>()
                .Where(f => f.FollowerId == userId)
                .Select(f => f.FollowingId)
                .ToListAsync(ct);
        }
    }
}