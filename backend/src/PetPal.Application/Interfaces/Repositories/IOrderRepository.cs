using PetPal.Domain.Entities;
using PetPal.Domain.Enums;

namespace PetPal.Application.Interfaces.Repositories;

public interface IOrderRepository : IGenericRepository<Order>
{
    Task<Order?> GetDetailedAsync(Guid id, bool asTracking, CancellationToken ct = default);

    Task<IReadOnlyList<Order>> GetByUserAsync(Guid userId, CancellationToken ct = default);

    Task<(IReadOnlyList<Order> Items, int TotalCount)> SearchAsync(
        OrderStatus? status, int page, int pageSize, CancellationToken ct = default);

    /// <summary>Atomic compare-and-set of the order status. False if the current status is not <paramref name="expectedCurrent"/>.</summary>
    Task<bool> TryTransitionStatusAsync(Guid id, OrderStatus expectedCurrent, OrderStatus next, CancellationToken ct = default);
}
