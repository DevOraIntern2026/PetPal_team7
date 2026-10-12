using PetPal.Application.DTOs.Appointments;
using PetPal.Application.DTOs.Common;
using PetPal.Application.Exceptions;
using PetPal.Application.Interfaces;
using PetPal.Application.Mappings;
using PetPal.Application.Settings;
using PetPal.Domain.Entities;
using PetPal.Domain.Enums;

namespace PetPal.Application.Services;

public class AppointmentService : IAppointmentService
{
    private readonly IUnitOfWork _uow;
    private readonly ICurrentUserService _currentUser;
    private readonly ISchedulingClock _clock;
    private readonly SchedulingSettings _settings;

    public AppointmentService(IUnitOfWork uow, ICurrentUserService currentUser, ISchedulingClock clock, SchedulingSettings settings)
    {
        _uow = uow;
        _currentUser = currentUser;
        _clock = clock;
        _settings = settings;
    }

    private Guid UserId => _currentUser.UserId
        ?? throw new UnauthorizedAccessException("User is not authenticated.");

    public async Task<AppointmentDto> CreateAsync(CreateAppointmentRequest request, CancellationToken ct = default)
    {
        var userId = UserId; // identity comes from the token, never from the request body

        var start = NormalizeUtc(request.StartUtc);

        if (!_clock.IsOnSlotGrid(start))
            throw new BadRequestException("Appointment start must be on a 30-minute boundary (:00 or :30).");

        var now = _clock.UtcNow;

        if (start <= now)
            throw new BadRequestException("Appointments cannot be booked in the past.");

        if (start > now.AddDays(_settings.MaxBookingDaysAhead))
            throw new BadRequestException($"Appointments can only be booked up to {_settings.MaxBookingDaysAhead} days ahead.");

        var doctor = await _uow.Doctors.GetWithScheduleAsync(request.DoctorId, false, ct)
            ?? throw new NotFoundException("Doctor not found.");

        if (!doctor.IsActive)
            throw new BadRequestException("This doctor is not accepting new appointments.");

        // The requested instant must be one of the slots produced by the centralized clock for that
        // local date: inside working hours, not in a DST gap/overlap.
        var localDate = DateOnly.FromDateTime(_clock.ToLocal(start));
        var hours = doctor.WorkingHours.FirstOrDefault(w => w.DayOfWeek == localDate.DayOfWeek);

        var isValidSlot = hours is not null &&
            _clock.GenerateSlots(localDate, hours.StartTime, hours.EndTime).Any(s => s.StartUtc == start);

        if (!isValidSlot)
            throw new BadRequestException("The requested time is outside the doctor's working hours.");

        // Friendly pre-check. NOT the safety mechanism: the filtered unique index is.
        var blocked = await _uow.Appointments.GetBlockedStartsAsync(doctor.Id, start, start.AddMinutes(_clock.SlotMinutes), ct);

        if (blocked.Contains(start))
            throw new ConflictException("This time slot is no longer available.");

        var appointment = new Appointment
        {
            UserId = userId,
            DoctorId = doctor.Id,
            StartUtc = start,
            EndUtc = start.AddMinutes(_clock.SlotMinutes),
            Status = AppointmentStatus.Booked,
            ConsultationPrice = doctor.ConsultationPrice,
            Notes = request.Notes?.Trim()
        };

        await _uow.Appointments.AddAsync(appointment, ct);

        // Two concurrent requests can both pass the pre-check; the unique index lets exactly one insert win.
        if (!await _uow.TrySaveChangesAsync(ct))
            throw new ConflictException("This time slot has just been booked. Please choose another one.");

        var saved = await _uow.Appointments.GetDetailedAsync(appointment.Id, false, ct)
            ?? throw new NotFoundException("Appointment not found.");

        return saved.ToDto(_clock);
    }

    public async Task<IReadOnlyList<AppointmentDto>> GetMyAsync(CancellationToken ct = default)
    {
        var items = await _uow.Appointments.GetByUserAsync(UserId, ct);

        return items.Select(a => a.ToDto(_clock)).ToList();
    }

    public async Task<AppointmentDto> GetByIdAsync(Guid id, CancellationToken ct = default)
    {
        var appointment = await _uow.Appointments.GetDetailedAsync(id, false, ct);

        // 404 (not 403) for other users' appointments so ids cannot be probed.
        if (appointment is null || (!_currentUser.IsAdmin && appointment.UserId != UserId))
            throw new NotFoundException("Appointment not found.");

        return appointment.ToDto(_clock);
    }

    public async Task CancelAsync(Guid id, CancellationToken ct = default)
    {
        var userId = UserId;
        var appointment = await _uow.Appointments.GetDetailedAsync(id, true, ct);
        var isAdmin = _currentUser.IsAdmin;

        if (appointment is null || (!isAdmin && appointment.UserId != userId))
            throw new NotFoundException("Appointment not found.");

        if (appointment.Status != AppointmentStatus.Booked)
            throw new BadRequestException($"A {appointment.Status.ToString().ToLowerInvariant()} appointment cannot be cancelled.");

        if (!isAdmin && appointment.StartUtc - _clock.UtcNow < TimeSpan.FromHours(_settings.MinCancellationHours))
            throw new BadRequestException($"Appointments can only be cancelled at least {_settings.MinCancellationHours} hour(s) before they start.");

        Cancel(appointment);
        await _uow.SaveChangesAsync(ct);
    }

    public async Task<PagedResult<AppointmentDto>> AdminSearchAsync(Guid? doctorId, DateOnly? date, AppointmentStatus? status,
        int page, int pageSize, CancellationToken ct = default)
    {
        page = Math.Max(page, 1);
        pageSize = Math.Clamp(pageSize, 1, 100);

        DateTime? fromUtc = null, toUtc = null;

        if (date.HasValue)
        {
            var bounds = _clock.GetLocalDayUtcBounds(date.Value);
            fromUtc = bounds.StartUtc;
            toUtc = bounds.EndUtc;
        }

        var (items, total) = await _uow.Appointments.SearchAsync(doctorId, fromUtc, toUtc, status, page, pageSize, ct);

        return new PagedResult<AppointmentDto>
        {
            Items = items.Select(a => a.ToDto(_clock)).ToList(),
            Page = page,
            PageSize = pageSize,
            TotalCount = total
        };
    }

    public async Task<AppointmentDto> AdminUpdateStatusAsync(Guid id, AppointmentStatus status, CancellationToken ct = default)
    {
        var appointment = await _uow.Appointments.GetDetailedAsync(id, true, ct)
            ?? throw new NotFoundException("Appointment not found.");

        if (appointment.Status != AppointmentStatus.Booked)
            throw new BadRequestException($"A {appointment.Status.ToString().ToLowerInvariant()} appointment cannot change status.");

        switch (status)
        {
            case AppointmentStatus.Cancelled:
                Cancel(appointment);
                break;

            case AppointmentStatus.Completed:
                if (appointment.StartUtc > _clock.UtcNow)
                    throw new BadRequestException("An appointment in the future cannot be marked as completed.");

                appointment.Status = AppointmentStatus.Completed;
                break;

            default:
                throw new BadRequestException("Only Cancelled or Completed can be set.");
        }

        await _uow.SaveChangesAsync(ct);

        return appointment.ToDto(_clock);
    }

    private void Cancel(Appointment a)
    {
        a.Status = AppointmentStatus.Cancelled; // leaves the unique index, so the slot becomes bookable again
        a.CancelledAtUtc = _clock.UtcNow;
    }

    private static DateTime NormalizeUtc(DateTime value) => value.Kind switch
    {
        DateTimeKind.Utc => value,
        DateTimeKind.Local => value.ToUniversalTime(),
        _ => throw new BadRequestException("StartUtc must be a UTC timestamp ending with 'Z', e.g. 2026-10-20T09:00:00Z.")
    };
}
