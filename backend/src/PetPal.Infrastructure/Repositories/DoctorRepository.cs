using Microsoft.EntityFrameworkCore;
using PetPal.Application.Interfaces.Repositories;
using PetPal.Domain.Entities;
using PetPal.Infrastructure.Data;

namespace PetPal.Infrastructure.Repositories;

public class DoctorRepository : GenericRepository<Doctor>, IDoctorRepository
{
    public DoctorRepository(PetPalDbContext context) : base(context)
    {
    }

    public async Task<(IReadOnlyList<Doctor> Items, int TotalCount)> SearchAsync(
        string? specialty, bool activeOnly, int page, int pageSize, CancellationToken ct = default)
    {
        IQueryable<Doctor> query = _dbContext.Doctors.AsNoTracking();

        if (activeOnly)
            query = query.Where(d => d.IsActive);

        if (!string.IsNullOrWhiteSpace(specialty))
            query = query.Where(d => d.Specialty == specialty);

        var total = await query.CountAsync(ct);

        var items = await query
            .Include(d => d.WorkingHours)
            .OrderBy(d => d.FullName).ThenBy(d => d.Id)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync(ct);

        return (items, total);
    }

    public async Task<Doctor?> GetWithScheduleAsync(Guid id, bool asTracking, CancellationToken ct = default)
    {
        IQueryable<Doctor> query = _dbContext.Doctors.Include(d => d.WorkingHours);

        if (!asTracking)
            query = query.AsNoTracking();

        return await query.FirstOrDefaultAsync(d => d.Id == id, ct);
    }
}
