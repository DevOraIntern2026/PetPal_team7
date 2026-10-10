using PetPal.Application.DTOs.Users;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PetPal.Application.Interfaces
{
    public interface IUserService
    {
        Task<UserProfileDto> GetProfileAsync();
        Task<UserProfileDto> UpdateProfileAsync(UpdateProfileRequest request);
        Task ChangePasswordAsync(ChangePasswordRequest request);
    }
}
