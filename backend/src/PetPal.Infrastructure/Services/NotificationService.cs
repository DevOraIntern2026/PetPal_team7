using Microsoft.AspNetCore.Identity;
using PetPal.Application.DTOs.Notifications;
using PetPal.Application.Interfaces;
using PetPal.Infrastructure.Identity;
using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace PetPal.Infrastructure.Services
{
    public class NotificationService : INotificationService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly ICurrentUserService _currentUserService;
        private readonly UserManager<ApplicationUser> _userManager;

        public NotificationService(IUnitOfWork unitOfWork, ICurrentUserService currentUserService, UserManager<ApplicationUser> userManager)
        {
            _unitOfWork = unitOfWork;
            _currentUserService = currentUserService;
            _userManager = userManager;
        }

        public async Task<IEnumerable<NotificationResponseDto>> GetMyNotificationsAsync(CancellationToken ct)
        {
            if (!_currentUserService.IsAuthenticated || _currentUserService.UserId == null)
                throw new UnauthorizedAccessException("User is not logged in.");

            var notifications = await _unitOfWork.Notifications.GetUserNotificationsAsync(_currentUserService.UserId.Value, ct);
            var result = new List<NotificationResponseDto>();

            foreach (var n in notifications)
            {
                var triggerUser = await _userManager.FindByIdAsync(n.TriggerById.ToString());

                result.Add(new NotificationResponseDto
                {
                    Id = n.Id,
                    Type = n.Type,
                    Message = n.Message,
                    ReferenceId = n.ReferenceId,
                    IsRead = n.IsRead,
                    CreatedAt = n.CreatedAt,
                    TriggerById = n.TriggerById,
                    TriggerByName = triggerUser?.FullName ?? "Unknown User",
                    TriggerByImageUrl = triggerUser?.ProfileImageUrl
                });
            }

            return result;
        }

        public async Task MarkAsReadAsync(Guid notificationId, CancellationToken ct)
        {
            await _unitOfWork.Notifications.MarkAsReadAsync(notificationId, ct);
            await _unitOfWork.SaveChangesAsync(ct);
        }
    }
}