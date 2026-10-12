using PetPal.Domain.Entities;

namespace PetPal.Application.Interfaces.Repositories;

public interface ICartRepository : IGenericRepository<Cart>
{
    /// <summary>Cart with items and products, or null when the user has no cart yet.</summary>
    Task<Cart?> GetByUserAsync(Guid userId, bool asTracking, CancellationToken ct = default);

    /// <summary>Tracked cart (created if missing). Safe if two requests create it at the same time.</summary>
    Task<Cart> GetOrCreateForUserAsync(Guid userId, CancellationToken ct = default);
}
