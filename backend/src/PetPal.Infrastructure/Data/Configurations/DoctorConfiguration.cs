using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using PetPal.Domain.Entities;

namespace PetPal.Infrastructure.Data.Configurations;

public class DoctorConfiguration : IEntityTypeConfiguration<Doctor>
{
    public void Configure(EntityTypeBuilder<Doctor> builder)
    {
        builder.ToTable("Doctors", t => t.HasCheckConstraint("CK_Doctors_ConsultationPrice", "[ConsultationPrice] >= 0"));
        builder.HasKey(x => x.Id);

        builder.Property(x => x.FullName).IsRequired().HasMaxLength(150);
        builder.Property(x => x.Specialty).IsRequired().HasMaxLength(100);
        builder.Property(x => x.Description).HasMaxLength(2000);
        builder.Property(x => x.Phone).HasMaxLength(30);
        builder.Property(x => x.Email).HasMaxLength(256);
        builder.Property(x => x.ConsultationPrice).HasPrecision(18, 2);

        builder.HasIndex(x => new { x.IsActive, x.Specialty });
    }
}
