using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using PetPal.Domain.Entities;

namespace PetPal.Infrastructure.Data.Configurations;

public class DoctorWorkingHoursConfiguration : IEntityTypeConfiguration<DoctorWorkingHours>
{
    public void Configure(EntityTypeBuilder<DoctorWorkingHours> builder)
    {
        builder.ToTable("DoctorWorkingHours", t => t.HasCheckConstraint("CK_DoctorWorkingHours_Range", "[EndTime] > [StartTime]"));
        builder.HasKey(x => x.Id);

        builder.Property(x => x.DayOfWeek).HasConversion<string>().HasMaxLength(10);
        builder.Property(x => x.StartTime).HasColumnType("time(0)");
        builder.Property(x => x.EndTime).HasColumnType("time(0)");

        builder.HasOne(x => x.Doctor)
               .WithMany(d => d.WorkingHours)
               .HasForeignKey(x => x.DoctorId)
               .OnDelete(DeleteBehavior.Cascade);

        // One interval per weekday => schedules cannot overlap.
        builder.HasIndex(x => new { x.DoctorId, x.DayOfWeek }).IsUnique();
    }
}
