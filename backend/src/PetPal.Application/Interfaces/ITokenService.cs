using PetPal.Application.DTOs.Auth;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PetPal.Application.Interfaces
{
    public interface ITokenService
    {
        TokenResult GenerateToken(Guid userId, string email, string fullName);
    }
}
