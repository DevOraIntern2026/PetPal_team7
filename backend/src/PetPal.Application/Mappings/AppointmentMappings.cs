using PetPal.Application.DTOs.Appointments;
using PetPal.Application.Interfaces;
using PetPal.Domain.Entities;
using System.Globalization;

namespace PetPal.Application.Mappings;

public static class AppointmentMappings
{
    /// <summary>Requires a.Doctor to be loaded.</summary>
    public static AppointmentDto ToDto(this Appointment a, ISchedulingClock clock) => new()
    {
        Id = a.Id,
        UserId = a.UserId,
        DoctorId = a.DoctorId,
        DoctorName = a.Doctor.FullName,
        Specialty = a.Doctor.Specialty,
        StartUtc = DateTime.SpecifyKind(a.StartUtc, DateTimeKind.Utc),
        EndUtc = DateTime.SpecifyKind(a.EndUtc, DateTimeKind.Utc),
        LocalStart = clock.ToLocal(a.StartUtc).ToString("yyyy-MM-dd'T'HH:mm", CultureInfo.InvariantCulture),
        TimeZoneId = clock.TimeZoneId,
        Status = a.Status,
        ConsultationPrice = a.ConsultationPrice,
        Notes = a.Notes,
        CreatedAt = DateTime.SpecifyKind(a.CreatedAt, DateTimeKind.Utc)
    };
}
