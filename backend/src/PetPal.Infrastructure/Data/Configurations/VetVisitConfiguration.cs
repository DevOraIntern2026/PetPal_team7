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
    public class VetVisitConfiguration : IEntityTypeConfiguration<VetVisit>
    {
        public void Configure(EntityTypeBuilder<VetVisit> builder)
        {
            builder.ToTable("VetVisits");
            builder.HasKey(x => x.Id);

            builder.Property(x => x.Notes).HasMaxLength(2000);
            builder.Property(x => x.Status).HasConversion<string>().HasMaxLength(20);

            builder.HasOne(x => x.Pet)
                   .WithMany(p => p.VetVisits)
                   .HasForeignKey(x => x.PetId)
                   .OnDelete(DeleteBehavior.Cascade);

            builder.HasOne(x => x.VeterinaryService)
                   .WithMany(s => s.VetVisits)
                   .HasForeignKey(x => x.VeterinaryServiceId)
                   .OnDelete(DeleteBehavior.Restrict);
        }
    }
}
