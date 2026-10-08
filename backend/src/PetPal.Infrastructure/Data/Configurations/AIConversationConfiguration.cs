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
    public class AIConversationConfiguration : IEntityTypeConfiguration<AIConversation>
    {
        public void Configure(EntityTypeBuilder<AIConversation> builder)
        {
            builder.ToTable("AIConversations");
            builder.HasKey(x => x.Id);

            builder.HasOne<ApplicationUser>()
                   .WithMany()
                   .HasForeignKey(x => x.UserId)
                   .OnDelete(DeleteBehavior.Cascade);

            builder.HasOne(x => x.Pet)
                   .WithMany(p => p.AIConversations)
                   .HasForeignKey(x => x.PetId)
                   .OnDelete(DeleteBehavior.Restrict);

            builder.HasIndex(x => new { x.UserId, x.CreatedAt });
        }
    }
}
