using PetPal.Domain.Common;
using PetPal.Domain.Enums;

namespace PetPal.Domain.Entities;

/// <summary>
/// A public adoption advert. Deliberately separate from Pet (a user's registered pet with medical history).
/// </summary>
public class AdoptionListing : BaseEntity
{
    // FK -> ApplicationUser (Infrastructure). Always taken from the authenticated user's token.
    public Guid OwnerId { get; set; }

    public string PetName { get; set; } = null!;
    public string Location { get; set; } = null!;
    public Gender Gender { get; set; }
    public decimal Price { get; set; }
    public decimal WeightKg { get; set; }
    public int AgeInMonths { get; set; }
    public string? About { get; set; }
    public string? ImageUrl { get; set; }
    public AdoptionStatus Status { get; set; } = AdoptionStatus.Available;
}
