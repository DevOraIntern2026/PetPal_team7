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
    public class PostLikeConfiguration : IEntityTypeConfiguration<PostLike>
    {
        public void Configure(EntityTypeBuilder<PostLike> builder)
        {
            builder.ToTable("PostLikes");

            builder.HasKey(x => new { x.PostId, x.UserId });

            builder.HasOne(x => x.Post)
                   .WithMany(p => p.Likes)
                   .HasForeignKey(x => x.PostId)
                   .OnDelete(DeleteBehavior.Cascade);

            builder.HasOne<ApplicationUser>()
                   .WithMany()
                   .HasForeignKey(x => x.UserId)
                   .OnDelete(DeleteBehavior.Restrict);

            builder.HasIndex(x => x.UserId);
        }
    }
}
