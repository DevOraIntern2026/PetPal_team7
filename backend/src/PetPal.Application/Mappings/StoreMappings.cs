using PetPal.Application.DTOs.Store;
using PetPal.Domain.Entities;

namespace PetPal.Application.Mappings;

public static class StoreMappings
{
    public static ProductDto ToDto(this Product p) => new()
    {
        Id = p.Id,
        Name = p.Name,
        Category = p.Category,
        Material = p.Material,
        Color = p.Color,
        Price = p.Price,
        Description = p.Description,
        ImageUrl = p.ImageUrl,
        StockQuantity = p.StockQuantity,
        IsActive = p.IsActive
    };

    /// <summary>Prices come from the trusted Product row; totals are computed here, never supplied by clients.</summary>
    public static CartDto ToDto(this Cart? cart)
    {
        var items = (cart?.Items ?? new List<CartItem>())
            .OrderBy(i => i.CreatedAt).ThenBy(i => i.Id)
            .Select(i => new CartItemDto
            {
                ProductId = i.ProductId,
                ProductName = i.Product.Name,
                ImageUrl = i.Product.ImageUrl,
                UnitPrice = i.Product.Price,
                Quantity = i.Quantity,
                Subtotal = i.Product.Price * i.Quantity,
                IsAvailable = i.Product.IsActive && i.Product.StockQuantity >= i.Quantity,
                StockQuantity = i.Product.StockQuantity
            })
            .ToList();

        return new CartDto
        {
            Items = items,
            TotalQuantity = items.Sum(i => i.Quantity),
            Total = items.Sum(i => i.Subtotal)
        };
    }

    public static OrderDto ToDto(this Order o) => new()
    {
        Id = o.Id,
        UserId = o.UserId,
        OrderDate = DateTime.SpecifyKind(o.CreatedAt, DateTimeKind.Utc),
        Items = o.Items.Select(i => new OrderItemDto
        {
            ProductId = i.ProductId,
            ProductName = i.ProductName,
            Quantity = i.Quantity,
            UnitPrice = i.UnitPrice,
            Subtotal = i.UnitPrice * i.Quantity
        }).ToList(),
        TotalAmount = o.TotalAmount,
        DeliveryAddress = o.DeliveryAddress,
        PaymentMethod = o.PaymentMethod,
        PaymentStatus = o.PaymentStatus,
        Status = o.Status
    };
}
