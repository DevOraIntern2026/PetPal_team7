using PetPal.Domain.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PetPal.Domain.Entities
{
    public class LostPetAlert : BaseEntity
    {
        public Guid PetId { get; set; }
        public Pet Pet { get; set; } = null!;

        public Guid UserId { get; set; }

        public string Description { get; set; } = null!;
        public string LastSeenLocation { get; set; } = null!;
        public decimal Latitude { get; set; }
        public decimal Longitude { get; set; }
        public DateTime LostAt { get; set; }
        public bool IsResolved { get; set; }
    }
}
