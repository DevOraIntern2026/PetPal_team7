using PetPal.Domain.Common;

namespace PetPal.Domain.Entities;

/// <summary>An individual doctor. Distinct from VeterinaryService (a clinic).</summary>
public class Doctor : BaseEntity
{
    public string FullName { get; set; } = null!;
    public string Specialty { get; set; } = null!;
    public string? Description { get; set; }
    public string? Phone { get; set; }
    public string? Email { get; set; }
    public decimal ConsultationPrice { get; set; }
    public bool IsActive { get; set; } = true;

    public ICollection<DoctorWorkingHours> WorkingHours { get; set; } = new List<DoctorWorkingHours>();
    public ICollection<Appointment> Appointments { get; set; } = new List<Appointment>();
}
