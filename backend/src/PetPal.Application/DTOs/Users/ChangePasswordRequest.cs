using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PetPal.Application.DTOs.Users
{
    public class ChangePasswordRequest
    {
        [Required]
        public string CurrentPassword { get; set; } = null!;

        [Required, MinLength(8), MaxLength(100)]
        public string NewPassword { get; set; } = null!;
    }
}
