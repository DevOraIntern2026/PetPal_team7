using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PetPal.Application.DTOs.MedicalHistory
{
    public class MedicalHistoryDto
    {
        public Guid Id { get; set; }
        public Guid PetId { get; set; }
        public string Title { get; set; } = null!;
        public string? Description { get; set; }
        public DateTime RecordedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
    }
}
