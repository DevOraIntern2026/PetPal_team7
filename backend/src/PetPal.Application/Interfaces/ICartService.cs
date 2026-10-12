using PetPal.Application.DTOs.Store;

namespace PetPal.Application.Interfaces;

public interface ICartService
{
    Task<CartDto> GetAsync(CancellationToken ct = default);
    Task<CartDto> AddItemAsync(AddCartItemRequest request, CancellationToken ct = default);
    Task<CartDto> UpdateItemAsync(Guid productId, UpdateCartItemRequest request, CancellationToken ct = default);
    Task<CartDto> RemoveItemAsync(Guid productId, CancellationToken ct = default);
    Task ClearAsync(CancellationToken ct = default);
}
