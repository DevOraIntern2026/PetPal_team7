using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PetPal.Application.DTOs.Pets
{
    public class BreedDto
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = null!;
    }
}
