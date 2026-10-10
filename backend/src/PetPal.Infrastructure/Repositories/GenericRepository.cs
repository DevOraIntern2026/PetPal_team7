using Microsoft.EntityFrameworkCore;
using PetPal.Application.Interfaces.Repositories;
using PetPal.Domain.Common;
using PetPal.Infrastructure.Data;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PetPal.Infrastructure.Repositories
{
    public class GenericRepository<TEntity> : IGenericRepository<TEntity> where TEntity : BaseEntity
    {
        protected readonly PetPalDbContext _dbContext;
        protected readonly DbSet<TEntity> DbSet;

        public GenericRepository(PetPalDbContext context)
        {
            _dbContext = context;
            DbSet = context.Set<TEntity>();
        }

        public virtual async Task<TEntity?> GetByIdAsync(Guid id, CancellationToken ct = default)
            => await DbSet.FindAsync(new object[] { id }, ct);

        public virtual async Task<IReadOnlyList<TEntity>> GetAllAsync(CancellationToken ct = default)
            => await DbSet.AsNoTracking().ToListAsync(ct);

        public virtual async Task AddAsync(TEntity entity, CancellationToken ct = default)
            => await DbSet.AddAsync(entity, ct);

        public virtual void Update(TEntity entity) => DbSet.Update(entity);

        public virtual void Delete(TEntity entity) => DbSet.Remove(entity);
    }
}
