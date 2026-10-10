using PetPal.Domain.Enums;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PetPal.Application.DTOs.Pets
{
    public class PetRequest
    {
        public Guid PetTypeId { get; set; }
        public Guid BreedId { get; set; }

        [Required, MaxLength(100)]
        public string Name { get; set; } = null!;

        public DateOnly BirthDate { get; set; }

        [Range(0.01, 500)]
        public decimal WeightKg { get; set; }

        [Range(0.01, 300)]
        public decimal HeightCm { get; set; }

        public Gender Gender { get; set; }
        public BloodType? BloodType { get; set; }

        [MaxLength(1000)]
        public string? Personality { get; set; }

        [MaxLength(500)]
        public string? ProfileImageUrl { get; set; }
    }
}
