using PetPal.Application.DTOs.Adoption;
using PetPal.Domain.Entities;

namespace PetPal.Application.Mappings;

public static class AdoptionMappings
{
    public static AdoptionListingDto ToDto(this AdoptionListing a) => new()
    {
        Id = a.Id,
        OwnerId = a.OwnerId,
        PetName = a.PetName,
        Location = a.Location,
        Gender = a.Gender,
        Price = a.Price,
        WeightKg = a.WeightKg,
        AgeInMonths = a.AgeInMonths,
        About = a.About,
        ImageUrl = a.ImageUrl,
        Status = a.Status,
        CreatedAt = DateTime.SpecifyKind(a.CreatedAt, DateTimeKind.Utc),
        UpdatedAt = a.UpdatedAt.HasValue ? DateTime.SpecifyKind(a.UpdatedAt.Value, DateTimeKind.Utc) : null
    };
}
