using PetPal.Domain.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PetPal.Domain.Entities
{
    public class PasswordResetCode : BaseEntity
    {
        // FK -> ApplicationUser (Infrastructure). No navigation, same convention as Pet.OwnerId.
        public Guid UserId { get; set; }

        // SHA-256 (Base64) of "userId:code". The code itself is never stored.
        public string CodeHash { get; set; } = null!;

        public DateTime ExpiresAtUtc { get; set; }
        public int FailedAttempts { get; set; }
        public DateTime? UsedAtUtc { get; set; }
    }
}
