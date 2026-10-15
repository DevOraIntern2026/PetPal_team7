using Microsoft.AspNetCore.Hosting;
using PetPal.Application.Exceptions;
using PetPal.Application.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PetPal.Infrastructure.Services
{
    public class LocalFileStorageService : IFileStorageService
    {
        private const long MaxSizeBytes = 5 * 1024 * 1024;

        private static readonly HashSet<string> AllowedFolders = new(StringComparer.OrdinalIgnoreCase) { "profiles", "pets", "posts" };

        private readonly IWebHostEnvironment _env;

        public LocalFileStorageService(IWebHostEnvironment env) => _env = env;

        public async Task<string> SaveImageAsync(Stream content, long length, string folder, CancellationToken ct = default)
        {
            if (!AllowedFolders.Contains(folder))
                throw new BadRequestException("Invalid upload type. Allowed: profiles, pets, posts.");

            if (length <= 0)
                throw new BadRequestException("File is empty.");

            if (length > MaxSizeBytes)
                throw new BadRequestException("File is too large. Maximum size is 5 MB.");

            // Read the first bytes to detect the real file type
            var header = new byte[12];
            var read = await content.ReadAtLeastAsync(header, header.Length, throwOnEndOfStream: false, ct);

            var extension = DetectExtension(header.AsSpan(0, read))
                ?? throw new BadRequestException("Unsupported file. Only JPEG, PNG and WebP images are allowed.");

            var webRoot = _env.WebRootPath ?? Path.Combine(_env.ContentRootPath, "wwwroot");
            var folderName = folder.ToLowerInvariant();
            var directory = Path.Combine(webRoot, "uploads", folderName);
            Directory.CreateDirectory(directory);

            var fileName = $"{Guid.NewGuid():N}{extension}";
            var fullPath = Path.Combine(directory, fileName);

            await using (var fileStream = new FileStream(fullPath, FileMode.CreateNew, FileAccess.Write))
            {
                await fileStream.WriteAsync(header.AsMemory(0, read), ct);
                await content.CopyToAsync(fileStream, ct);
            }

            return $"/uploads/{folderName}/{fileName}";
        }

        private static string? DetectExtension(ReadOnlySpan<byte> h)
        {
            // JPEG: FF D8 FF
            if (h.Length >= 3 && h[0] == 0xFF && h[1] == 0xD8 && h[2] == 0xFF)
                return ".jpg";

            // PNG: 89 50 4E 47 0D 0A 1A 0A
            if (h.Length >= 8 && h[0] == 0x89 && h[1] == 0x50 && h[2] == 0x4E && h[3] == 0x47
                && h[4] == 0x0D && h[5] == 0x0A && h[6] == 0x1A && h[7] == 0x0A)
                return ".png";

            // WebP: "RIFF" .... "WEBP"
            if (h.Length >= 12 && h[0] == 'R' && h[1] == 'I' && h[2] == 'F' && h[3] == 'F'
                && h[8] == 'W' && h[9] == 'E' && h[10] == 'B' && h[11] == 'P')
                return ".webp";

            return null;
        }
    }
}
