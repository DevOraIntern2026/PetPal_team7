using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using PetPal.Domain.Common;
using PetPal.Domain.Entities;
using PetPal.Infrastructure.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PetPal.Infrastructure.Data
{
    public class PetPalDbContext : IdentityDbContext<ApplicationUser, IdentityRole<Guid>, Guid>
    {
        public PetPalDbContext(DbContextOptions<PetPalDbContext> options) : base(options)
        {
        }

        // Pets
        public DbSet<Pet> Pets => Set<Pet>();
        public DbSet<PetType> PetTypes => Set<PetType>();
        public DbSet<Breed> Breeds => Set<Breed>();

        // Health
        public DbSet<MedicalHistory> MedicalHistories => Set<MedicalHistory>();
        public DbSet<Vaccination> Vaccinations => Set<Vaccination>();
        public DbSet<Medication> Medications => Set<Medication>();
        public DbSet<Reminder> Reminders => Set<Reminder>();
        public DbSet<VeterinaryService> VeterinaryServices => Set<VeterinaryService>();
        public DbSet<VetVisit> VetVisits => Set<VetVisit>();

        // Doctors & appointments
        public DbSet<Doctor> Doctors => Set<Doctor>();
        public DbSet<DoctorWorkingHours> WorkingHours => Set<DoctorWorkingHours>();
        public DbSet<Appointment> Appointments => Set<Appointment>();

        // Store
        public DbSet<Product> Products => Set<Product>();
        public DbSet<Cart> Carts => Set<Cart>();
        public DbSet<CartItem> CartItems => Set<CartItem>();
        public DbSet<Order> Orders => Set<Order>();
        public DbSet<OrderItem> OrderItems => Set<OrderItem>();

        // Adoption
        public DbSet<AdoptionListing> AdoptionListings => Set<AdoptionListing>();

        // Community
        public DbSet<Post> Posts => Set<Post>();
        public DbSet<PostImage> PostImages => Set<PostImage>();
        public DbSet<Comment> Comments => Set<Comment>();
        public DbSet<PostLike> PostLikes => Set<PostLike>();
        public DbSet<LostPetAlert> LostPetAlerts => Set<LostPetAlert>();

        // AI
        public DbSet<AIConversation> AIConversations => Set<AIConversation>();
        public DbSet<AIMessage> AIMessages => Set<AIMessage>();

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            builder.ApplyConfigurationsFromAssembly(typeof(PetPalDbContext).Assembly);
        }

        public override Task<int> SaveChangesAsync(CancellationToken ct = default)
        {
            var now = DateTime.UtcNow;

            foreach (var entry in ChangeTracker.Entries<BaseEntity>())
            {
                if (entry.State == EntityState.Added)
                    entry.Entity.CreatedAt = now;
                else if (entry.State == EntityState.Modified)
                    entry.Entity.UpdatedAt = now;
            }

            return base.SaveChangesAsync(ct);
        }
    }
}
