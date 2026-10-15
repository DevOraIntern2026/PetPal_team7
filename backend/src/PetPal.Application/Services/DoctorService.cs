using PetPal.Application.DTOs.Common;
using PetPal.Application.DTOs.Doctors;
using PetPal.Application.Exceptions;
using PetPal.Application.Interfaces;
using PetPal.Application.Mappings;
using PetPal.Application.Settings;
using PetPal.Domain.Entities;

namespace PetPal.Application.Services;

public class DoctorService : IDoctorService
{
    private readonly IUnitOfWork _uow;
    private readonly ISchedulingClock _clock;
    private readonly SchedulingSettings _settings;

    public DoctorService(IUnitOfWork uow, ISchedulingClock clock, SchedulingSettings settings)
    {
        _uow = uow;
        _clock = clock;
        _settings = settings;
    }

    public Task<PagedResult<DoctorDto>> GetActiveAsync(string? specialty, int page, int pageSize, CancellationToken ct = default)
        => SearchAsync(specialty, true, page, pageSize, ct);

    public Task<PagedResult<DoctorDto>> GetAllAsync(string? specialty, int page, int pageSize, CancellationToken ct = default)
        => SearchAsync(specialty, false, page, pageSize, ct);

    public async Task<DoctorDto> GetActiveByIdAsync(Guid id, CancellationToken ct = default)
    {
        var doctor = await _uow.Doctors.GetWithScheduleAsync(id, false, ct);

        if (doctor is null || !doctor.IsActive)
            throw new NotFoundException("Doctor not found.");

        return doctor.ToDto();
    }

    public async Task<DoctorDto> GetByIdAsync(Guid id, CancellationToken ct = default)
    {
        var doctor = await _uow.Doctors.GetWithScheduleAsync(id, false, ct)
            ?? throw new NotFoundException("Doctor not found.");

        return doctor.ToDto();
    }

    public async Task<DoctorDto> CreateAsync(CreateDoctorRequest request, CancellationToken ct = default)
    {
        ValidateSchedule(request.WorkingHours);

        var doctor = new Doctor();
        Apply(doctor, request);

        foreach (var w in request.WorkingHours ?? new List<WorkingHoursRequest>())
            doctor.WorkingHours.Add(new DoctorWorkingHours { DayOfWeek = w.DayOfWeek, StartTime = w.StartTime, EndTime = w.EndTime });

        await _uow.Doctors.AddAsync(doctor, ct);
        await _uow.SaveChangesAsync(ct);

        return await GetByIdAsync(doctor.Id, ct);
    }

    public async Task<DoctorDto> UpdateAsync(Guid id, DoctorRequest request, CancellationToken ct = default)
    {
        var doctor = await _uow.Doctors.GetWithScheduleAsync(id, true, ct)
            ?? throw new NotFoundException("Doctor not found.");

        Apply(doctor, request);
        await _uow.SaveChangesAsync(ct);

        return doctor.ToDto();
    }

    public async Task<DoctorDto> SetActiveAsync(Guid id, bool isActive, CancellationToken ct = default)
    {
        var doctor = await _uow.Doctors.GetWithScheduleAsync(id, true, ct)
            ?? throw new NotFoundException("Doctor not found.");

        // Existing booked appointments are kept; only NEW bookings are blocked while inactive.
        doctor.IsActive = isActive;
        await _uow.SaveChangesAsync(ct);

        return doctor.ToDto();
    }

    public async Task<DoctorDto> SetScheduleAsync(Guid id, SetScheduleRequest request, CancellationToken ct = default)
    {
        ValidateSchedule(request.WorkingHours);

        var doctor = await _uow.Doctors.GetWithScheduleAsync(id, true, ct)
            ?? throw new NotFoundException("Doctor not found.");

        // Update in place per weekday (no delete+insert on the same day, which would trip the unique index).
        var requested = request.WorkingHours.ToDictionary(w => w.DayOfWeek);

        foreach (var existing in doctor.WorkingHours.ToList())
        {
            if (requested.TryGetValue(existing.DayOfWeek, out var w))
            {
                existing.StartTime = w.StartTime;
                existing.EndTime = w.EndTime;
                requested.Remove(existing.DayOfWeek);
            }
            else
            {
                doctor.WorkingHours.Remove(existing); // required relationship + cascade => row is deleted
            }
        }

        foreach (var w in requested.Values)
            doctor.WorkingHours.Add(new DoctorWorkingHours { DayOfWeek = w.DayOfWeek, StartTime = w.StartTime, EndTime = w.EndTime });

        await _uow.SaveChangesAsync(ct);

        return doctor.ToDto();
    }

    public async Task<AvailabilityDto> GetAvailabilityAsync(Guid id, DateOnly date, CancellationToken ct = default)
    {
        var doctor = await _uow.Doctors.GetWithScheduleAsync(id, false, ct);

        if (doctor is null || !doctor.IsActive)
            throw new NotFoundException("Doctor not found.");

        var today = _clock.TodayLocal;

        if (date < today)
            throw new BadRequestException("Date is in the past.");

        if (date > today.AddDays(_settings.MaxBookingDaysAhead))
            throw new BadRequestException($"Appointments can only be booked up to {_settings.MaxBookingDaysAhead} days ahead.");

        var slots = new List<SlotDto>();
        var hours = doctor.WorkingHours.FirstOrDefault(w => w.DayOfWeek == date.DayOfWeek);

        if (hours is not null)
        {
            var (dayStartUtc, dayEndUtc) = _clock.GetLocalDayUtcBounds(date);
            var blocked = await _uow.Appointments.GetBlockedStartsAsync(doctor.Id, dayStartUtc, dayEndUtc, ct);
            var now = _clock.UtcNow;

            foreach (var s in _clock.GenerateSlots(date, hours.StartTime, hours.EndTime))
            {
                if (s.StartUtc <= now || blocked.Contains(s.StartUtc))
                    continue;

                slots.Add(new SlotDto
                {
                    StartUtc = s.StartUtc,
                    EndUtc = s.EndUtc,
                    LocalStart = s.LocalStart.ToString("HH:mm"),
                    LocalEnd = s.LocalEnd.ToString("HH:mm")
                });
            }
        }

        return new AvailabilityDto
        {
            DoctorId = doctor.Id,
            DoctorName = doctor.FullName,
            Date = date,
            TimeZoneId = _clock.TimeZoneId,
            SlotMinutes = _clock.SlotMinutes,
            Slots = slots
        };
    }

    private async Task<PagedResult<DoctorDto>> SearchAsync(string? specialty, bool activeOnly, int page, int pageSize, CancellationToken ct)
    {
        page = Math.Max(page, 1);
        pageSize = Math.Clamp(pageSize, 1, 100);

        var (items, total) = await _uow.Doctors.SearchAsync(specialty?.Trim(), activeOnly, page, pageSize, ct);

        return new PagedResult<DoctorDto>
        {
            Items = items.Select(d => d.ToDto()).ToList(),
            Page = page,
            PageSize = pageSize,
            TotalCount = total
        };
    }

    private static void Apply(Doctor d, DoctorRequest r)
    {
        d.FullName = r.FullName.Trim();
        d.Specialty = r.Specialty.Trim();
        d.Description = r.Description?.Trim();
        d.Phone = r.Phone?.Trim();
        d.Email = r.Email?.Trim();
        d.ConsultationPrice = decimal.Round(r.ConsultationPrice, 2);
    }

    private static void ValidateSchedule(IEnumerable<WorkingHoursRequest>? hours)
    {
        if (hours is null) return;

        var seen = new HashSet<DayOfWeek>();

        foreach (var w in hours)
        {
            if (!Enum.IsDefined(w.DayOfWeek))
                throw new BadRequestException("Invalid day of week.");

            if (!seen.Add(w.DayOfWeek))
                throw new BadRequestException($"{w.DayOfWeek} is defined more than once. Only one working interval per day is supported.");

            if (w.StartTime >= w.EndTime)
                throw new BadRequestException($"{w.DayOfWeek}: end time must be after start time.");

            if (!OnHalfHour(w.StartTime) || !OnHalfHour(w.EndTime))
                throw new BadRequestException($"{w.DayOfWeek}: start and end times must be on a 30-minute boundary (e.g. 09:00 or 09:30).");
        }
    }

    private static bool OnHalfHour(TimeOnly t) => t.Minute % 30 == 0 && t.Second == 0 && t.Millisecond == 0;
}
