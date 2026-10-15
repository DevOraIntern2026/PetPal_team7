using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using PetPal.Application.DTOs.Users;
using PetPal.Application.Interfaces;
using PetPal.Infrastructure.Identity;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace PetPal.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class ProfileController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly IUnitOfWork _unitOfWork;

        public ProfileController(UserManager<ApplicationUser> userManager, IUnitOfWork unitOfWork)
        {
            _userManager = userManager;
            _unitOfWork = unitOfWork;
        }

        [HttpGet("{userId}")]
        public async Task<IActionResult> GetUserProfile(Guid userId, CancellationToken ct)
        {
            var user = await _userManager.FindByIdAsync(userId.ToString());
            if (user == null)
                return NotFound(new { Message = "User not found." });

            var followers = await _unitOfWork.Follows.GetFollowersAsync(userId, ct);
            var following = await _unitOfWork.Follows.GetFollowingAsync(userId, ct);
            var postsCount = await _unitOfWork.Posts.GetPostsCountAsync(userId, ct);

            var profileDto = new UserProfileDto
            {
                Id = user.Id,
                FullName = user.FullName,
                ProfileImageUrl = user.ProfileImageUrl,
                Bio = user.Bio,
                Country = user.Country,
                FollowersCount = followers.Count,
                FollowingCount = following.Count,
                PostsCount = postsCount
            };

            return Ok(profileDto);
        }
    }
}