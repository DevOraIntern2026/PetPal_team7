using Google.Apis.Auth;
using PetPal.Application.Interfaces;
using PetPal.Application.Settings;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http.Json;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace PetPal.Infrastructure.Services
{
    public class ExternalIdentityVerifier : IExternalIdentityVerifier
    {
        private readonly HttpClient _http;
        private readonly GoogleAuthSettings _google;
        private readonly FacebookAuthSettings _facebook;

        public ExternalIdentityVerifier(HttpClient http, GoogleAuthSettings google, FacebookAuthSettings facebook)
        {
            _http = http;
            _google = google;
            _facebook = facebook;
        }

        public async Task<ExternalUserInfo> VerifyGoogleAsync(string idToken)
        {
            var audiences = _google.ClientIds.Where(x => !string.IsNullOrWhiteSpace(x)).ToArray();
            if (audiences.Length == 0)
                throw new InvalidOperationException("Google:ClientIds is not configured.");

            try
            {
                // Checks the signature, expiry and that the token was issued for one of OUR client IDs.
                var payload = await GoogleJsonWebSignature.ValidateAsync(
                    idToken,
                    new GoogleJsonWebSignature.ValidationSettings { Audience = audiences });

                return new ExternalUserInfo("Google", payload.Subject, payload.Email, payload.EmailVerified, payload.Name);
            }
            catch (InvalidJwtException)
            {
                throw new UnauthorizedAccessException("Invalid Google token.");
            }
        }

        public async Task<ExternalUserInfo> VerifyFacebookAsync(string accessToken)
        {
            if (string.IsNullOrWhiteSpace(_facebook.AppId) || string.IsNullOrWhiteSpace(_facebook.AppSecret))
                throw new InvalidOperationException("Facebook:AppId / Facebook:AppSecret are not configured.");

            // 1) Is the token valid AND was it issued for our app? Without this check, a token
            //    from any other Facebook app would be accepted.
            var appToken = $"{_facebook.AppId}|{_facebook.AppSecret}";
            var debug = await GetAsync<DebugResponse>(
                $"debug_token?input_token={Uri.EscapeDataString(accessToken)}&access_token={Uri.EscapeDataString(appToken)}");

            if (debug?.Data is not { IsValid: true } data || data.AppId != _facebook.AppId)
                throw new UnauthorizedAccessException("Invalid Facebook token.");

            // 2) Read the profile.
            var me = await GetAsync<MeResponse>(
                $"me?fields=id,name,email&access_token={Uri.EscapeDataString(accessToken)}");

            if (me is null || string.IsNullOrEmpty(me.Id) || me.Id != data.UserId)
                throw new UnauthorizedAccessException("Invalid Facebook token.");

            // Facebook doesn't guarantee the email is verified, so it is never treated as verified.
            return new ExternalUserInfo("Facebook", me.Id, me.Email, false, me.Name);
        }

        private async Task<T?> GetAsync<T>(string relativeUrl)
        {
            using var response = await _http.GetAsync(relativeUrl);

            if (!response.IsSuccessStatusCode)
                throw new UnauthorizedAccessException("Invalid Facebook token.");

            return await response.Content.ReadFromJsonAsync<T>();
        }

        private sealed class DebugResponse
        {
            [JsonPropertyName("data")] public DebugData? Data { get; set; }
        }

        private sealed class DebugData
        {
            [JsonPropertyName("app_id")] public string? AppId { get; set; }
            [JsonPropertyName("user_id")] public string? UserId { get; set; }
            [JsonPropertyName("is_valid")] public bool IsValid { get; set; }
        }

        private sealed class MeResponse
        {
            [JsonPropertyName("id")] public string? Id { get; set; }
            [JsonPropertyName("name")] public string? Name { get; set; }
            [JsonPropertyName("email")] public string? Email { get; set; }
        }
    }
}
