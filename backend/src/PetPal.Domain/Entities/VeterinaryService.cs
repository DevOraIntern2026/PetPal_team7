using PetPal.Domain.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PetPal.Domain.Entities
{
    public class VeterinaryService : BaseEntity
    {
        public string Name { get; set; } = null!;
        public string? Description { get; set; }
        public string Phone { get; set; } = null!;
        public string? Email { get; set; }
        public string Address { get; set; } = null!;
        public decimal Latitude { get; set; }
        public decimal Longitude { get; set; }
        public string? OpeningHours { get; set; }
        public bool IsActive { get; set; } = true;

        public ICollection<VetVisit> VetVisits { get; set; } = new List<VetVisit>();

    }
}
