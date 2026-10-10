using PetPal.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PetPal.Application.Interfaces.Repositories
{
    public interface IPetRepository : IGenericRepository<Pet>
    {
        Task<IReadOnlyList<Pet>> GetByOwnerIdAsync(Guid ownerId, CancellationToken ct = default);

        Task<Pet?> GetByIdForOwnerAsync(Guid id, Guid ownerId, bool asTracking = false, CancellationToken ct = default);
        Task<bool> ExistsForOwnerAsync(Guid petId, Guid ownerId, CancellationToken ct = default);

        Task RemoveAIConversationsAsync(Guid petId, CancellationToken ct = default);
    }
}
