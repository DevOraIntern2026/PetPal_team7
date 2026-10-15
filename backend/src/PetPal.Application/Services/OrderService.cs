using PetPal.Application.DTOs.Common;
using PetPal.Application.DTOs.Store;
using PetPal.Application.Exceptions;
using PetPal.Application.Interfaces;
using PetPal.Application.Mappings;
using PetPal.Domain.Entities;
using PetPal.Domain.Enums;

namespace PetPal.Application.Services;

public class OrderService : IOrderService
{
    // Allowed status transitions. Anything not listed is rejected.
    private static readonly Dictionary<OrderStatus, OrderStatus[]> Transitions = new()
    {
        [OrderStatus.Pending] = new[] { OrderStatus.Confirmed, OrderStatus.Cancelled },
        [OrderStatus.Confirmed] = new[] { OrderStatus.Shipped, OrderStatus.Cancelled },
        [OrderStatus.Shipped] = new[] { OrderStatus.Delivered },
        [OrderStatus.Delivered] = Array.Empty<OrderStatus>(),
        [OrderStatus.Cancelled] = Array.Empty<OrderStatus>()
    };

    private readonly IUnitOfWork _uow;
    private readonly ICurrentUserService _currentUser;

    public OrderService(IUnitOfWork uow, ICurrentUserService currentUser)
    {
        _uow = uow;
        _currentUser = currentUser;
    }

    private Guid UserId => _currentUser.UserId
        ?? throw new UnauthorizedAccessException("User is not authenticated.");

    public async Task<OrderDto> CheckoutAsync(CheckoutRequest request, CancellationToken ct = default)
    {
        var userId = UserId;

        if (!Enum.IsDefined(request.PaymentMethod))
            throw new BadRequestException("Payment method must be Cash or Card.");

        var address = request.DeliveryAddress.Trim();

        if (address.Length < 5)
            throw new BadRequestException("Delivery address is required.");

        // Order creation, stock decrement and cart clearing succeed or fail together.
        var orderId = await _uow.ExecuteInTransactionAsync(async () =>
        {
            var cart = await _uow.Carts.GetByUserAsync(userId, true, ct);

            if (cart is null || cart.Items.Count == 0)
                throw new BadRequestException("Your cart is empty.");

            var order = new Order
            {
                UserId = userId,
                DeliveryAddress = address,
                PaymentMethod = request.PaymentMethod,
                Status = OrderStatus.Pending,
                // Card stays Pending: no payment gateway is integrated, so no payment is ever reported as taken.
                PaymentStatus = PaymentStatus.Pending
            };

            // Fixed lock order across concurrent checkouts avoids deadlocks.
            foreach (var item in cart.Items.OrderBy(i => i.ProductId))
            {
                var product = item.Product;

                if (!product.IsActive)
                    throw new BadRequestException($"'{product.Name}' is no longer available. Please remove it from your cart.");

                // Atomic: only succeeds while the product is active, has enough stock and the price is unchanged.
                if (!await _uow.Products.TryDecrementStockAsync(product.Id, item.Quantity, product.Price, ct))
                    throw new ConflictException($"'{product.Name}' is out of stock in the requested quantity or its price changed. Please review your cart.");

                order.Items.Add(new OrderItem
                {
                    ProductId = product.Id,
                    ProductName = product.Name,   // snapshot
                    UnitPrice = product.Price,    // snapshot
                    Quantity = item.Quantity
                });
            }

            order.TotalAmount = order.Items.Sum(i => i.UnitPrice * i.Quantity);

            await _uow.Orders.AddAsync(order, ct);

            foreach (var item in cart.Items.ToList())
                _uow.Repository<CartItem>().Delete(item);

            // A concurrent second checkout of the same cart fails here (rows already deleted) and rolls back.
            if (!await _uow.TrySaveChangesAsync(ct))
                throw new ConflictException("Your cart changed during checkout. Please review it and try again.");

            return order.Id;
        }, ct);

        return await GetByIdAsync(orderId, ct);
    }

    public async Task<IReadOnlyList<OrderDto>> GetMyAsync(CancellationToken ct = default)
    {
        var orders = await _uow.Orders.GetByUserAsync(UserId, ct);

        return orders.Select(o => o.ToDto()).ToList();
    }

    public async Task<OrderDto> GetByIdAsync(Guid id, CancellationToken ct = default)
    {
        var order = await _uow.Orders.GetDetailedAsync(id, false, ct);

        // 404 for other users' orders so ids cannot be probed.
        if (order is null || (!_currentUser.IsAdmin && order.UserId != UserId))
            throw new NotFoundException("Order not found.");

        return order.ToDto();
    }

    public async Task<PagedResult<OrderDto>> AdminSearchAsync(OrderStatus? status, int page, int pageSize, CancellationToken ct = default)
    {
        page = Math.Max(page, 1);
        pageSize = Math.Clamp(pageSize, 1, 100);

        var (items, total) = await _uow.Orders.SearchAsync(status, page, pageSize, ct);

        return new PagedResult<OrderDto>
        {
            Items = items.Select(o => o.ToDto()).ToList(),
            Page = page,
            PageSize = pageSize,
            TotalCount = total
        };
    }

    public async Task<OrderDto> AdminUpdateStatusAsync(Guid id, OrderStatus status, CancellationToken ct = default)
    {
        var order = await _uow.Orders.GetDetailedAsync(id, false, ct)
            ?? throw new NotFoundException("Order not found.");

        if (!Transitions.TryGetValue(order.Status, out var allowed) || !allowed.Contains(status))
            throw new BadRequestException($"An order cannot move from {order.Status} to {status}.");

        var previous = order.Status;

        await _uow.ExecuteInTransactionAsync(async () =>
        {
            // Compare-and-set: a concurrent change makes this fail instead of applying twice (e.g. double restock).
            if (!await _uow.Orders.TryTransitionStatusAsync(id, previous, status, ct))
                throw new ConflictException("The order was changed by someone else. Reload it and try again.");

            if (status == OrderStatus.Cancelled)
            {
                foreach (var item in order.Items.OrderBy(i => i.ProductId))
                    await _uow.Products.IncrementStockAsync(item.ProductId, item.Quantity, ct);
            }

            return true;
        }, ct);

        return await GetByIdAsync(id, ct);
    }

    public async Task<OrderDto> AdminUpdatePaymentStatusAsync(Guid id, PaymentStatus status, CancellationToken ct = default)
    {
        var order = await _uow.Orders.GetDetailedAsync(id, true, ct)
            ?? throw new NotFoundException("Order not found.");

        if (order.PaymentMethod == PaymentMethod.Card)
            throw new BadRequestException("Card payments can only be confirmed by a payment gateway, which is not integrated yet.");

        if (order.PaymentStatus != PaymentStatus.Pending || status != PaymentStatus.Paid)
            throw new BadRequestException("Only a pending cash payment can be marked as paid.");

        if (order.Status != OrderStatus.Delivered)
            throw new BadRequestException("A cash order can be marked as paid once it has been delivered.");

        order.PaymentStatus = PaymentStatus.Paid;

        if (!await _uow.TrySaveChangesAsync(ct))
            throw new ConflictException("The order was changed by someone else. Reload it and try again.");

        return order.ToDto();
    }
}
