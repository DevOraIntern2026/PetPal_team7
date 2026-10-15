using PetPal.Domain.Entities;

namespace PetPal.Application.Interfaces.Repositories;

public interface IDoctorRepository : IGenericRepository<Doctor>
{
    Task<(IReadOnlyList<Doctor> Items, int TotalCount)> SearchAsync(
        string? specialty, bool activeOnly, int page, int pageSize, CancellationToken ct = default);

    Task<Doctor?> GetWithScheduleAsync(Guid id, bool asTracking, CancellationToken ct = default);
}
