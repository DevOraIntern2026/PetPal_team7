using PetPal.Application.DTOs.Common;
using PetPal.Application.DTOs.Store;
using PetPal.Domain.Enums;

namespace PetPal.Application.Interfaces;

public interface IOrderService
{
    Task<OrderDto> CheckoutAsync(CheckoutRequest request, CancellationToken ct = default);
    Task<IReadOnlyList<OrderDto>> GetMyAsync(CancellationToken ct = default);
    Task<OrderDto> GetByIdAsync(Guid id, CancellationToken ct = default);

    // Admin
    Task<PagedResult<OrderDto>> AdminSearchAsync(OrderStatus? status, int page, int pageSize, CancellationToken ct = default);
    Task<OrderDto> AdminUpdateStatusAsync(Guid id, OrderStatus status, CancellationToken ct = default);
    Task<OrderDto> AdminUpdatePaymentStatusAsync(Guid id, PaymentStatus status, CancellationToken ct = default);
}
