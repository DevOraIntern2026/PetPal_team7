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
    public class AIMessageConfiguration : IEntityTypeConfiguration<AIMessage>
    {
        public void Configure(EntityTypeBuilder<AIMessage> builder)
        {
            builder.ToTable("AIMessages");
            builder.HasKey(x => x.Id);

            builder.Property(x => x.Role).HasConversion<string>().HasMaxLength(20);
            builder.Property(x => x.Content).IsRequired();

            builder.HasOne(x => x.Conversation)
                   .WithMany(c => c.Messages)
                   .HasForeignKey(x => x.ConversationId)
                   .OnDelete(DeleteBehavior.Cascade);

            builder.HasIndex(x => new { x.ConversationId, x.CreatedAt });
        }
    }
}
