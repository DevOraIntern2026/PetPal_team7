namespace PetPal.Application.DTOs.Posts
{
    public class PostResponseDto
    {
        public Guid Id { get; set; }
        public string Content { get; set; } = null!;
        public string? Location { get; set; }
        public string? Tags { get; set; }
        public DateTime CreatedAt { get; set; }

        public Guid UserId { get; set; }

        public List<string> Images { get; set; } = new List<string>();

        public string UserName { get; set; } = "Unknown";
        public string? UserProfileImageUrl { get; set; }
        public int LikesCount { get; set; }
        public int CommentsCount { get; set; }
    }
}