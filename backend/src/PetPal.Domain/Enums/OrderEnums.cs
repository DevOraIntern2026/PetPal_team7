namespace PetPal.Domain.Enums;

public enum PaymentMethod
{
    Cash = 1,
    Card = 2
}

public enum PaymentStatus
{
    Pending = 1,
    Paid = 2,
    Failed = 3
}

public enum OrderStatus
{
    Pending = 1,
    Confirmed = 2,
    Shipped = 3,
    Delivered = 4,
    Cancelled = 5
}
