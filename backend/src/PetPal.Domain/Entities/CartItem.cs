using PetPal.Domain.Common;

namespace PetPal.Domain.Entities;

/// <summary>Stores only product + quantity. Prices are always read from Product, never stored here.</summary>
public class CartItem : BaseEntity
{
    public Guid CartId { get; set; }
    public Cart Cart { get; set; } = null!;

    public Guid ProductId { get; set; }
    public Product Product { get; set; } = null!;

    public int Quantity { get; set; }
}
