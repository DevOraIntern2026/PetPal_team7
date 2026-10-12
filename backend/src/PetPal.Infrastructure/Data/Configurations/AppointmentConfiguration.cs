using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using PetPal.Domain.Entities;
using PetPal.Infrastructure.Identity;

namespace PetPal.Infrastructure.Data.Configurations;

public class AppointmentConfiguration : IEntityTypeConfiguration<Appointment>
{
    public void Configure(EntityTypeBuilder<Appointment> builder)
    {
        // The database itself guarantees: fixed 30-minute duration and starts on the :00/:30 grid.
        // Combined with the filtered unique index below, two active appointments for one doctor can
        // never overlap (equal-length intervals on a common grid overlap only when starts are equal).
        builder.ToTable("Appointments", t =>
        {
            t.HasCheckConstraint("CK_Appointments_30MinuteGrid",
                "[EndUtc] = DATEADD(MINUTE, 30, [StartUtc]) " +
                "AND DATEPART(MINUTE, [StartUtc]) % 30 = 0 " +
                "AND DATEPART(SECOND, [StartUtc]) = 0");
            t.HasCheckConstraint("CK_Appointments_Price", "[ConsultationPrice] >= 0");
        });

        builder.HasKey(x => x.Id);

        builder.Property(x => x.StartUtc).HasColumnType("datetime2(0)");
        builder.Property(x => x.EndUtc).HasColumnType("datetime2(0)");
        builder.Property(x => x.Status).HasConversion<string>().HasMaxLength(20);
        builder.Property(x => x.ConsultationPrice).HasPrecision(18, 2);
        builder.Property(x => x.Notes).HasMaxLength(500);

        builder.HasOne(x => x.Doctor)
               .WithMany(d => d.Appointments)
               .HasForeignKey(x => x.DoctorId)
               .OnDelete(DeleteBehavior.Restrict); // preserve appointment history

        builder.HasOne<ApplicationUser>()
               .WithMany()
               .HasForeignKey(x => x.UserId)
               .OnDelete(DeleteBehavior.Restrict); // preserve appointment history

        // Only non-cancelled appointments occupy a slot. The literal must match AppointmentStatus.Cancelled.
        builder.HasIndex(x => new { x.DoctorId, x.StartUtc })
               .IsUnique()
               .HasFilter("[Status] <> 'Cancelled'")
               .HasDatabaseName("UX_Appointments_Doctor_Start_Active");

        builder.HasIndex(x => new { x.UserId, x.StartUtc });
    }
}
