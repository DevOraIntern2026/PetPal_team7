using PetPal.Domain.Common;
using PetPal.Domain.Enums;

namespace PetPal.Domain.Entities;

public class Order : BaseEntity
{
    // FK -> ApplicationUser (Infrastructure)
    public Guid UserId { get; set; }

    public OrderStatus Status { get; set; } = OrderStatus.Pending;
    public PaymentMethod PaymentMethod { get; set; }
    public PaymentStatus PaymentStatus { get; set; } = PaymentStatus.Pending;

    public decimal TotalAmount { get; set; }
    public string DeliveryAddress { get; set; } = null!;

    public ICollection<OrderItem> Items { get; set; } = new List<OrderItem>();
}
