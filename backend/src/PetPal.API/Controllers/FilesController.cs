using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using PetPal.Application.Exceptions;
using PetPal.Application.Interfaces;

namespace PetPal.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class FilesController : ControllerBase
    {
        private readonly IFileStorageService _storage;

        public FilesController(IFileStorageService storage) => _storage = storage;


        [HttpPost("upload")]
        public async Task<IActionResult> Upload(IFormFile file, [FromQuery] string type, CancellationToken ct)
        {
            if (file is null)
                throw new BadRequestException("No file was uploaded.");

            await using var stream = file.OpenReadStream();

            var relativePath = await _storage.SaveImageAsync(stream, file.Length, type, ct);

            var url = $"{Request.Scheme}://{Request.Host}{relativePath}";

            return Ok(new { url, path = relativePath });
        }
    }
}
