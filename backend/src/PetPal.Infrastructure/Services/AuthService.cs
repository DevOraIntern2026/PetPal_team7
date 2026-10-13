using Microsoft.AspNetCore.Identity;
using PetPal.Application.Constants;
using PetPal.Application.DTOs.Auth;
using PetPal.Application.Exceptions;
using PetPal.Application.Interfaces;
using PetPal.Application.Settings;
using PetPal.Domain.Entities;
using PetPal.Infrastructure.Identity;

namespace PetPal.Infrastructure.Services
{
    public class AuthService : IAuthService
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly ITokenService _tokenService;
        private readonly IUnitOfWork _uow;
        private readonly JwtSettings _jwtSettings;
        private readonly IExternalIdentityVerifier _externalVerifier;
        public AuthService(
            UserManager<ApplicationUser> userManager,
            ITokenService tokenService,
            IUnitOfWork uow,
            JwtSettings jwtSettings,
            IExternalIdentityVerifier externalVerifier)
        {
            _userManager = userManager;
            _tokenService = tokenService;
            _uow = uow;
            _jwtSettings = jwtSettings;
            _externalVerifier = externalVerifier;
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

            return await BuildResponseAsync(user, new List<string> { Roles.User });
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

            return await BuildResponseAsync(user, roles);
        }

        public async Task<AuthResponse> RefreshAsync(RefreshTokenRequest request)
        {
            var now = DateTime.UtcNow;
            var hash = _tokenService.HashRefreshToken(request.RefreshToken);

            var stored = await _uow.RefreshTokens.GetByHashAsync(hash)
                ?? throw new UnauthorizedAccessException("Invalid refresh token.");

            // A revoked token being used again may mean it was stolen: sign the user out everywhere.
            if (stored.RevokedAtUtc is not null)
            {
                await _uow.RefreshTokens.RevokeAllForUserAsync(stored.UserId, now);
                throw new UnauthorizedAccessException("Invalid refresh token.");
            }

            if (stored.ExpiresAtUtc <= now)
                throw new UnauthorizedAccessException("Refresh token expired. Please log in again.");

            var user = await _userManager.FindByIdAsync(stored.UserId.ToString())
                ?? throw new UnauthorizedAccessException("Invalid refresh token.");

            var newRawToken = _tokenService.GenerateRefreshToken();
            var newHash = _tokenService.HashRefreshToken(newRawToken);

            // Atomic: only one concurrent request can consume this token.
            if (!await _uow.RefreshTokens.TryRevokeAsync(stored.Id, now, newHash))
                throw new UnauthorizedAccessException("Invalid refresh token.");

            var roles = await _userManager.GetRolesAsync(user);

            return await BuildResponseAsync(user, roles, newRawToken);
        }

        public async Task LogoutAsync(RefreshTokenRequest request)
        {
            var hash = _tokenService.HashRefreshToken(request.RefreshToken);
            var stored = await _uow.RefreshTokens.GetByHashAsync(hash);

            // Always succeeds from the caller's point of view: we don't reveal whether the token existed.
            if (stored is not null)
                await _uow.RefreshTokens.TryRevokeAsync(stored.Id, DateTime.UtcNow, null);
        }

        public async Task<AuthResponse> GoogleLoginAsync(ExternalLoginRequest request)
        {
            var info = await _externalVerifier.VerifyGoogleAsync(request.Token);
            return await ExternalLoginAsync(info, linkByEmail: true);
        }

        public async Task<AuthResponse> FacebookLoginAsync(ExternalLoginRequest request)
        {
            var info = await _externalVerifier.VerifyFacebookAsync(request.Token);
            return await ExternalLoginAsync(info, linkByEmail: false);
        }

        private async Task<AuthResponse> ExternalLoginAsync(ExternalUserInfo info, bool linkByEmail)
        {
            // 1) Already linked: plain sign-in.
            var user = await _userManager.FindByLoginAsync(info.Provider, info.ProviderKey);

            if (user is null)
            {
                if (string.IsNullOrWhiteSpace(info.Email))
                    throw new BadRequestException(
                        $"Your {info.Provider} account has no email address, so we can't create a PetPal account from it.");

                var email = info.Email.Trim();
                var loginInfo = new UserLoginInfo(info.Provider, info.ProviderKey, info.Provider);
                var existing = await _userManager.FindByEmailAsync(email);

                if (existing is not null)
                {
                    // 2) Same email as an existing account. Link only when the provider vouches for the email.
                    if (!linkByEmail || !info.EmailVerified)
                        throw new ConflictException(
                            "An account with this email already exists. Please sign in with your email and password.");

                    var link = await _userManager.AddLoginAsync(existing, loginInfo);
                    if (!link.Succeeded)
                        throw new BadRequestException(string.Join(", ", link.Errors.Select(e => e.Description)));

                    // PetPal never verifies emails at registration. Someone could have registered
                    // the victim's email with a password of their own beforehand. Now that the real
                    // owner proved the email through Google, drop that unverified password and
                    // sign out every old session.
                    if (!existing.EmailConfirmed)
                    {
                        existing.EmailConfirmed = true;
                        await _userManager.UpdateAsync(existing);

                        if (await _userManager.HasPasswordAsync(existing))
                            await _userManager.RemovePasswordAsync(existing);

                        await _uow.RefreshTokens.RevokeAllForUserAsync(existing.Id, DateTime.UtcNow);
                    }

                    user = existing;
                }
                else
                {
                    // 3) Brand new user.
                    user = new ApplicationUser
                    {
                        UserName = email,
                        Email = email,
                        FullName = string.IsNullOrWhiteSpace(info.Name) ? email : info.Name.Trim(),
                        EmailConfirmed = info.EmailVerified
                    };

                    var create = await _userManager.CreateAsync(user); // no password
                    if (!create.Succeeded)
                        throw new BadRequestException(string.Join(", ", create.Errors.Select(e => e.Description)));

                    await _userManager.AddToRoleAsync(user, Roles.User);

                    var link = await _userManager.AddLoginAsync(user, loginInfo);
                    if (!link.Succeeded)
                        throw new BadRequestException(string.Join(", ", link.Errors.Select(e => e.Description)));
                }
            }

            var roles = await _userManager.GetRolesAsync(user);
            return await BuildResponseAsync(user, roles);
        }



        private async Task<AuthResponse> BuildResponseAsync(ApplicationUser user, IList<string> roles, string? rawRefreshToken = null)
        {
            var accessToken = _tokenService.GenerateToken(user.Id, user.Email!, user.FullName, roles);

            var now = DateTime.UtcNow;
            rawRefreshToken ??= _tokenService.GenerateRefreshToken();
            var refreshExpiresAt = now.AddDays(_jwtSettings.RefreshTokenDurationInDays);

            // Housekeeping: drop this user's expired tokens.
            await _uow.RefreshTokens.DeleteExpiredForUserAsync(user.Id, now);

            await _uow.RefreshTokens.AddAsync(new RefreshToken
            {
                UserId = user.Id,
                TokenHash = _tokenService.HashRefreshToken(rawRefreshToken),
                ExpiresAtUtc = refreshExpiresAt
            });
            await _uow.SaveChangesAsync();

            return new AuthResponse
            {
                Token = accessToken.Token,
                ExpiresAt = accessToken.ExpiresAt,
                RefreshToken = rawRefreshToken,
                RefreshTokenExpiresAt = refreshExpiresAt,
                UserId = user.Id,
                FullName = user.FullName,
                Email = user.Email!,
                Roles = roles
            };
        }
    }
}