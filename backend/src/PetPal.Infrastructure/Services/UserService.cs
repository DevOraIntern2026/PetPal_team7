using Microsoft.AspNetCore.Identity;
using PetPal.Application.DTOs.Users;
using PetPal.Application.Exceptions;
using PetPal.Application.Interfaces;
using PetPal.Infrastructure.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PetPal.Infrastructure.Services
{
    public class UserService : IUserService
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly ICurrentUserService _currentUser;
        private readonly IUnitOfWork _uow;

        public UserService(UserManager<ApplicationUser> userManager, ICurrentUserService currentUser, IUnitOfWork uow)
        {
            _userManager = userManager;
            _currentUser = currentUser;
            _uow = uow;
        }

        public async Task<UserProfileDto> GetProfileAsync()
        {
            var user = await GetCurrentUserAsync();

            return ToDto(user);
        }

        public async Task<UserProfileDto> UpdateProfileAsync(UpdateProfileRequest request)
        {
            var user = await GetCurrentUserAsync();

            user.FullName = request.FullName.Trim();
            user.Country = request.Country?.Trim();
            user.ProfileImageUrl = request.ProfileImageUrl;

            var result = await _userManager.UpdateAsync(user);

            ThrowIfFailed(result);

            return ToDto(user);
        }

        public async Task ChangePasswordAsync(ChangePasswordRequest request)
        {
            var user = await GetCurrentUserAsync();
            if (!await _userManager.HasPasswordAsync(user))
                throw new BadRequestException("This account has no password yet. Use 'Forgot password' to set one.");

            var result = await _userManager.ChangePasswordAsync(user, request.CurrentPassword, request.NewPassword);

            ThrowIfFailed(result);
            // Sign the user out of every device.
            await _uow.RefreshTokens.RevokeAllForUserAsync(user.Id, DateTime.UtcNow);
        }

        private async Task<ApplicationUser> GetCurrentUserAsync()
        {
            var userId = _currentUser.UserId
                ?? throw new UnauthorizedAccessException("User is not authenticated.");

            return await _userManager.FindByIdAsync(userId.ToString())
                ?? throw new NotFoundException("User not found.");
        }

        private static void ThrowIfFailed(IdentityResult result)
        {
            if (result.Succeeded) return;

            throw new BadRequestException(string.Join(", ", result.Errors.Select(e => e.Description)));
        }

        private static UserProfileDto ToDto(ApplicationUser user) => new()
        {
            Id = user.Id,
            FullName = user.FullName,
            Email = user.Email!,
            Country = user.Country,
            ProfileImageUrl = user.ProfileImageUrl,
            CreatedAt = user.CreatedAt
        };
    }
}
