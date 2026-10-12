using Microsoft.EntityFrameworkCore;
using PetPal.Application.Interfaces.Repositories;
using PetPal.Domain.Entities;
using PetPal.Infrastructure.Data;

namespace PetPal.Infrastructure.Repositories;

public class ProductRepository : GenericRepository<Product>, IProductRepository
{
    public ProductRepository(PetPalDbContext context) : base(context)
    {
    }

    public async Task<(IReadOnlyList<Product> Items, int TotalCount)> SearchAsync(
        string? category, string? search, bool activeOnly, int page, int pageSize, CancellationToken ct = default)
    {
        IQueryable<Product> query = _dbContext.Products.AsNoTracking();

        if (activeOnly)
            query = query.Where(p => p.IsActive);

        if (!string.IsNullOrWhiteSpace(category))
            query = query.Where(p => p.Category == category);

        if (!string.IsNullOrWhiteSpace(search))
            query = query.Where(p => p.Name.Contains(search));

        var total = await query.CountAsync(ct);

        var items = await query
            .OrderBy(p => p.Name).ThenBy(p => p.Id)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync(ct);

        return (items, total);
    }

    public async Task<bool> TryDecrementStockAsync(Guid productId, int quantity, decimal expectedPrice, CancellationToken ct = default)
    {
        var now = (DateTime?)DateTime.UtcNow;

        var rows = await _dbContext.Products
            .Where(p => p.Id == productId && p.IsActive && p.StockQuantity >= quantity && p.Price == expectedPrice)
            .ExecuteUpdateAsync(s => s
                .SetProperty(p => p.StockQuantity, p => p.StockQuantity - quantity)
                .SetProperty(p => p.UpdatedAt, now), ct);

        return rows == 1;
    }

    public async Task IncrementStockAsync(Guid productId, int quantity, CancellationToken ct = default)
    {
        var now = (DateTime?)DateTime.UtcNow;

        await _dbContext.Products
            .Where(p => p.Id == productId)
            .ExecuteUpdateAsync(s => s
                .SetProperty(p => p.StockQuantity, p => p.StockQuantity + quantity)
                .SetProperty(p => p.UpdatedAt, now), ct);
    }
}
