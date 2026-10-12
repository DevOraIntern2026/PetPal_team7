using System.ComponentModel.DataAnnotations;

namespace PetPal.Application.DTOs.Doctors;

public class WorkingHoursDto
{
    public DayOfWeek DayOfWeek { get; set; }
    public TimeOnly StartTime { get; set; }
    public TimeOnly EndTime { get; set; }
}

public class DoctorDto
{
    public Guid Id { get; set; }
    public string FullName { get; set; } = null!;
    public string Specialty { get; set; } = null!;
    public string? Description { get; set; }
    public string? Phone { get; set; }
    public string? Email { get; set; }
    public decimal ConsultationPrice { get; set; }
    public bool IsActive { get; set; }
    public IReadOnlyList<WorkingHoursDto> WorkingHours { get; set; } = new List<WorkingHoursDto>();
}

public class WorkingHoursRequest
{
    public DayOfWeek DayOfWeek { get; set; }

    /// <summary>Clinic-local time, "HH:mm:ss". Must be on a 30-minute boundary.</summary>
    public TimeOnly StartTime { get; set; }

    /// <summary>Clinic-local time, "HH:mm:ss". Must be after StartTime and on a 30-minute boundary.</summary>
    public TimeOnly EndTime { get; set; }
}

public class DoctorRequest
{
    [Required, MaxLength(150)]
    public string FullName { get; set; } = null!;

    [Required, MaxLength(100)]
    public string Specialty { get; set; } = null!;

    [MaxLength(2000)]
    public string? Description { get; set; }

    [MaxLength(30)]
    public string? Phone { get; set; }

    [EmailAddress, MaxLength(256)]
    public string? Email { get; set; }

    [Range(0, 100000)]
    public decimal ConsultationPrice { get; set; }
}

public class CreateDoctorRequest : DoctorRequest
{
    public List<WorkingHoursRequest>? WorkingHours { get; set; }
}

public class SetScheduleRequest
{
    [Required]
    public List<WorkingHoursRequest> WorkingHours { get; set; } = new();
}

public class SlotDto
{
    public DateTime StartUtc { get; set; }
    public DateTime EndUtc { get; set; }
    public string LocalStart { get; set; } = null!;
    public string LocalEnd { get; set; } = null!;
}

public class AvailabilityDto
{
    public Guid DoctorId { get; set; }
    public string DoctorName { get; set; } = null!;
    public DateOnly Date { get; set; }
    public string TimeZoneId { get; set; } = null!;
    public int SlotMinutes { get; set; }
    public IReadOnlyList<SlotDto> Slots { get; set; } = new List<SlotDto>();
}
