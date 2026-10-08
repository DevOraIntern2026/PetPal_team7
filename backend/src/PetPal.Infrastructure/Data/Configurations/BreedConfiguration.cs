using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using PetPal.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PetPal.Infrastructure.Data.Configurations
{
    public class BreedConfiguration : IEntityTypeConfiguration<Breed>
    {
        public void Configure(EntityTypeBuilder<Breed> builder)
        {
            builder.ToTable("Breeds");
            builder.HasKey(x => x.Id);

            builder.Property(x => x.Name).IsRequired().HasMaxLength(100);

            builder.HasOne(x => x.PetType)
                   .WithMany(t => t.Breeds)
                   .HasForeignKey(x => x.PetTypeId)
                   .OnDelete(DeleteBehavior.Restrict);

            builder.HasIndex(x => new { x.PetTypeId, x.Name }).IsUnique();
        }
    }
}
