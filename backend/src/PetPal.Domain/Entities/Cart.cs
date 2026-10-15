using PetPal.Domain.Common;

namespace PetPal.Domain.Entities;

public class Cart : BaseEntity
{
    // FK -> ApplicationUser (Infrastructure). One cart per user.
    public Guid UserId { get; set; }

    public ICollection<CartItem> Items { get; set; } = new List<CartItem>();
}
