using PetPal.Domain.Common;
using PetPal.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PetPal.Domain.Entities
{
    public class VetVisit : BaseEntity
    {
        public Guid PetId { get; set; }
        public Pet Pet { get; set; } = null!;

        public Guid VeterinaryServiceId { get; set; }
        public VeterinaryService VeterinaryService { get; set; } = null!;

        public DateTime VisitDate { get; set; }
        public string? Notes { get; set; }
        public VetVisitStatus Status { get; set; } = VetVisitStatus.Scheduled;
    }
}
