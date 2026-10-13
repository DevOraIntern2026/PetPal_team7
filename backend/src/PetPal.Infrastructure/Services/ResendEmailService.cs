using System.Net.Http.Headers;
using System.Net.Http.Json;
using System.Text.Json.Serialization;
using PetPal.Application.Interfaces;
using PetPal.Application.Settings;

namespace PetPal.Infrastructure.Services
{
    public class ResendEmailService : IEmailService
    {
        private readonly HttpClient _http;
        private readonly ResendSettings _settings;

        public ResendEmailService(HttpClient http, ResendSettings settings)
        {
            _http = http;
            _settings = settings;
        }

        public async Task SendAsync(string toEmail, string subject, string htmlBody, string textBody, CancellationToken ct = default)
        {
            using var request = new HttpRequestMessage(HttpMethod.Post, "emails");
            request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", _settings.ApiKey);
            request.Content = JsonContent.Create(new ResendPayload(_settings.From, new[] { toEmail }, subject, htmlBody, textBody));

            using var response = await _http.SendAsync(request, ct);

            if (!response.IsSuccessStatusCode)
            {
                var body = await response.Content.ReadAsStringAsync(ct);
                throw new InvalidOperationException($"Resend rejected the email ({(int)response.StatusCode}): {body}");
            }
        }

        private sealed record ResendPayload(
            [property: JsonPropertyName("from")] string From,
            [property: JsonPropertyName("to")] string[] To,
            [property: JsonPropertyName("subject")] string Subject,
            [property: JsonPropertyName("html")] string Html,
            [property: JsonPropertyName("text")] string Text);
    }
}