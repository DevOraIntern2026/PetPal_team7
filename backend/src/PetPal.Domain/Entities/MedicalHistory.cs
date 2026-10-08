using PetPal.Domain.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PetPal.Domain.Entities
{
    public class MedicalHistory : BaseEntity
    {
        public Guid PetId { get; set; }
        public Pet Pet { get; set; } = null!;

        public string Title { get; set; } = null!;
        public string? Description { get; set; }

    }
}
