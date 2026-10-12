using Microsoft.AspNetCore.Identity;
using PetPal.Application.Constants;
using PetPal.Application.DTOs.Auth;
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
    public class AuthService : IAuthService
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly ITokenService _tokenService;

        public AuthService(UserManager<ApplicationUser> userManager, ITokenService tokenService)
        {
            _userManager = userManager;
            _tokenService = tokenService;
        }

        public async Task<AuthResponse> RegisterAsync(RegisterRequest request)
        {
            var existingUser = await _userManager.FindByEmailAsync(request.Email);

            if (existingUser is not null)
                throw new ConflictException("Email is already registered.");

            var user = new ApplicationUser
            {
                Id = Guid.NewGuid(),
                UserName = request.Email,
                Email = request.Email,
                FullName = request.FullName,
                CreatedAt = DateTime.UtcNow
            };

            var result = await _userManager.CreateAsync(user, request.Password);

            if (!result.Succeeded)
            {
                var errors = string.Join(", ", result.Errors.Select(e => e.Description));

                throw new BadRequestException(errors);
            }

            // Public registration ALWAYS gets the User role. RegisterRequest has no role field by design.
            var roleResult = await _userManager.AddToRoleAsync(user, Roles.User);

            if (!roleResult.Succeeded)
            {
                await _userManager.DeleteAsync(user);

                throw new InvalidOperationException("Could not assign the default role to the new user.");
            }

            return BuildResponse(user, new List<string> { Roles.User });
        }

        public async Task<AuthResponse> LoginAsync(LoginRequest request)
        {
            var user = await _userManager.FindByEmailAsync(request.Email);

            if (user is null)
                throw new UnauthorizedAccessException("Invalid email or password.");

            var passwordValid = await _userManager.CheckPasswordAsync(user, request.Password);

            if (!passwordValid) throw new UnauthorizedAccessException("Invalid email or password.");

            var roles = await _userManager.GetRolesAsync(user);

            // Users created before roles existed have none: give them the safe default (never Admin).
            if (roles.Count == 0)
            {
                var added = await _userManager.AddToRoleAsync(user, Roles.User);

                if (added.Succeeded)
                    roles = new List<string> { Roles.User };
            }

            return BuildResponse(user, roles);
        }

        private AuthResponse BuildResponse(ApplicationUser user, IList<string> roles)
        {
            var tokenResult = _tokenService.GenerateToken(user.Id, user.Email!, user.FullName, roles);

            return new AuthResponse
            {
                Token = tokenResult.Token,
                ExpiresAt = tokenResult.ExpiresAt,
                UserId = user.Id,
                FullName = user.FullName,
                Email = user.Email!,
                Roles = roles
            };
        }
    }
}
