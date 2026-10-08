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
    public class LostPetAlertConfiguration : IEntityTypeConfiguration<LostPetAlert>
    {
        public void Configure(EntityTypeBuilder<LostPetAlert> builder)
        {
            builder.ToTable("LostPetAlerts");
            builder.HasKey(x => x.Id);

            builder.Property(x => x.Description).IsRequired().HasMaxLength(2000);
            builder.Property(x => x.LastSeenLocation).IsRequired().HasMaxLength(500);
            builder.Property(x => x.Latitude).HasPrecision(9, 6);
            builder.Property(x => x.Longitude).HasPrecision(9, 6);

            builder.HasOne(x => x.Pet)
                   .WithMany(p => p.LostPetAlerts)
                   .HasForeignKey(x => x.PetId)
                   .OnDelete(DeleteBehavior.Cascade);

            builder.HasOne<ApplicationUser>()
                   .WithMany()
                   .HasForeignKey(x => x.UserId)
                   .OnDelete(DeleteBehavior.Restrict);

            builder.HasIndex(x => new { x.IsResolved, x.LostAt });
        }
    }
}
