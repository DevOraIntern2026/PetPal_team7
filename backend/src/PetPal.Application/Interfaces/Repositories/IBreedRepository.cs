using PetPal.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PetPal.Application.Interfaces.Repositories
{
    public interface IBreedRepository : IGenericRepository<Breed>
    {
        Task<IReadOnlyList<Breed>> GetByPetTypeIdAsync(Guid petTypeId, CancellationToken ct = default);

        Task<bool> ExistsForPetTypeAsync(Guid breedId, Guid petTypeId, CancellationToken ct = default);
    }
}
