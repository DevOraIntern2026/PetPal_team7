using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using PetPal.Application.Interfaces;
using PetPal.Application.Interfaces.Repositories;
using PetPal.Domain.Common;
using PetPal.Infrastructure.Data;
using PetPal.Infrastructure.Repositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace PetPal.Infrastructure.Data
{
    public class UnitOfWork : IUnitOfWork
    {
        private readonly PetPalDbContext _context;
        private readonly Dictionary<Type, object> _repositories = new();

        private IRefreshTokenRepository? _refreshTokens;
        private IPasswordResetCodeRepository? _passwordResetCodes;
        private IPetRepository? _pets;
        private IBreedRepository? _breeds;
        private IMedicalHistoryRepository? _medicalHistories;
        private IVaccinationRepository? _vaccinations;
        private IDoctorRepository? _doctors;
        private IAppointmentRepository? _appointments;
        private IProductRepository? _products;
        private ICartRepository? _carts;
        private IOrderRepository? _orders;
        private IAdoptionRepository? _adoptions;

        private IPostRepository? _posts;

        private IFollowRepository? _follows;
        public IFollowRepository Follows => _follows ??= new FollowRepository(_context);

        private INotificationRepository? _notifications;
        public INotificationRepository Notifications => _notifications ??= new NotificationRepository(_context);

        public UnitOfWork(PetPalDbContext context) => _context = context;

        public IRefreshTokenRepository RefreshTokens => _refreshTokens ??= new RefreshTokenRepository(_context);
        public IPasswordResetCodeRepository PasswordResetCodes => _passwordResetCodes ??= new PasswordResetCodeRepository(_context);
        public IPetRepository Pets => _pets ??= new PetRepository(_context);

        public IBreedRepository Breeds => _breeds ??= new BreedRepository(_context);

        public IMedicalHistoryRepository MedicalHistories => _medicalHistories ??= new MedicalHistoryRepository(_context);
        public IVaccinationRepository Vaccinations => _vaccinations ??= new VaccinationRepository(_context);

        public IDoctorRepository Doctors => _doctors ??= new DoctorRepository(_context);

        public IAppointmentRepository Appointments => _appointments ??= new AppointmentRepository(_context);

        public IProductRepository Products => _products ??= new ProductRepository(_context);

        public ICartRepository Carts => _carts ??= new CartRepository(_context);

        public IOrderRepository Orders => _orders ??= new OrderRepository(_context);

        public IAdoptionRepository Adoptions => _adoptions ??= new AdoptionRepository(_context);

        public IPostRepository Posts => _posts ??= new PostRepository(_context);

        public IGenericRepository<TEntity> Repository<TEntity>() where TEntity : BaseEntity
        {
            var type = typeof(TEntity);

            if (!_repositories.TryGetValue(type, out var repository))
            {
                repository = new GenericRepository<TEntity>(_context);
                _repositories[type] = repository;
            }

            return (IGenericRepository<TEntity>)repository;
        }

        public Task<int> SaveChangesAsync(CancellationToken ct = default)
            => _context.SaveChangesAsync(ct);

        public async Task<bool> TrySaveChangesAsync(CancellationToken ct = default)
        {
            try
            {
                await _context.SaveChangesAsync(ct);
                return true;
            }
            catch (DbUpdateConcurrencyException)
            {
                return false;
            }
            catch (DbUpdateException ex) when (ex.InnerException is SqlException { Number: 2601 or 2627 })
            {
                return false; // unique index / primary key violation
            }
        }

        public async Task<T> ExecuteInTransactionAsync<T>(Func<Task<T>> action, CancellationToken ct = default)
        {
            await using var transaction = await _context.Database.BeginTransactionAsync(ct);

            var result = await action();

            await transaction.CommitAsync(ct);

            return result; // an exception above skips Commit; disposing the transaction rolls it back
        }
    }
}