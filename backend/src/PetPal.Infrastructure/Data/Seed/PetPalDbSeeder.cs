using Microsoft.EntityFrameworkCore;
using PetPal.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PetPal.Infrastructure.Data.Seed
{
    public static class PetPalDbSeeder
    {
        private static readonly Dictionary<string, string[]> PetTypesWithBreeds = new()
        {
            ["Dog"] = new[]
            {
            "Golden Retriever", "German Shepherd", "Labrador Retriever", "Husky",
            "Poodle", "Bulldog", "Rottweiler", "Pomeranian", "Shih Tzu", "Beagle", "Mixed/Other"
        },
            ["Cat"] = new[]
            {
            "Persian", "Siamese", "British Shorthair", "Maine Coon", "Scottish Fold",
            "Ragdoll", "Bengal", "Egyptian Mau", "Domestic Shorthair", "Mixed/Other"
        },
            ["Bunny"] = new[]
            {
            "Holland Lop", "Mini Rex", "Netherland Dwarf", "Lionhead", "Mixed/Other"
        },
            ["Bird"] = new[]
            {
            "Budgerigar", "Cockatiel", "Canary", "Lovebird", "African Grey Parrot", "Mixed/Other"
        },
            ["Other"] = new[] { "Other" }
        };

        public static async Task SeedAsync(PetPalDbContext dbcontext, CancellationToken ct = default)
        {
            var existingTypes = await dbcontext.PetTypes.Include(t => t.Breeds).ToListAsync(ct);

            foreach (var (typeName, breedNames) in PetTypesWithBreeds)
            {
                var petType = existingTypes.FirstOrDefault(t => t.Name == typeName);

                if (petType is null)
                {
                    petType = new PetType { Name = typeName };
                    dbcontext.PetTypes.Add(petType);
                    existingTypes.Add(petType);
                }

                foreach (var breedName in breedNames)
                {
                    if (petType.Breeds.All(b => b.Name != breedName))
                        petType.Breeds.Add(new Breed { Name = breedName });
                }
            }

            await dbcontext.SaveChangesAsync(ct);
        }
    }
}
