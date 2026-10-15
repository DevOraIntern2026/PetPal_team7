using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PetPal.Application.Interfaces;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace PetPal.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class NotificationsController : ControllerBase
    {
        private readonly INotificationService _notificationService;

        public NotificationsController(INotificationService notificationService)
        {
            _notificationService = notificationService;
        }

        [HttpGet]
        public async Task<IActionResult> GetMyNotifications(CancellationToken ct)
        {
            var notifications = await _notificationService.GetMyNotificationsAsync(ct);
            return Ok(notifications);
        }

        [HttpPut("{id}/read")]
        public async Task<IActionResult> MarkAsRead(Guid id, CancellationToken ct)
        {
            await _notificationService.MarkAsReadAsync(id, ct);
            return NoContent();
        }
    }
}