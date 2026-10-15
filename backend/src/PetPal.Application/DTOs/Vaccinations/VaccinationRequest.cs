using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PetPal.Application.DTOs.Vaccinations
{
    public class VaccinationRequest
    {
        [Required, MaxLength(150)]
        public string Name { get; set; } = null!;

        public DateOnly DateGiven { get; set; }

        public DateOnly? NextDueDate { get; set; }

        [MaxLength(1000)]
        public string? Notes { get; set; }
    }
}
