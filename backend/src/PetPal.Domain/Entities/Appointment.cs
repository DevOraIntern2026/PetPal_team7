using PetPal.Domain.Common;
using PetPal.Domain.Enums;

namespace PetPal.Domain.Entities;

public class Appointment : BaseEntity
{
    // FK -> ApplicationUser (Infrastructure). No navigation, same convention as Pet.OwnerId.
    public Guid UserId { get; set; }

    public Guid DoctorId { get; set; }
    public Doctor Doctor { get; set; } = null!;

    // Both stored in UTC. EndUtc is always StartUtc + 30 minutes (enforced by a CHECK constraint).
    public DateTime StartUtc { get; set; }
    public DateTime EndUtc { get; set; }

    public AppointmentStatus Status { get; set; } = AppointmentStatus.Booked;

    // Price snapshot so history survives later price changes.
    public decimal ConsultationPrice { get; set; }

    public string? Notes { get; set; }
    public DateTime? CancelledAtUtc { get; set; }
}
