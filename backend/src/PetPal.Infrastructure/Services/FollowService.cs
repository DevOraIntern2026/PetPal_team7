using PetPal.Application.Interfaces;
using PetPal.Domain.Entities;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace PetPal.Infrastructure.Services
{
    public class FollowService : IFollowService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly ICurrentUserService _currentUserService;

        public FollowService(IUnitOfWork unitOfWork, ICurrentUserService currentUserService)
        {
            _unitOfWork = unitOfWork;
            _currentUserService = currentUserService;
        }

        public async Task<bool> ToggleFollowAsync(Guid followingId, CancellationToken ct)
        {
            if (!_currentUserService.IsAuthenticated || _currentUserService.UserId == null)
                throw new UnauthorizedAccessException("User is not logged in.");

            if (_currentUserService.UserId.Value == followingId)
                throw new InvalidOperationException("You cannot follow yourself.");

            var isFollowed = await _unitOfWork.Follows.ToggleFollowAsync(_currentUserService.UserId.Value, followingId, ct);

            if (isFollowed)
            {
                var notification = new Notification
                {
                    UserId = followingId, 
                    TriggerById = _currentUserService.UserId.Value, 
                    Type = "Follow",
                    Message = "started following you",
                    ReferenceId = _currentUserService.UserId.Value 
                };
                await _unitOfWork.Notifications.AddNotificationAsync(notification, ct);
            }
          

            await _unitOfWork.SaveChangesAsync(ct);

            return isFollowed;
        }

        public async Task<IEnumerable<Guid>> GetFollowersAsync(Guid userId, CancellationToken ct)
        {
            return await _unitOfWork.Follows.GetFollowersAsync(userId, ct);
        }

        public async Task<IEnumerable<Guid>> GetFollowingAsync(Guid userId, CancellationToken ct)
        {
            return await _unitOfWork.Follows.GetFollowingAsync(userId, ct);
        }
    }
}