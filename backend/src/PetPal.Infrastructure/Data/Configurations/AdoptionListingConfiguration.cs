using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using PetPal.Domain.Entities;
using PetPal.Infrastructure.Identity;

namespace PetPal.Infrastructure.Data.Configurations;

public class AdoptionListingConfiguration : IEntityTypeConfiguration<AdoptionListing>
{
    public void Configure(EntityTypeBuilder<AdoptionListing> builder)
    {
        builder.ToTable("AdoptionListings", t =>
        {
            t.HasCheckConstraint("CK_AdoptionListings_Price", "[Price] >= 0");
            t.HasCheckConstraint("CK_AdoptionListings_Weight", "[WeightKg] > 0");
            t.HasCheckConstraint("CK_AdoptionListings_Age", "[AgeInMonths] >= 0 AND [AgeInMonths] <= 600");
        });
        builder.HasKey(x => x.Id);

        builder.Property(x => x.PetName).IsRequired().HasMaxLength(100);
        builder.Property(x => x.Location).IsRequired().HasMaxLength(200);
        builder.Property(x => x.Gender).HasConversion<string>().HasMaxLength(20);
        builder.Property(x => x.Price).HasPrecision(18, 2);
        builder.Property(x => x.WeightKg).HasPrecision(6, 2);
        builder.Property(x => x.About).HasMaxLength(2000);
        builder.Property(x => x.ImageUrl).HasMaxLength(500);
        builder.Property(x => x.Status).HasConversion<string>().HasMaxLength(20);

        builder.HasOne<ApplicationUser>()
               .WithMany()
               .HasForeignKey(x => x.OwnerId)
               .OnDelete(DeleteBehavior.Cascade);

        builder.HasIndex(x => x.OwnerId);
        builder.HasIndex(x => new { x.Status, x.Location });
        builder.HasIndex(x => x.Price);
    }
}
