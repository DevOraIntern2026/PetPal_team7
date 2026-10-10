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
    public class CommentConfiguration : IEntityTypeConfiguration<Comment>
    {
        public void Configure(EntityTypeBuilder<Comment> builder)
        {
            builder.ToTable("Comments");
            builder.HasKey(x => x.Id);

            builder.Property(x => x.Content).IsRequired().HasMaxLength(2000);

            builder.HasOne(x => x.Post)
                   .WithMany(p => p.Comments)
                   .HasForeignKey(x => x.PostId)
                   .OnDelete(DeleteBehavior.Cascade);

            // Restrict to avoid multiple cascade paths in SQL Server (User -> Post -> Comment).
            builder.HasOne<ApplicationUser>()
                   .WithMany()
                   .HasForeignKey(x => x.UserId)
                   .OnDelete(DeleteBehavior.Restrict);

            builder.HasIndex(x => x.PostId);
            builder.HasIndex(x => x.UserId);
        }
    }

}
