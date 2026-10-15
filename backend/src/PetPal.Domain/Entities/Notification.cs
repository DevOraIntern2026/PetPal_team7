using PetPal.Domain.Common;
using System;

namespace PetPal.Domain.Entities
{
    public class Notification : BaseEntity
    {
        public Guid UserId { get; set; }

 
        public Guid TriggerById { get; set; }

        public string Type { get; set; } = null!;

        public string Message { get; set; } = null!;

        public Guid? ReferenceId { get; set; }

        public bool IsRead { get; set; } = false;
    }
}