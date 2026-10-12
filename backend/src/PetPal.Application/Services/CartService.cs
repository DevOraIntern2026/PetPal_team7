using PetPal.Application.DTOs.Store;
using PetPal.Application.Exceptions;
using PetPal.Application.Interfaces;
using PetPal.Application.Mappings;
using PetPal.Domain.Entities;

namespace PetPal.Application.Services;

public class CartService : ICartService
{
    private const int MaxQuantityPerItem = 99;

    private readonly IUnitOfWork _uow;
    private readonly ICurrentUserService _currentUser;

    public CartService(IUnitOfWork uow, ICurrentUserService currentUser)
    {
        _uow = uow;
        _currentUser = currentUser;
    }

    private Guid UserId => _currentUser.UserId
        ?? throw new UnauthorizedAccessException("User is not authenticated.");

    public async Task<CartDto> GetAsync(CancellationToken ct = default)
    {
        var cart = await _uow.Carts.GetByUserAsync(UserId, false, ct);

        return cart.ToDto();
    }

    // Rule: adding a product that is already in the cart INCREASES its quantity by the requested amount.
    public async Task<CartDto> AddItemAsync(AddCartItemRequest request, CancellationToken ct = default)
    {
        var userId = UserId;
        var product = await GetPurchasableProductAsync(request.ProductId, ct);

        var cart = await _uow.Carts.GetOrCreateForUserAsync(userId, ct);
        var existing = cart.Items.FirstOrDefault(i => i.ProductId == product.Id);

        var newQuantity = (existing?.Quantity ?? 0) + request.Quantity;

        EnsureQuantity(product, newQuantity);

        if (existing is null)
            cart.Items.Add(new CartItem { ProductId = product.Id, Quantity = newQuantity });
        else
            existing.Quantity = newQuantity;

        if (!await _uow.TrySaveChangesAsync(ct))
            throw new ConflictException("Your cart was changed by another request. Please try again.");

        return await GetAsync(ct);
    }

    // Rule: PUT sets the quantity to the given absolute value (1..99). Use DELETE to remove an item.
    public async Task<CartDto> UpdateItemAsync(Guid productId, UpdateCartItemRequest request, CancellationToken ct = default)
    {
        var cart = await _uow.Carts.GetByUserAsync(UserId, true, ct);
        var item = cart?.Items.FirstOrDefault(i => i.ProductId == productId)
            ?? throw new NotFoundException("Item not found in your cart.");

        var product = await GetPurchasableProductAsync(productId, ct);
        EnsureQuantity(product, request.Quantity);

        item.Quantity = request.Quantity;

        if (!await _uow.TrySaveChangesAsync(ct))
            throw new ConflictException("Your cart was changed by another request. Please try again.");

        return await GetAsync(ct);
    }

    public async Task<CartDto> RemoveItemAsync(Guid productId, CancellationToken ct = default)
    {
        var cart = await _uow.Carts.GetByUserAsync(UserId, true, ct);
        var item = cart?.Items.FirstOrDefault(i => i.ProductId == productId)
            ?? throw new NotFoundException("Item not found in your cart.");

        _uow.Repository<CartItem>().Delete(item);

        if (!await _uow.TrySaveChangesAsync(ct))
            throw new ConflictException("Your cart was changed by another request. Please try again.");

        return await GetAsync(ct);
    }

    public async Task ClearAsync(CancellationToken ct = default)
    {
        var cart = await _uow.Carts.GetByUserAsync(UserId, true, ct);

        if (cart is null || cart.Items.Count == 0)
            return;

        foreach (var item in cart.Items.ToList())
            _uow.Repository<CartItem>().Delete(item);

        if (!await _uow.TrySaveChangesAsync(ct))
            throw new ConflictException("Your cart was changed by another request. Please try again.");
    }

    private async Task<Product> GetPurchasableProductAsync(Guid productId, CancellationToken ct)
    {
        var product = await _uow.Products.GetByIdAsync(productId, ct);

        if (product is null || !product.IsActive)
            throw new NotFoundException("Product not found.");

        return product;
    }

    private static void EnsureQuantity(Product product, int quantity)
    {
        if (quantity > MaxQuantityPerItem)
            throw new BadRequestException($"You can order at most {MaxQuantityPerItem} units of a product.");

        if (quantity > product.StockQuantity)
            throw new BadRequestException($"Only {product.StockQuantity} unit(s) of '{product.Name}' are in stock.");
    }
}
