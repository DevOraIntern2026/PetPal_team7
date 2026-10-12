using PetPal.Application.DTOs.Adoption;
using PetPal.Application.DTOs.Common;
using PetPal.Application.Exceptions;
using PetPal.Application.Interfaces;
using PetPal.Application.Mappings;
using PetPal.Application.Validation;
using PetPal.Domain.Entities;
using PetPal.Domain.Enums;

namespace PetPal.Application.Services;

public class AdoptionService : IAdoptionService
{
    private static readonly AdoptionStatus[] PublicStatuses = { AdoptionStatus.Available };
    private static readonly AdoptionStatus[] OwnerVisibleStatuses = { AdoptionStatus.Available, AdoptionStatus.Adopted, AdoptionStatus.Hidden };

    private readonly IUnitOfWork _uow;
    private readonly ICurrentUserService _currentUser;

    public AdoptionService(IUnitOfWork uow, ICurrentUserService currentUser)
    {
        _uow = uow;
        _currentUser = currentUser;
    }

    private Guid UserId => _currentUser.UserId
        ?? throw new UnauthorizedAccessException("User is not authenticated.");

    public async Task<PagedResult<AdoptionListingDto>> SearchAvailableAsync(AdoptionQuery q, CancellationToken ct = default)
    {
        if (q.MinAgeMonths < 0 || q.MaxAgeMonths < 0 || q.MinPrice < 0 || q.MaxPrice < 0)
            throw new BadRequestException("Age and price filters cannot be negative.");

        if (q.MinAgeMonths > q.MaxAgeMonths || q.MinPrice > q.MaxPrice)
            throw new BadRequestException("Minimum filter value cannot exceed the maximum.");

        return await SearchAsync(null, PublicStatuses, q.Location?.Trim(), q.Gender,
            q.MinAgeMonths, q.MaxAgeMonths, q.MinPrice, q.MaxPrice, q.Page, q.PageSize, ct);
    }

    public Task<PagedResult<AdoptionListingDto>> GetMineAsync(int page, int pageSize, CancellationToken ct = default)
        => SearchAsync(UserId, OwnerVisibleStatuses, null, null, null, null, null, null, page, pageSize, ct);

    public async Task<AdoptionListingDto> GetByIdAsync(Guid id, CancellationToken ct = default)
    {
        var listing = await _uow.Adoptions.GetByIdAsync(id, ct);

        // Non-available listings are visible only to their owner and admins; everyone else gets 404.
        var visible = listing is not null && listing.Status != AdoptionStatus.Removed &&
                      (listing.Status == AdoptionStatus.Available || _currentUser.IsAdmin || listing.OwnerId == UserId);

        if (!visible)
            throw new NotFoundException("Listing not found.");

        return listing!.ToDto();
    }

    public async Task<AdoptionListingDto> CreateAsync(AdoptionListingRequest request, CancellationToken ct = default)
    {
        if (request.Status is not null && request.Status != AdoptionStatus.Available)
            throw new BadRequestException("A new listing is always Available.");

        var listing = new AdoptionListing
        {
            OwnerId = UserId, // never taken from the client
            Status = AdoptionStatus.Available
        };

        Apply(listing, request);

        await _uow.Adoptions.AddAsync(listing, ct);
        await _uow.SaveChangesAsync(ct);

        return listing.ToDto();
    }

    public async Task<AdoptionListingDto> UpdateAsync(Guid id, AdoptionListingRequest request, CancellationToken ct = default)
    {
        var listing = await GetOwnedAsync(id, ct);

        if (request.Status is not null && request.Status != listing.Status)
        {
            if (request.Status is not (AdoptionStatus.Available or AdoptionStatus.Adopted))
                throw new BadRequestException("Owners can only set the status to Available or Adopted.");

            if (listing.Status == AdoptionStatus.Hidden)
                throw new BadRequestException("This listing was hidden by a moderator and its status cannot be changed.");

            listing.Status = request.Status.Value;
        }

        Apply(listing, request);
        await _uow.SaveChangesAsync(ct);

        return listing.ToDto();
    }

    public async Task DeleteAsync(Guid id, CancellationToken ct = default)
    {
        var listing = await GetOwnedAsync(id, ct);

        listing.Status = AdoptionStatus.Removed; // soft delete
        await _uow.SaveChangesAsync(ct);
    }

    public Task<PagedResult<AdoptionListingDto>> AdminSearchAsync(AdoptionStatus? status, Guid? ownerId, int page, int pageSize, CancellationToken ct = default)
        => SearchAsync(ownerId, status.HasValue ? new[] { status.Value } : null, null, null, null, null, null, null, page, pageSize, ct);

    public async Task<AdoptionListingDto> AdminSetStatusAsync(Guid id, AdoptionStatus status, CancellationToken ct = default)
    {
        if (!Enum.IsDefined(status))
            throw new BadRequestException("Invalid status.");

        var listing = await _uow.Adoptions.GetByIdAsync(id, ct)
            ?? throw new NotFoundException("Listing not found.");

        listing.Status = status;
        await _uow.SaveChangesAsync(ct);

        return listing.ToDto();
    }

    private async Task<AdoptionListing> GetOwnedAsync(Guid id, CancellationToken ct)
    {
        var listing = await _uow.Adoptions.GetByIdAsync(id, ct);

        // Same 404 whether it does not exist, was removed, or belongs to someone else.
        if (listing is null || listing.Status == AdoptionStatus.Removed || listing.OwnerId != UserId)
            throw new NotFoundException("Listing not found.");

        return listing;
    }

    private async Task<PagedResult<AdoptionListingDto>> SearchAsync(Guid? ownerId, IReadOnlyCollection<AdoptionStatus>? statuses,
        string? location, Gender? gender, int? minAge, int? maxAge, decimal? minPrice, decimal? maxPrice,
        int page, int pageSize, CancellationToken ct)
    {
        page = Math.Max(page, 1);
        pageSize = Math.Clamp(pageSize, 1, 100);

        var (items, total) = await _uow.Adoptions.SearchAsync(ownerId, statuses, location, gender,
            minAge, maxAge, minPrice, maxPrice, page, pageSize, ct);

        return new PagedResult<AdoptionListingDto>
        {
            Items = items.Select(a => a.ToDto()).ToList(),
            Page = page,
            PageSize = pageSize,
            TotalCount = total
        };
    }

    private static void Apply(AdoptionListing l, AdoptionListingRequest r)
    {
        if (!Enum.IsDefined(r.Gender))
            throw new BadRequestException("Invalid gender.");

        l.PetName = r.PetName.Trim();
        l.Location = r.Location.Trim();
        l.Gender = r.Gender;
        l.Price = decimal.Round(r.Price, 2);
        l.WeightKg = decimal.Round(r.WeightKg, 2);
        l.AgeInMonths = r.AgeInMonths;
        l.About = r.About?.Trim();
        l.ImageUrl = ImageUrlValidator.Normalize(r.ImageUrl);
    }
}
