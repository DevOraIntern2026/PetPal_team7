using PetPal.Domain.Enums;
using System.ComponentModel.DataAnnotations;

namespace PetPal.Application.DTOs.Store;

public class ProductDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = null!;
    public string Category { get; set; } = null!;
    public string? Material { get; set; }
    public string? Color { get; set; }
    public decimal Price { get; set; }
    public string? Description { get; set; }
    public string? ImageUrl { get; set; }
    public int StockQuantity { get; set; }
    public bool IsActive { get; set; }
}

/// <summary>Admin-only. IsActive is changed through the activate/deactivate endpoints.</summary>
public class ProductRequest
{
    [Required, MaxLength(200)]
    public string Name { get; set; } = null!;

    [Required, MaxLength(100)]
    public string Category { get; set; } = null!;

    [MaxLength(100)]
    public string? Material { get; set; }

    [MaxLength(50)]
    public string? Color { get; set; }

    [Range(0.01, 1000000)]
    public decimal Price { get; set; }

    [MaxLength(2000)]
    public string? Description { get; set; }

    [MaxLength(500)]
    public string? ImageUrl { get; set; }

    [Range(0, 1000000)]
    public int StockQuantity { get; set; }
}

public class AddCartItemRequest
{
    public Guid ProductId { get; set; }

    [Range(1, 99)]
    public int Quantity { get; set; }
}

public class UpdateCartItemRequest
{
    [Range(1, 99)]
    public int Quantity { get; set; }
}

public class CartItemDto
{
    public Guid ProductId { get; set; }
    public string ProductName { get; set; } = null!;
    public string? ImageUrl { get; set; }
    public decimal UnitPrice { get; set; }
    public int Quantity { get; set; }
    public decimal Subtotal { get; set; }
    public bool IsAvailable { get; set; }
    public int StockQuantity { get; set; }
}

public class CartDto
{
    public IReadOnlyList<CartItemDto> Items { get; set; } = new List<CartItemDto>();
    public int TotalQuantity { get; set; }
    public decimal Total { get; set; }
}

public class CheckoutRequest
{
    [Required, MinLength(5), MaxLength(500)]
    public string DeliveryAddress { get; set; } = null!;

    /// <summary>"Cash" or "Card". Card stays Pending: no payment gateway is integrated.</summary>
    public PaymentMethod PaymentMethod { get; set; }
}

public class UpdateOrderStatusRequest
{
    public OrderStatus Status { get; set; }
}

public class UpdatePaymentStatusRequest
{
    public PaymentStatus PaymentStatus { get; set; }
}

public class OrderItemDto
{
    public Guid ProductId { get; set; }
    public string ProductName { get; set; } = null!;
    public int Quantity { get; set; }
    public decimal UnitPrice { get; set; }
    public decimal Subtotal { get; set; }
}

public class OrderDto
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public DateTime OrderDate { get; set; }
    public IReadOnlyList<OrderItemDto> Items { get; set; } = new List<OrderItemDto>();
    public decimal TotalAmount { get; set; }
    public string DeliveryAddress { get; set; } = null!;
    public PaymentMethod PaymentMethod { get; set; }
    public PaymentStatus PaymentStatus { get; set; }
    public OrderStatus Status { get; set; }
}
