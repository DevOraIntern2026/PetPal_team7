using PetPal.Application.DTOs.MedicalHistory;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PetPal.Application.Interfaces
{
    public interface IMedicalHistoryService
    {
        Task<IReadOnlyList<MedicalHistoryDto>> GetAllAsync(Guid petId, CancellationToken ct = default);
        Task<MedicalHistoryDto> GetByIdAsync(Guid petId, Guid id, CancellationToken ct = default);
        Task<MedicalHistoryDto> CreateAsync(Guid petId, MedicalHistoryRequest request, CancellationToken ct = default);
        Task<MedicalHistoryDto> UpdateAsync(Guid petId, Guid id, MedicalHistoryRequest request, CancellationToken ct = default);
        Task DeleteAsync(Guid petId, Guid id, CancellationToken ct = default);
    }
}
