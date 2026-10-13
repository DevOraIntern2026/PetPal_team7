using PetPal.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PetPal.Application.Interfaces.Repositories
{
    public interface IVaccinationRepository : IGenericRepository<Vaccination>
    {
        Task<IReadOnlyList<Vaccination>> GetByPetIdAsync(Guid petId, CancellationToken ct = default);

        Task<Vaccination?> GetByIdForPetAsync(Guid id, Guid petId, bool asTracking = false, CancellationToken ct = default);
    }
}
