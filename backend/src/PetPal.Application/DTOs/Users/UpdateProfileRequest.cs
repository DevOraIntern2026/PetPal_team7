using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PetPal.Application.DTOs.Users
{
    public class UpdateProfileRequest
    {
        [Required, MaxLength(100)]
        public string FullName { get; set; } = null!;

        [MaxLength(100)]
        public string? Country { get; set; }

        [MaxLength(500)]
        public string? ProfileImageUrl { get; set; }
    }
}
