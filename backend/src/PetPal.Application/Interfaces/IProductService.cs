using PetPal.Application.DTOs.Common;
using PetPal.Application.DTOs.Store;

namespace PetPal.Application.Interfaces;

public interface IProductService
{
    Task<PagedResult<ProductDto>> GetActiveAsync(string? category, string? search, int page, int pageSize, CancellationToken ct = default);
    Task<ProductDto> GetActiveByIdAsync(Guid id, CancellationToken ct = default);

    // Admin
    Task<PagedResult<ProductDto>> GetAllAsync(string? category, string? search, int page, int pageSize, CancellationToken ct = default);
    Task<ProductDto> GetByIdAsync(Guid id, CancellationToken ct = default);
    Task<ProductDto> CreateAsync(ProductRequest request, CancellationToken ct = default);
    Task<ProductDto> UpdateAsync(Guid id, ProductRequest request, CancellationToken ct = default);
    Task<ProductDto> SetActiveAsync(Guid id, bool isActive, CancellationToken ct = default);
}
