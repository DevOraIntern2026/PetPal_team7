using PetPal.Domain.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PetPal.Domain.Entities
{
    public class Breed : BaseEntity
    {
        public string Name { get; set; } = null!;

        public Guid PetTypeId { get; set; }
        public PetType PetType { get; set; } = null!;

        public ICollection<Pet> Pets { get; set; } = new List<Pet>();
    }
}
