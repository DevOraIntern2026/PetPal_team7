using System;

namespace PetPal.Application.DTOs.Posts
{
    public class CommentResponseDto
    {
        public Guid Id { get; set; }
        public string Content { get; set; } = null!;
        public Guid UserId { get; set; }
        public Guid PostId { get; set; }
    }
}