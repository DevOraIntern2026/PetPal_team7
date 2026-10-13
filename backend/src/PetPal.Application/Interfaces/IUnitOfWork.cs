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
        IRefreshTokenRepository RefreshTokens { get; }
        IPasswordResetCodeRepository PasswordResetCodes { get; }
        IPetRepository Pets { get; }
        IBreedRepository Breeds { get; }
        IMedicalHistoryRepository MedicalHistories { get; }
        IVaccinationRepository Vaccinations { get; }
        IDoctorRepository Doctors { get; }
        IAppointmentRepository Appointments { get; }
        IProductRepository Products { get; }
        ICartRepository Carts { get; }
        IOrderRepository Orders { get; }
        IAdoptionRepository Adoptions { get; }

        IGenericRepository<TEntity> Repository<TEntity>() where TEntity : BaseEntity;

        Task<int> SaveChangesAsync(CancellationToken ct = default);

        /// <summary>
        /// Saves and returns false (instead of throwing) when a unique-index or concurrency conflict occurs.
        /// Used to turn race-condition losers into a clean 409.
        /// </summary>
        Task<bool> TrySaveChangesAsync(CancellationToken ct = default);

        /// <summary>Runs the action in one database transaction; any exception rolls everything back.</summary>
        Task<T> ExecuteInTransactionAsync<T>(Func<Task<T>> action, CancellationToken ct = default);
    }
}
