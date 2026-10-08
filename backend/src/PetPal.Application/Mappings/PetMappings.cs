using PetPal.Application.DTOs.Pets;
using PetPal.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PetPal.Application.Mappings
{
    public static class PetMappings
    {
        public static PetDto ToDto(this Pet p) => new()
        {
            Id = p.Id,
            Name = p.Name,
            PetTypeId = p.PetTypeId,
            PetTypeName = p.PetType.Name,
            BreedId = p.BreedId,
            BreedName = p.Breed.Name,
            BirthDate = p.BirthDate,
            WeightKg = p.WeightKg,
            HeightCm = p.HeightCm,
            Gender = p.Gender,
            BloodType = p.BloodType,
            Personality = p.Personality,
            ProfileImageUrl = p.ProfileImageUrl
        };
    }
}
