using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PetPal.Domain.Enums
{
    public enum VaccinationStatus
    {
        UpToDate = 1,
        DueSoon = 2,     // next dose within 30 days
        Overdue = 3,     // next dose date has passed
        Superseded = 4   // an older dose of a vaccine that has a newer record
    }
}
