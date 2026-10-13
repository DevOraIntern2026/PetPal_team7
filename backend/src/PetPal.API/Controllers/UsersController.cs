using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using PetPal.Application.DTOs.Users;
using PetPal.Application.Interfaces;

namespace PetPal.API.Controllers
{
    [Route("api/[controller]/me")]
    [ApiController]
    [Authorize]
    public class UsersController : ControllerBase
    {
        private readonly IUserService _users;

        public UsersController(IUserService users) => _users = users;

        [HttpGet]
        public async Task<IActionResult> GetProfile()
            => Ok(await _users.GetProfileAsync());

        [HttpPut]
        public async Task<IActionResult> UpdateProfile(UpdateProfileRequest request)
            => Ok(await _users.UpdateProfileAsync(request));

        [HttpPost("change-password")]
        public async Task<IActionResult> ChangePassword(ChangePasswordRequest request)
        {
            await _users.ChangePasswordAsync(request);
            return NoContent();
        }
    }
}
