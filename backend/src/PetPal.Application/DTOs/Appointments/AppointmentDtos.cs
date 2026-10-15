using PetPal.Domain.Enums;
using System.ComponentModel.DataAnnotations;

namespace PetPal.Application.DTOs.Appointments;

public class CreateAppointmentRequest
{
    public Guid DoctorId { get; set; }

    /// <summary>Slot start as a UTC instant, e.g. "2026-10-20T09:00:00Z". Must be a start returned by availability.</summary>
    public DateTime StartUtc { get; set; }

    [MaxLength(500)]
    public string? Notes { get; set; }
}

public class UpdateAppointmentStatusRequest
{
    public AppointmentStatus Status { get; set; }
}

public class AppointmentDto
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public Guid DoctorId { get; set; }
    public string DoctorName { get; set; } = null!;
    public string Specialty { get; set; } = null!;
    public DateTime StartUtc { get; set; }
    public DateTime EndUtc { get; set; }
    public string LocalStart { get; set; } = null!;
    public string TimeZoneId { get; set; } = null!;
    public AppointmentStatus Status { get; set; }
    public decimal ConsultationPrice { get; set; }
    public string? Notes { get; set; }
    public DateTime CreatedAt { get; set; }
}
