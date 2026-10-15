using System.Security.Cryptography;
using System.Text;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Logging;
using PetPal.Application.DTOs.Auth;
using PetPal.Application.Exceptions;
using PetPal.Application.Interfaces;
using PetPal.Domain.Entities;
using PetPal.Infrastructure.Identity;

namespace PetPal.Infrastructure.Services
{
    public class PasswordResetService : IPasswordResetService
    {
        private const int CodeLifetimeMinutes = 15;
        private const int MaxFailedAttempts = 5;
        private const int ResendCooldownSeconds = 60;
        private const string InvalidCodeMessage = "Invalid or expired code.";

        private readonly UserManager<ApplicationUser> _userManager;
        private readonly IUnitOfWork _uow;
        private readonly IEmailService _email;
        private readonly ILogger<PasswordResetService> _logger;

        public PasswordResetService(
            UserManager<ApplicationUser> userManager,
            IUnitOfWork uow,
            IEmailService email,
            ILogger<PasswordResetService> logger)
        {
            _userManager = userManager;
            _uow = uow;
            _email = email;
            _logger = logger;
        }

        public async Task ForgotPasswordAsync(ForgotPasswordRequest request)
        {
            var user = await _userManager.FindByEmailAsync(request.Email.Trim());

            // Same result whether or not the account exists, so this endpoint can't be used
            // to find out which emails are registered.
            if (user is null || string.IsNullOrEmpty(user.Email))
                return;

            var now = DateTime.UtcNow;

            var lastCreated = await _uow.PasswordResetCodes.GetLatestCreatedAtAsync(user.Id);
            if (lastCreated is { } last && last > now.AddSeconds(-ResendCooldownSeconds))
                return; // asked too recently; the previous code is still valid

            await _uow.PasswordResetCodes.DeleteExpiredForUserAsync(user.Id, now);
            await _uow.PasswordResetCodes.InvalidateActiveAsync(user.Id, now);

            var code = RandomNumberGenerator.GetInt32(0, 1_000_000).ToString("D6");

            await _uow.PasswordResetCodes.AddAsync(new PasswordResetCode
            {
                UserId = user.Id,
                CodeHash = HashCode(user.Id, code),
                ExpiresAtUtc = now.AddMinutes(CodeLifetimeMinutes)
            });
            await _uow.SaveChangesAsync();

            try
            {
                var (subject, html, text) = PasswordResetEmail.Build(code, CodeLifetimeMinutes);
                await _email.SendAsync(user.Email, subject, html, text);
            }
            catch (Exception ex)
            {
                // Not reported to the caller: that would reveal that the account exists.
                _logger.LogError(ex, "Could not send the password reset email to user {UserId}.", user.Id);
            }
        }

        public async Task ResetPasswordAsync(ResetPasswordRequest request)
        {
            var now = DateTime.UtcNow;

            var user = await _userManager.FindByEmailAsync(request.Email.Trim())
                ?? throw new BadRequestException(InvalidCodeMessage);

            var stored = await _uow.PasswordResetCodes.GetLatestActiveAsync(user.Id, now)
                ?? throw new BadRequestException(InvalidCodeMessage);

            if (stored.FailedAttempts >= MaxFailedAttempts)
                throw new BadRequestException(InvalidCodeMessage);

            var expected = Encoding.UTF8.GetBytes(stored.CodeHash);
            var actual = Encoding.UTF8.GetBytes(HashCode(user.Id, request.Code));

            if (!CryptographicOperations.FixedTimeEquals(expected, actual))
            {
                await _uow.PasswordResetCodes.IncrementFailedAttemptsAsync(stored.Id);
                throw new BadRequestException(InvalidCodeMessage);
            }

            // A weak password must not burn a correct code, so the code is consumed only after the reset succeeds.
            var token = await _userManager.GeneratePasswordResetTokenAsync(user);
            var result = await _userManager.ResetPasswordAsync(user, token, request.NewPassword);

            if (!result.Succeeded)
                throw new BadRequestException(string.Join(", ", result.Errors.Select(e => e.Description)));

            await _uow.PasswordResetCodes.TryConsumeAsync(stored.Id, now);

            // Sign the user out of every device.
            await _uow.RefreshTokens.RevokeAllForUserAsync(user.Id, now);
        }

        private static string HashCode(Guid userId, string code)
            => Convert.ToBase64String(SHA256.HashData(Encoding.UTF8.GetBytes($"{userId:N}:{code}")));
    }
}