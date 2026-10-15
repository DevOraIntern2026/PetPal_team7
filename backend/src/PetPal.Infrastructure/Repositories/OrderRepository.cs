using Microsoft.EntityFrameworkCore;
using PetPal.Application.Interfaces.Repositories;
using PetPal.Domain.Entities;
using PetPal.Domain.Enums;
using PetPal.Infrastructure.Data;

namespace PetPal.Infrastructure.Repositories;

public class OrderRepository : GenericRepository<Order>, IOrderRepository
{
    public OrderRepository(PetPalDbContext context) : base(context)
    {
    }

    public async Task<Order?> GetDetailedAsync(Guid id, bool asTracking, CancellationToken ct = default)
    {
        IQueryable<Order> query = _dbContext.Orders.Include(o => o.Items);

        if (!asTracking)
            query = query.AsNoTracking();

        return await query.FirstOrDefaultAsync(o => o.Id == id, ct);
    }

    public async Task<IReadOnlyList<Order>> GetByUserAsync(Guid userId, CancellationToken ct = default)
        => await _dbContext.Orders.AsNoTracking()
            .Include(o => o.Items)
            .Where(o => o.UserId == userId)
            .OrderByDescending(o => o.CreatedAt)
            .ToListAsync(ct);

    public async Task<(IReadOnlyList<Order> Items, int TotalCount)> SearchAsync(
        OrderStatus? status, int page, int pageSize, CancellationToken ct = default)
    {
        IQueryable<Order> query = _dbContext.Orders.AsNoTracking();

        if (status.HasValue)
            query = query.Where(o => o.Status == status.Value);

        var total = await query.CountAsync(ct);

        var items = await query
            .Include(o => o.Items)
            .OrderByDescending(o => o.CreatedAt).ThenBy(o => o.Id)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync(ct);

        return (items, total);
    }

    public async Task<bool> TryTransitionStatusAsync(Guid id, OrderStatus expectedCurrent, OrderStatus next, CancellationToken ct = default)
    {
        var now = (DateTime?)DateTime.UtcNow;

        var rows = await _dbContext.Orders
            .Where(o => o.Id == id && o.Status == expectedCurrent)
            .ExecuteUpdateAsync(s => s
                .SetProperty(o => o.Status, next)
                .SetProperty(o => o.UpdatedAt, now), ct);

        return rows == 1;
    }
}
