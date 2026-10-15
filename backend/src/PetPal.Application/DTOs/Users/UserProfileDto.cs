using System;

namespace PetPal.Application.DTOs.Users
{
    public class UserProfileDto
    {
        public Guid Id { get; set; }
        public string FullName { get; set; } = null!;
        public string Email { get; set; } = null!;
        public string? Country { get; set; }
        public string? ProfileImageUrl { get; set; }

        public string? Bio { get; set; } 

        public int PostsCount { get; set; }
        public int FollowersCount { get; set; }
        public int FollowingCount { get; set; }

        public DateTime CreatedAt { get; set; }
    }
}