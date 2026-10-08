using PetPal.Domain.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PetPal.Domain.Entities
{
    public class Vaccination : BaseEntity
    {
        public Guid PetId { get; set; }
        public Pet Pet { get; set; } = null!;

        public string Name { get; set; } = null!;
        public DateOnly DateGiven { get; set; }
        public DateOnly? NextDueDate { get; set; }
        public string? Notes { get; set; }

    }
}
