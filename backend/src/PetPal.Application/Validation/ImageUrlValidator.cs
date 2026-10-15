using PetPal.Application.Exceptions;

namespace PetPal.Application.Validation;

public static class ImageUrlValidator
{
    /// <summary>Accepts null, an absolute http(s) URL, or a server-relative "/uploads/..." path.</summary>
    public static string? Normalize(string? url)
    {
        if (string.IsNullOrWhiteSpace(url)) return null;

        url = url.Trim();

        var ok = url.StartsWith("/uploads/", StringComparison.Ordinal) ||
                 (Uri.TryCreate(url, UriKind.Absolute, out var uri) &&
                  (uri.Scheme == Uri.UriSchemeHttp || uri.Scheme == Uri.UriSchemeHttps));

        if (!ok)
            throw new BadRequestException("Image URL must be an http(s) URL or an /uploads/ path.");

        return url;
    }
}
