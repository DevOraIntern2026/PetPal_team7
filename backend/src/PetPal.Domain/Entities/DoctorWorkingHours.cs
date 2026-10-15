using PetPal.Domain.Common;

namespace PetPal.Domain.Entities;

/// <summary>
/// One working interval per doctor per weekday, in clinic-local wall-clock time.
/// A single interval per day makes overlapping schedule definitions impossible.
/// </summary>
public class DoctorWorkingHours : BaseEntity
{
    public Guid DoctorId { get; set; }
    public Doctor Doctor { get; set; } = null!;

    public DayOfWeek DayOfWeek { get; set; }
    public TimeOnly StartTime { get; set; }
    public TimeOnly EndTime { get; set; }
}
