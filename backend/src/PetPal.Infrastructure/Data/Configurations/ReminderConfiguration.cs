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
    public class ReminderConfiguration : IEntityTypeConfiguration<Reminder>
    {
        public void Configure(EntityTypeBuilder<Reminder> builder)
        {
            builder.ToTable("Reminders");
            builder.HasKey(x => x.Id);

            builder.Property(x => x.Title).IsRequired().HasMaxLength(200);
            builder.Property(x => x.Type).HasConversion<string>().HasMaxLength(30);

            builder.HasOne(x => x.Pet)
                   .WithMany(p => p.Reminders)
                   .HasForeignKey(x => x.PetId)
                   .OnDelete(DeleteBehavior.Cascade);

            builder.HasIndex(x => new { x.PetId, x.ScheduledAt });
            builder.HasIndex(x => new { x.IsCompleted, x.ScheduledAt });
        }
    }
}
