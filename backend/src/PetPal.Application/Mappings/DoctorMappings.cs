using PetPal.Application.DTOs.Doctors;
using PetPal.Domain.Entities;

namespace PetPal.Application.Mappings;

public static class DoctorMappings
{
    public static DoctorDto ToDto(this Doctor d) => new()
    {
        Id = d.Id,
        FullName = d.FullName,
        Specialty = d.Specialty,
        Description = d.Description,
        Phone = d.Phone,
        Email = d.Email,
        ConsultationPrice = d.ConsultationPrice,
        IsActive = d.IsActive,
        WorkingHours = d.WorkingHours
            .OrderBy(w => ((int)w.DayOfWeek + 6) % 7) // Monday first
            .Select(w => new WorkingHoursDto { DayOfWeek = w.DayOfWeek, StartTime = w.StartTime, EndTime = w.EndTime })
            .ToList()
    };
}
