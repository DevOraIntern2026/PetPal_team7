using PetPal.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PetPal.Application.Interfaces.Repositories
{
    public interface IMedicalHistoryRepository : IGenericRepository<MedicalHistory>
    {
        Task<IReadOnlyList<MedicalHistory>> GetByPetIdAsync(Guid petId, CancellationToken ct = default);

        Task<MedicalHistory?> GetByIdForPetAsync(Guid id, Guid petId, bool asTracking = false, CancellationToken ct = default);
    }
}
