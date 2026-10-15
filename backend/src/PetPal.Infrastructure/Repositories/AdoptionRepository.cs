using Microsoft.EntityFrameworkCore;
using PetPal.Application.Interfaces.Repositories;
using PetPal.Domain.Entities;
using PetPal.Domain.Enums;
using PetPal.Infrastructure.Data;

namespace PetPal.Infrastructure.Repositories;

public class AdoptionRepository : GenericRepository<AdoptionListing>, IAdoptionRepository
{
    public AdoptionRepository(PetPalDbContext context) : base(context)
    {
    }

    public async Task<(IReadOnlyList<AdoptionListing> Items, int TotalCount)> SearchAsync(
        Guid? ownerId, IReadOnlyCollection<AdoptionStatus>? statuses, string? location, Gender? gender,
        int? minAgeMonths, int? maxAgeMonths, decimal? minPrice, decimal? maxPrice,
        int page, int pageSize, CancellationToken ct = default)
    {
        IQueryable<AdoptionListing> query = _dbContext.AdoptionListings.AsNoTracking();

        if (ownerId.HasValue) query = query.Where(a => a.OwnerId == ownerId.Value);
        if (statuses is not null) query = query.Where(a => statuses.Contains(a.Status));
        if (!string.IsNullOrWhiteSpace(location)) query = query.Where(a => a.Location.Contains(location));
        if (gender.HasValue) query = query.Where(a => a.Gender == gender.Value);
        if (minAgeMonths.HasValue) query = query.Where(a => a.AgeInMonths >= minAgeMonths.Value);
        if (maxAgeMonths.HasValue) query = query.Where(a => a.AgeInMonths <= maxAgeMonths.Value);
        if (minPrice.HasValue) query = query.Where(a => a.Price >= minPrice.Value);
        if (maxPrice.HasValue) query = query.Where(a => a.Price <= maxPrice.Value);

        var total = await query.CountAsync(ct);

        var items = await query
            .OrderByDescending(a => a.CreatedAt).ThenBy(a => a.Id)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync(ct);

        return (items, total);
    }
}
