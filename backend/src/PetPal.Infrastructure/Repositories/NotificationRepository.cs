using Microsoft.EntityFrameworkCore;
using PetPal.Application.Interfaces.Repositories;
using PetPal.Domain.Entities;
using PetPal.Infrastructure.Data;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace PetPal.Infrastructure.Repositories
{
    public class NotificationRepository : INotificationRepository
    {
        private readonly PetPalDbContext _context;
        public NotificationRepository(PetPalDbContext context) => _context = context;

        public async Task AddNotificationAsync(Notification notification, CancellationToken ct)
        {
            await _context.Set<Notification>().AddAsync(notification, ct);
        }

        public async Task<List<Notification>> GetUserNotificationsAsync(Guid userId, CancellationToken ct)
        {
   
            return await _context.Set<Notification>()
                .Where(n => n.UserId == userId)
                .OrderByDescending(n => n.CreatedAt)
                .ToListAsync(ct);
        }

        public async Task MarkAsReadAsync(Guid notificationId, CancellationToken ct)
        {
            var notification = await _context.Set<Notification>().FindAsync(new object[] { notificationId }, ct);
            if (notification != null)
            {
                notification.IsRead = true;
            }
        }
    }
}