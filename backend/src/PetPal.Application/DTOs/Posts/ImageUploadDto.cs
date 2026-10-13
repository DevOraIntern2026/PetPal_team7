namespace PetPal.Application.DTOs.Posts
{
    public class ImageUploadDto
    {
        public Stream Content { get; set; } = null!;
        public long Length { get; set; }
    }
}