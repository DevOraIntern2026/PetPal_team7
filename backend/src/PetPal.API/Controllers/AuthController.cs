using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using PetPal.Application.DTOs.Auth;
using PetPal.Application.Interfaces;

namespace PetPal.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;
        private readonly IPasswordResetService _passwordReset;

        public AuthController(IAuthService authService, IPasswordResetService passwordReset)
        {
            _authService = authService;
            _passwordReset = passwordReset;
        }

        [HttpPost("register")]
        public async Task<ActionResult<AuthResponse>> Register(RegisterRequest request)
        {
            var response = await _authService.RegisterAsync(request);

            return Ok(response);
        }

        [HttpPost("login")]
        public async Task<ActionResult<AuthResponse>> Login(LoginRequest request)
        {
            var response = await _authService.LoginAsync(request);

            return Ok(response);
        }

        [HttpPost("refresh")]
        public async Task<ActionResult<AuthResponse>> Refresh(RefreshTokenRequest request)
            => Ok(await _authService.RefreshAsync(request));

        [HttpPost("logout")]
        public async Task<IActionResult> Logout(RefreshTokenRequest request)
        {
            await _authService.LogoutAsync(request);
            return NoContent();
        }

        [HttpPost("forgot-password")]
        public async Task<IActionResult> ForgotPassword(ForgotPasswordRequest request)
        {
            await _passwordReset.ForgotPasswordAsync(request);
            return Ok(new { message = "If this email is registered, a reset code has been sent." });
        }

        [HttpPost("reset-password")]
        public async Task<IActionResult> ResetPassword(ResetPasswordRequest request)
        {
            await _passwordReset.ResetPasswordAsync(request);
            return NoContent();
        }

        [HttpPost("google")]
        public async Task<IActionResult> Google(ExternalLoginRequest request)
            => Ok(await _authService.GoogleLoginAsync(request));

        [HttpPost("facebook")]
        public async Task<IActionResult> Facebook(ExternalLoginRequest request)
            => Ok(await _authService.FacebookLoginAsync(request));
    }
}
