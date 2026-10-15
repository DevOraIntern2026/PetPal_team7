using PetPal.Domain.Entities;

namespace PetPal.Application.Interfaces.Repositories;

public interface IProductRepository : IGenericRepository<Product>
{
    Task<(IReadOnlyList<Product> Items, int TotalCount)> SearchAsync(
        string? category, string? search, bool activeOnly, int page, int pageSize, CancellationToken ct = default);

    /// <summary>
    /// Atomic "UPDATE ... WHERE active AND stock >= qty AND price = expectedPrice". False if any condition fails,
    /// so concurrent buyers can never oversell. Must run inside the checkout transaction.
    /// </summary>
    Task<bool> TryDecrementStockAsync(Guid productId, int quantity, decimal expectedPrice, CancellationToken ct = default);

    Task IncrementStockAsync(Guid productId, int quantity, CancellationToken ct = default);
}
