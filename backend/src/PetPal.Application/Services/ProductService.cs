using PetPal.Application.DTOs.Common;
using PetPal.Application.DTOs.Store;
using PetPal.Application.Exceptions;
using PetPal.Application.Interfaces;
using PetPal.Application.Mappings;
using PetPal.Application.Validation;
using PetPal.Domain.Entities;

namespace PetPal.Application.Services;

public class ProductService : IProductService
{
    private readonly IUnitOfWork _uow;

    public ProductService(IUnitOfWork uow) => _uow = uow;

    public Task<PagedResult<ProductDto>> GetActiveAsync(string? category, string? search, int page, int pageSize, CancellationToken ct = default)
        => SearchAsync(category, search, true, page, pageSize, ct);

    public Task<PagedResult<ProductDto>> GetAllAsync(string? category, string? search, int page, int pageSize, CancellationToken ct = default)
        => SearchAsync(category, search, false, page, pageSize, ct);

    public async Task<ProductDto> GetActiveByIdAsync(Guid id, CancellationToken ct = default)
    {
        var product = await _uow.Products.GetByIdAsync(id, ct);

        if (product is null || !product.IsActive)
            throw new NotFoundException("Product not found.");

        return product.ToDto();
    }

    public async Task<ProductDto> GetByIdAsync(Guid id, CancellationToken ct = default)
    {
        var product = await _uow.Products.GetByIdAsync(id, ct)
            ?? throw new NotFoundException("Product not found.");

        return product.ToDto();
    }

    public async Task<ProductDto> CreateAsync(ProductRequest request, CancellationToken ct = default)
    {
        var product = new Product { IsActive = true };
        Apply(product, request);

        await _uow.Products.AddAsync(product, ct);
        await _uow.SaveChangesAsync(ct);

        return product.ToDto();
    }

    public async Task<ProductDto> UpdateAsync(Guid id, ProductRequest request, CancellationToken ct = default)
    {
        var product = await _uow.Products.GetByIdAsync(id, ct)
            ?? throw new NotFoundException("Product not found.");

        Apply(product, request);
        await _uow.SaveChangesAsync(ct);

        return product.ToDto();
    }

    public async Task<ProductDto> SetActiveAsync(Guid id, bool isActive, CancellationToken ct = default)
    {
        var product = await _uow.Products.GetByIdAsync(id, ct)
            ?? throw new NotFoundException("Product not found.");

        product.IsActive = isActive;
        await _uow.SaveChangesAsync(ct);

        return product.ToDto();
    }

    private async Task<PagedResult<ProductDto>> SearchAsync(string? category, string? search, bool activeOnly, int page, int pageSize, CancellationToken ct)
    {
        page = Math.Max(page, 1);
        pageSize = Math.Clamp(pageSize, 1, 100);

        var (items, total) = await _uow.Products.SearchAsync(category?.Trim(), search?.Trim(), activeOnly, page, pageSize, ct);

        return new PagedResult<ProductDto>
        {
            Items = items.Select(p => p.ToDto()).ToList(),
            Page = page,
            PageSize = pageSize,
            TotalCount = total
        };
    }

    private static void Apply(Product p, ProductRequest r)
    {
        p.Name = r.Name.Trim();
        p.Category = r.Category.Trim();
        p.Material = r.Material?.Trim();
        p.Color = r.Color?.Trim();
        p.Price = decimal.Round(r.Price, 2);
        p.Description = r.Description?.Trim();
        p.ImageUrl = ImageUrlValidator.Normalize(r.ImageUrl);
        p.StockQuantity = r.StockQuantity;
    }
}
