using PetPal.Domain.Common;
using PetPal.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PetPal.Domain.Entities
{
    public class Pet : BaseEntity
    {
        // FK -> ApplicationUser (Infrastructure). No navigation here to keep Domain independent.
        public Guid OwnerId { get; set; }

        public Guid PetTypeId { get; set; }
        public PetType PetType { get; set; } = null!;

        public Guid BreedId { get; set; }
        public Breed Breed { get; set; } = null!;

        public string Name { get; set; } = null!;
        public DateOnly BirthDate { get; set; }
        public decimal WeightKg { get; set; }
        public decimal HeightCm { get; set; }
        public Gender Gender { get; set; }

        public BloodType? BloodType { get; set; }
        public string? Personality { get; set; }
        public string? ProfileImageUrl { get; set; }

        public ICollection<MedicalHistory> MedicalHistories { get; set; } = new List<MedicalHistory>();
        public ICollection<Vaccination> Vaccinations { get; set; } = new List<Vaccination>();
        public ICollection<Medication> Medications { get; set; } = new List<Medication>();
        public ICollection<Reminder> Reminders { get; set; } = new List<Reminder>();
        public ICollection<VetVisit> VetVisits { get; set; } = new List<VetVisit>();
        public ICollection<LostPetAlert> LostPetAlerts { get; set; } = new List<LostPetAlert>();
        public ICollection<AIConversation> AIConversations { get; set; } = new List<AIConversation>();
    }
}
