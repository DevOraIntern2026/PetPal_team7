using PetPal.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PetPal.Application.DTOs.Vaccinations
{
    public class VaccinationDto
    {
        public Guid Id { get; set; }
        public Guid PetId { get; set; }
        public string Name { get; set; } = null!;
        public DateOnly DateGiven { get; set; }
        public DateOnly? NextDueDate { get; set; }
        public string? Notes { get; set; }
        public VaccinationStatus Status { get; set; }

        // Days until the next dose (negative when overdue). Null when there is no next dose or the record is superseded.
        public int? DaysUntilNextDue { get; set; }
    }
}
