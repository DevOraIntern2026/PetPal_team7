using PetPal.Application.Interfaces.Repositories;
using PetPal.Domain.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PetPal.Application.Interfaces
{
    public interface IUnitOfWork
    {
        IPetRepository Pets { get; }
        IBreedRepository Breeds { get; }
        IMedicalHistoryRepository MedicalHistories { get; }

        IPostRepository Posts { get; }

        IGenericRepository<TEntity> Repository<TEntity>() where TEntity : BaseEntity;

        Task<int> SaveChangesAsync(CancellationToken ct = default);
        IFollowRepository Follows { get; }
        INotificationRepository Notifications { get; }
    }
}
