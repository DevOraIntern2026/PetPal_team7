using Microsoft.EntityFrameworkCore;
using PetPal.Application.Interfaces.Repositories;
using PetPal.Domain.Entities;
using PetPal.Domain.Enums;
using PetPal.Infrastructure.Data;

namespace PetPal.Infrastructure.Repositories;

public class AppointmentRepository : GenericRepository<Appointment>, IAppointmentRepository
{
    public AppointmentRepository(PetPalDbContext context) : base(context)
    {
    }

    public async Task<Appointment?> GetDetailedAsync(Guid id, bool asTracking, CancellationToken ct = default)
    {
        IQueryable<Appointment> query = _dbContext.Appointments.Include(a => a.Doctor);

        if (!asTracking)
            query = query.AsNoTracking();

        return await query.FirstOrDefaultAsync(a => a.Id == id, ct);
    }

    public async Task<IReadOnlyList<Appointment>> GetByUserAsync(Guid userId, CancellationToken ct = default)
        => await _dbContext.Appointments.AsNoTracking()
            .Include(a => a.Doctor)
            .Where(a => a.UserId == userId)
            .OrderByDescending(a => a.StartUtc)
            .ToListAsync(ct);

    public async Task<(IReadOnlyList<Appointment> Items, int TotalCount)> SearchAsync(
        Guid? doctorId, DateTime? fromUtc, DateTime? toUtc, AppointmentStatus? status,
        int page, int pageSize, CancellationToken ct = default)
    {
        IQueryable<Appointment> query = _dbContext.Appointments.AsNoTracking();

        if (doctorId.HasValue) query = query.Where(a => a.DoctorId == doctorId.Value);
        if (fromUtc.HasValue) query = query.Where(a => a.StartUtc >= fromUtc.Value);
        if (toUtc.HasValue) query = query.Where(a => a.StartUtc < toUtc.Value);
        if (status.HasValue) query = query.Where(a => a.Status == status.Value);

        var total = await query.CountAsync(ct);

        var items = await query
            .Include(a => a.Doctor)
            .OrderByDescending(a => a.StartUtc).ThenBy(a => a.Id)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync(ct);

        return (items, total);
    }

    public async Task<HashSet<DateTime>> GetBlockedStartsAsync(Guid doctorId, DateTime fromUtc, DateTime toUtc, CancellationToken ct = default)
    {
        var starts = await _dbContext.Appointments.AsNoTracking()
            .Where(a => a.DoctorId == doctorId
                        && a.Status != AppointmentStatus.Cancelled
                        && a.StartUtc >= fromUtc && a.StartUtc < toUtc)
            .Select(a => a.StartUtc)
            .ToListAsync(ct);

        return starts.Select(s => DateTime.SpecifyKind(s, DateTimeKind.Utc)).ToHashSet();
    }
}
