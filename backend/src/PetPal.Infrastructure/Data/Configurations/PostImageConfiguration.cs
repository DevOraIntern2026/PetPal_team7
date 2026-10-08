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
    public class PostImageConfiguration : IEntityTypeConfiguration<PostImage>
    {
        public void Configure(EntityTypeBuilder<PostImage> builder)
        {
            builder.ToTable("PostImages");
            builder.HasKey(x => x.Id);

            builder.Property(x => x.ImageUrl).IsRequired().HasMaxLength(2048);

            builder.HasOne(x => x.Post)
                   .WithMany(p => p.Images)
                   .HasForeignKey(x => x.PostId)
                   .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
