using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using PetPal.Domain.Entities;
using PetPal.Infrastructure.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PetPal.Infrastructure.Data.Configurations
{
    public class PetConfiguration : IEntityTypeConfiguration<Pet>
    {
        public void Configure(EntityTypeBuilder<Pet> builder)
        {
            builder.ToTable("Pets");
            builder.HasKey(x => x.Id);

            builder.Property(x => x.Name).IsRequired().HasMaxLength(100);
            builder.Property(x => x.WeightKg).HasPrecision(6, 2);
            builder.Property(x => x.HeightCm).HasPrecision(6, 2);
            builder.Property(x => x.Gender).HasConversion<string>().HasMaxLength(20);
            builder.Property(x => x.BloodType).HasConversion<string>().HasMaxLength(50);
            builder.Property(x => x.Personality).HasMaxLength(1000);
            builder.Property(x => x.ProfileImageUrl).HasMaxLength(500);

            builder.HasOne<ApplicationUser>()
                   .WithMany()
                   .HasForeignKey(x => x.OwnerId)
                   .OnDelete(DeleteBehavior.Cascade);

            builder.HasOne(x => x.PetType)
                   .WithMany(t => t.Pets)
                   .HasForeignKey(x => x.PetTypeId)
                   .OnDelete(DeleteBehavior.Restrict);

            builder.HasOne(x => x.Breed)
                   .WithMany(b => b.Pets)
                   .HasForeignKey(x => x.BreedId)
                   .OnDelete(DeleteBehavior.Restrict);

            builder.HasIndex(x => x.OwnerId);
        }
    }
}
