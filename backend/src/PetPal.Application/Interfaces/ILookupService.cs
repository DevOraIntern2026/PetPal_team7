using PetPal.Application.DTOs.Pets;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PetPal.Application.Interfaces
{
    public interface ILookupService
    {
        Task<IReadOnlyList<PetTypeDto>> GetPetTypesAsync(CancellationToken ct = default);
        Task<IReadOnlyList<BreedDto>> GetBreedsAsync(Guid petTypeId, CancellationToken ct = default);
    }
}
