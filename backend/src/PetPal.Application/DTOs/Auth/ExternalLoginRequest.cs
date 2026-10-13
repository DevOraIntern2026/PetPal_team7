using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PetPal.Application.DTOs.Auth
{
    public class ExternalLoginRequest
    {
        // Google: the idToken. Facebook: the access token.
        [Required, MaxLength(4096)]
        public string Token { get; set; } = null!;
    }
}
