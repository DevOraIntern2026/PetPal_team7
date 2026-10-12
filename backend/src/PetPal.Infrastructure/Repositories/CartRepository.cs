using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using PetPal.Application.Interfaces.Repositories;
using PetPal.Domain.Entities;
using PetPal.Infrastructure.Data;

namespace PetPal.Infrastructure.Repositories;

public class CartRepository : GenericRepository<Cart>, ICartRepository
{
    public CartRepository(PetPalDbContext context) : base(context)
    {
    }

    public async Task<Cart?> GetByUserAsync(Guid userId, bool asTracking, CancellationToken ct = default)
    {
        IQueryable<Cart> query = _dbContext.Carts
            .Include(c => c.Items)
            .ThenInclude(i => i.Product);

        if (!asTracking)
            query = query.AsNoTracking();

        return await query.FirstOrDefaultAsync(c => c.UserId == userId, ct);
    }

    public async Task<Cart> GetOrCreateForUserAsync(Guid userId, CancellationToken ct = default)
    {
        var cart = await GetByUserAsync(userId, true, ct);

        if (cart is not null)
            return cart;

        cart = new Cart { UserId = userId };
        _dbContext.Carts.Add(cart);

        try
        {
            await _dbContext.SaveChangesAsync(ct);
            return cart;
        }
        catch (DbUpdateException ex) when (ex.InnerException is SqlException { Number: 2601 or 2627 })
        {
            // Another request created this user's cart first (unique index on UserId): use that one.
            _dbContext.Entry(cart).State = EntityState.Detached;

            return await GetByUserAsync(userId, true, ct)
                ?? throw new InvalidOperationException("Cart could not be created.");
        }
    }
}
