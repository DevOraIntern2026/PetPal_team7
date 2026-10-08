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
    public class MedicalHistoryConfiguration : IEntityTypeConfiguration<MedicalHistory>
    {
        public void Configure(EntityTypeBuilder<MedicalHistory> builder)
        {
            builder.ToTable("MedicalHistories");
            builder.HasKey(x => x.Id);

            builder.Property(x => x.Title).IsRequired().HasMaxLength(200);
            builder.Property(x => x.Description).HasMaxLength(2000);
            builder.Property(x => x.CreatedAt).HasColumnName("RecordedAt");

            builder.HasOne(x => x.Pet)
                   .WithMany(p => p.MedicalHistories)
                   .HasForeignKey(x => x.PetId)
                   .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
