using PetPal.Domain.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PetPal.Domain.Entities
{
    public class PetType : BaseEntity
    {
        public string Name { get; set; } = null!;

        public ICollection<Breed> Breeds { get; set; } = new List<Breed>();
        public ICollection<Pet> Pets { get; set; } = new List<Pet>();
    }
}
