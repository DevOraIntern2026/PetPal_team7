using PetPal.Domain.Enums;
using System.ComponentModel.DataAnnotations;

namespace PetPal.Application.DTOs.Adoption;

public class AdoptionListingDto
{
    public Guid Id { get; set; }
    public Guid OwnerId { get; set; }
    public string PetName { get; set; } = null!;
    public string Location { get; set; } = null!;
    public Gender Gender { get; set; }
    public decimal Price { get; set; }
    public decimal WeightKg { get; set; }
    public int AgeInMonths { get; set; }
    public string? About { get; set; }
    public string? ImageUrl { get; set; }
    public AdoptionStatus Status { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
}

/// <summary>There is no OwnerId here by design: the owner is always the authenticated user.</summary>
public class AdoptionListingRequest
{
    [Required, MaxLength(100)]
    public string PetName { get; set; } = null!;

    [Required, MaxLength(200)]
    public string Location { get; set; } = null!;

    public Gender Gender { get; set; }

    /// <summary>0 means free adoption.</summary>
    [Range(0, 1000000)]
    public decimal Price { get; set; }

    [Range(0.01, 500)]
    public decimal WeightKg { get; set; }

    [Range(0, 600)]
    public int AgeInMonths { get; set; }

    [MaxLength(2000)]
    public string? About { get; set; }

    [MaxLength(500)]
    public string? ImageUrl { get; set; }

    /// <summary>Optional. Owners may only use Available or Adopted. Ignored when omitted.</summary>
    public AdoptionStatus? Status { get; set; }
}

public class AdoptionQuery
{
    public string? Location { get; set; }
    public Gender? Gender { get; set; }
    public int? MinAgeMonths { get; set; }
    public int? MaxAgeMonths { get; set; }
    public decimal? MinPrice { get; set; }
    public decimal? MaxPrice { get; set; }
    public int Page { get; set; } = 1;
    public int PageSize { get; set; } = 20;
}

public class UpdateAdoptionStatusRequest
{
    public AdoptionStatus Status { get; set; }
}
