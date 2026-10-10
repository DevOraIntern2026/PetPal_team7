using PetPal.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PetPal.Application.DTOs.Pets
{
    public class PetDto
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = null!;
        public Guid PetTypeId { get; set; }
        public string PetTypeName { get; set; } = null!;
        public Guid BreedId { get; set; }
        public string BreedName { get; set; } = null!;
        public DateOnly BirthDate { get; set; }
        public decimal WeightKg { get; set; }
        public decimal HeightCm { get; set; }
        public Gender Gender { get; set; }
        public BloodType? BloodType { get; set; }
        public string? Personality { get; set; }
        public string? ProfileImageUrl { get; set; }

        // Calculated from BirthDate (the app shows "2 years old")
        public int AgeInYears
        {
            get
            {
                var today = DateOnly.FromDateTime(DateTime.UtcNow);
                var age = today.Year - BirthDate.Year;
                if (BirthDate > today.AddYears(-age)) age--;
                return age;
            }
        }
    }
}
