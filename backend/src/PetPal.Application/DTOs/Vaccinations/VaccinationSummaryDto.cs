using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PetPal.Application.DTOs.Vaccinations
{
    public class VaccinationSummaryDto
    {
        // Number of distinct vaccines (the newest record of each name).
        public int Total { get; set; }

        // Vaccines that are still valid today (UpToDate + DueSoon). The app shows UpToDateCount / Total.
        public int UpToDateCount { get; set; }

        public int DueSoonCount { get; set; }
        public int OverdueCount { get; set; }

        // The nearest upcoming dose, if any.
        public string? NextDueName { get; set; }
        public DateOnly? NextDueDate { get; set; }
    }
}
