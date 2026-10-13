using Microsoft.Extensions.Logging;
using PetPal.Application.Interfaces;

namespace PetPal.Infrastructure.Services
{
    public class ConsoleEmailService : IEmailService
    {
        private readonly ILogger<ConsoleEmailService> _logger;

        public ConsoleEmailService(ILogger<ConsoleEmailService> logger) => _logger = logger;

        public Task SendAsync(string toEmail, string subject, string htmlBody, string textBody, CancellationToken ct = default)
        {
            _logger.LogWarning("DEV EMAIL (not sent) to {To}\nSubject: {Subject}\n{Body}", toEmail, subject, textBody);
            return Task.CompletedTask;
        }
    }
}