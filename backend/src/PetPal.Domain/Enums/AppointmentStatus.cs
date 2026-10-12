namespace PetPal.Domain.Enums;

public enum AppointmentStatus
{
    // NOTE: Cancelled is excluded from the unique booking index (see AppointmentConfiguration).
    // Every other status blocks the slot.
    Booked = 1,
    Cancelled = 2,
    Completed = 3
}
