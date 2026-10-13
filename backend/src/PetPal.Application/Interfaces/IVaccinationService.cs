using PetPal.Application.DTOs.Vaccinations;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PetPal.Application.Interfaces
{
    public interface IVaccinationService
    {
        Task<VaccinationLogDto> GetLogAsync(Guid petId, CancellationToken ct = default);
        Task<VaccinationDto> GetByIdAsync(Guid petId, Guid id, CancellationToken ct = default);
        Task<VaccinationDto> CreateAsync(Guid petId, VaccinationRequest request, CancellationToken ct = default);
        Task<VaccinationDto> UpdateAsync(Guid petId, Guid id, VaccinationRequest request, CancellationToken ct = default);
        Task DeleteAsync(Guid petId, Guid id, CancellationToken ct = default);
    }
}
