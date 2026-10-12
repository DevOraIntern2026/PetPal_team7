using PetPal.Application.DTOs.Common;
using PetPal.Application.DTOs.Doctors;

namespace PetPal.Application.Interfaces;

public interface IDoctorService
{
    // Public (authenticated) browsing: active doctors only
    Task<PagedResult<DoctorDto>> GetActiveAsync(string? specialty, int page, int pageSize, CancellationToken ct = default);
    Task<DoctorDto> GetActiveByIdAsync(Guid id, CancellationToken ct = default);
    Task<AvailabilityDto> GetAvailabilityAsync(Guid id, DateOnly date, CancellationToken ct = default);

    // Admin management
    Task<PagedResult<DoctorDto>> GetAllAsync(string? specialty, int page, int pageSize, CancellationToken ct = default);
    Task<DoctorDto> GetByIdAsync(Guid id, CancellationToken ct = default);
    Task<DoctorDto> CreateAsync(CreateDoctorRequest request, CancellationToken ct = default);
    Task<DoctorDto> UpdateAsync(Guid id, DoctorRequest request, CancellationToken ct = default);
    Task<DoctorDto> SetActiveAsync(Guid id, bool isActive, CancellationToken ct = default);
    Task<DoctorDto> SetScheduleAsync(Guid id, SetScheduleRequest request, CancellationToken ct = default);
}
