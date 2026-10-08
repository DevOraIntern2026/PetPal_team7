using PetPal.Application.DTOs.Pets;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PetPal.Application.Interfaces
{
    public interface IPetService
    {
        Task<IReadOnlyList<PetDto>> GetMyPetsAsync(CancellationToken ct = default);
        Task<PetDto> GetByIdAsync(Guid id, CancellationToken ct = default);
        Task<PetDto> CreateAsync(PetRequest request, CancellationToken ct = default);
        Task<PetDto> UpdateAsync(Guid id, PetRequest request, CancellationToken ct = default);
        Task DeleteAsync(Guid id, CancellationToken ct = default);
    }

}
