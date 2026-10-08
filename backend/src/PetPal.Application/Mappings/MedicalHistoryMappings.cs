using PetPal.Application.DTOs.MedicalHistory;
using PetPal.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PetPal.Application.Mappings
{
    public static class MedicalHistoryMappings
    {
        public static MedicalHistoryDto ToDto(this MedicalHistory m) => new()
        {
            Id = m.Id,
            PetId = m.PetId,
            Title = m.Title,
            Description = m.Description,
            RecordedAt = m.CreatedAt,
            UpdatedAt = m.UpdatedAt
        };
    }
}
