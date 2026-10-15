using PetPal.Application.DTOs.Appointments;
using PetPal.Application.DTOs.Common;
using PetPal.Domain.Enums;

namespace PetPal.Application.Interfaces;

public interface IAppointmentService
{
    Task<AppointmentDto> CreateAsync(CreateAppointmentRequest request, CancellationToken ct = default);
    Task<IReadOnlyList<AppointmentDto>> GetMyAsync(CancellationToken ct = default);
    Task<AppointmentDto> GetByIdAsync(Guid id, CancellationToken ct = default);
    Task CancelAsync(Guid id, CancellationToken ct = default);

    // Admin
    Task<PagedResult<AppointmentDto>> AdminSearchAsync(Guid? doctorId, DateOnly? date, AppointmentStatus? status,
        int page, int pageSize, CancellationToken ct = default);
    Task<AppointmentDto> AdminUpdateStatusAsync(Guid id, AppointmentStatus status, CancellationToken ct = default);
}
