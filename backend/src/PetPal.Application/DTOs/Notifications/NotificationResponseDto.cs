using System;

namespace PetPal.Application.DTOs.Notifications
{
    public class NotificationResponseDto
    {
        public Guid Id { get; set; }
        public string Type { get; set; } = null!;
        public string Message { get; set; } = null!;
        public Guid? ReferenceId { get; set; }
        public bool IsRead { get; set; }
        public DateTime CreatedAt { get; set; }

        public Guid TriggerById { get; set; }
        public string TriggerByName { get; set; } = "Unknown";
        public string? TriggerByImageUrl { get; set; }
    }
}