using PetPal.Application.DTOs.Notifications;
using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace PetPal.Application.Interfaces
{
    public interface INotificationService
    {
        Task<IEnumerable<NotificationResponseDto>> GetMyNotificationsAsync(CancellationToken ct);
        Task MarkAsReadAsync(Guid notificationId, CancellationToken ct);
    }
}       