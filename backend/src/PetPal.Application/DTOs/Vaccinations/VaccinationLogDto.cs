using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PetPal.Application.DTOs.Vaccinations
{
    public class VaccinationLogDto
    {
        public VaccinationSummaryDto Summary { get; set; } = new();

        // Newest first.
        public List<VaccinationDto> Items { get; set; } = new();
    }
}
