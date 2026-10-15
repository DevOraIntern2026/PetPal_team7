using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PetPal.Application.Interfaces
{
    public record ExternalUserInfo(
        string Provider,
        string ProviderKey,
        string? Email,
        bool EmailVerified,
        string? Name);

    public interface IExternalIdentityVerifier
    {
        // Both throw UnauthorizedAccessException when the token is invalid.
        Task<ExternalUserInfo> VerifyGoogleAsync(string idToken);
        Task<ExternalUserInfo> VerifyFacebookAsync(string accessToken);
    }
}
