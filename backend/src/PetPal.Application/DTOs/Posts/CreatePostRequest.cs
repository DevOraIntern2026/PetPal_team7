namespace PetPal.Application.DTOs.Posts
{
    public class CreatePostRequest
    {
        public string Content { get; set; } = null!;
        public string? Location { get; set; }
        public string? Tags { get; set; }

        public List<ImageUploadDto>? Images { get; set; }
    }
}