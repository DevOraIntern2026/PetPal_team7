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
    public class VeterinaryServiceConfiguration : IEntityTypeConfiguration<VeterinaryService>
    {
        public void Configure(EntityTypeBuilder<VeterinaryService> builder)
        {
            builder.ToTable("VeterinaryServices");
            builder.HasKey(x => x.Id);

            builder.Property(x => x.Name).IsRequired().HasMaxLength(200);
            builder.Property(x => x.Description).HasMaxLength(2000);
            builder.Property(x => x.Phone).IsRequired().HasMaxLength(30);
            builder.Property(x => x.Email).HasMaxLength(256);
            builder.Property(x => x.Address).IsRequired().HasMaxLength(500);
            builder.Property(x => x.OpeningHours).HasMaxLength(500);
            builder.Property(x => x.Latitude).HasPrecision(9, 6);
            builder.Property(x => x.Longitude).HasPrecision(9, 6);

            builder.HasIndex(x => new { x.Latitude, x.Longitude });
        }
    }
}
