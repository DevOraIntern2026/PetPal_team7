using PetPal.Application.DTOs.Adoption;
using PetPal.Application.DTOs.Common;
using PetPal.Domain.Enums;

namespace PetPal.Application.Interfaces;

public interface IAdoptionService
{
    Task<PagedResult<AdoptionListingDto>> SearchAvailableAsync(AdoptionQuery query, CancellationToken ct = default);
    Task<PagedResult<AdoptionListingDto>> GetMineAsync(int page, int pageSize, CancellationToken ct = default);
    Task<AdoptionListingDto> GetByIdAsync(Guid id, CancellationToken ct = default);
    Task<AdoptionListingDto> CreateAsync(AdoptionListingRequest request, CancellationToken ct = default);
    Task<AdoptionListingDto> UpdateAsync(Guid id, AdoptionListingRequest request, CancellationToken ct = default);
    Task DeleteAsync(Guid id, CancellationToken ct = default);

    // Admin moderation
    Task<PagedResult<AdoptionListingDto>> AdminSearchAsync(AdoptionStatus? status, Guid? ownerId, int page, int pageSize, CancellationToken ct = default);
    Task<AdoptionListingDto> AdminSetStatusAsync(Guid id, AdoptionStatus status, CancellationToken ct = default);
}
