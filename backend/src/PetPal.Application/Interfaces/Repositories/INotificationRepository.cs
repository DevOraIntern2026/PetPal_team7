using PetPal.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace PetPal.Application.Interfaces.Repositories
{
    public interface INotificationRepository
    {
        Task AddNotificationAsync(Notification notification, CancellationToken ct);
        Task<List<Notification>> GetUserNotificationsAsync(Guid userId, CancellationToken ct);
        Task MarkAsReadAsync(Guid notificationId, CancellationToken ct);
    }
}