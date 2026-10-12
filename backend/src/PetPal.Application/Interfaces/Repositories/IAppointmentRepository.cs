using PetPal.Domain.Entities;
using PetPal.Domain.Enums;

namespace PetPal.Application.Interfaces.Repositories;

public interface IAppointmentRepository : IGenericRepository<Appointment>
{
    Task<Appointment?> GetDetailedAsync(Guid id, bool asTracking, CancellationToken ct = default);

    Task<IReadOnlyList<Appointment>> GetByUserAsync(Guid userId, CancellationToken ct = default);

    Task<(IReadOnlyList<Appointment> Items, int TotalCount)> SearchAsync(
        Guid? doctorId, DateTime? fromUtc, DateTime? toUtc, AppointmentStatus? status,
        int page, int pageSize, CancellationToken ct = default);

    /// <summary>Start times of NON-cancelled appointments for the doctor within [fromUtc, toUtc).</summary>
    Task<HashSet<DateTime>> GetBlockedStartsAsync(Guid doctorId, DateTime fromUtc, DateTime toUtc, CancellationToken ct = default);
}
