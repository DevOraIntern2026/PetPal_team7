using PetPal.Domain.Entities;
using PetPal.Domain.Enums;

namespace PetPal.Application.Interfaces.Repositories;

public interface IAdoptionRepository : IGenericRepository<AdoptionListing>
{
    /// <summary>Null filters are ignored. <paramref name="statuses"/> null means every status.</summary>
    Task<(IReadOnlyList<AdoptionListing> Items, int TotalCount)> SearchAsync(
        Guid? ownerId, IReadOnlyCollection<AdoptionStatus>? statuses, string? location, Gender? gender,
        int? minAgeMonths, int? maxAgeMonths, decimal? minPrice, decimal? maxPrice,
        int page, int pageSize, CancellationToken ct = default);
}
