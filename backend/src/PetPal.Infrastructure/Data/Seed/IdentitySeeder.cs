using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using PetPal.Application.Constants;
using PetPal.Infrastructure.Identity;

namespace PetPal.Infrastructure.Data.Seed;

/// <summary>
/// Idempotent: creates the Admin/User roles if missing and provisions the first administrator
/// from configuration (AdminSeed:Email / Password / FullName). The password must come from
/// user-secrets or environment variables, never from source control. An existing account is
/// never promoted automatically, so registering the admin e-mail first cannot grant Admin.
/// </summary>
public static class IdentitySeeder
{
    public static async Task SeedAsync(IServiceProvider services, IConfiguration config, CancellationToken ct = default)
    {
        var roleManager = services.GetRequiredService<RoleManager<IdentityRole<Guid>>>();
        var userManager = services.GetRequiredService<UserManager<ApplicationUser>>();
        var logger = services.GetRequiredService<ILoggerFactory>().CreateLogger("IdentitySeeder");

        foreach (var role in new[] { Roles.Admin, Roles.User })
        {
            if (!await roleManager.RoleExistsAsync(role))
            {
                var created = await roleManager.CreateAsync(new IdentityRole<Guid>(role));

                if (!created.Succeeded && !await roleManager.RoleExistsAsync(role))
                    throw new InvalidOperationException(
                        $"Could not create role '{role}': {string.Join(", ", created.Errors.Select(e => e.Description))}");
            }
        }

        var email = config["AdminSeed:Email"];
        var password = config["AdminSeed:Password"];

        if (string.IsNullOrWhiteSpace(email) || string.IsNullOrWhiteSpace(password))
        {
            logger.LogInformation("AdminSeed is not configured; no administrator was provisioned.");
            return;
        }

        var existing = await userManager.FindByEmailAsync(email);

        if (existing is not null)
        {
            if (!await userManager.IsInRoleAsync(existing, Roles.Admin))
                logger.LogWarning(
                    "AdminSeed:Email belongs to an existing non-admin account. It was NOT promoted automatically.");

            return;
        }

        var admin = new ApplicationUser
        {
            Id = Guid.NewGuid(),
            UserName = email,
            Email = email,
            EmailConfirmed = true,
            FullName = string.IsNullOrWhiteSpace(config["AdminSeed:FullName"]) ? "Administrator" : config["AdminSeed:FullName"]!,
            CreatedAt = DateTime.UtcNow
        };

        var result = await userManager.CreateAsync(admin, password);

        if (!result.Succeeded)
            throw new InvalidOperationException(
                $"Could not create the seeded administrator: {string.Join(", ", result.Errors.Select(e => e.Description))}");

        await userManager.AddToRoleAsync(admin, Roles.Admin);
        logger.LogInformation("Administrator account provisioned.");
    }
}
