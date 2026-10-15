using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PetPal.Application.Interfaces;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace PetPal.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class FollowsController : ControllerBase
    {
        private readonly IFollowService _followService;

        public FollowsController(IFollowService followService)
        {
            _followService = followService;
        }

        [HttpPost("{userId}/toggle")]
        public async Task<IActionResult> ToggleFollow(Guid userId, CancellationToken ct)
        {
            try
            {
                var isFollowed = await _followService.ToggleFollowAsync(userId, ct);
                var message = isFollowed ? "User followed successfully!" : "User unfollowed.";
                return Ok(new { IsFollowed = isFollowed, Message = message });
            }
            catch (Exception ex)
            {
                return BadRequest(new { Message = ex.Message });
            }
        }

        [HttpGet("{userId}/followers")]
        public async Task<IActionResult> GetFollowers(Guid userId, CancellationToken ct)
        {
            var followers = await _followService.GetFollowersAsync(userId, ct);
            return Ok(followers);
        }

        [HttpGet("{userId}/following")]
        public async Task<IActionResult> GetFollowing(Guid userId, CancellationToken ct)
        {
            var following = await _followService.GetFollowingAsync(userId, ct);
            return Ok(following);
        }
    }
}