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

        private IPetRepository? _pets;
        private IBreedRepository? _breeds;
        private IMedicalHistoryRepository? _medicalHistories;

        private IPostRepository? _posts;

        private IFollowRepository? _follows;
        public IFollowRepository Follows => _follows ??= new FollowRepository(_context);

        private INotificationRepository? _notifications;
        public INotificationRepository Notifications => _notifications ??= new NotificationRepository(_context);

        public UnitOfWork(PetPalDbContext context) => _context = context;

        public IPetRepository Pets => _pets ??= new PetRepository(_context);

        public IBreedRepository Breeds => _breeds ??= new BreedRepository(_context);

        public IMedicalHistoryRepository MedicalHistories => _medicalHistories ??= new MedicalHistoryRepository(_context);

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
    }
}