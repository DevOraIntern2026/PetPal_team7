using PetPal.Application.Interfaces;
using PetPal.Application.Settings;

namespace PetPal.Application.Services;

public class SchedulingClock : ISchedulingClock
{
    private static readonly TimeSpan Grid = TimeSpan.FromMinutes(30);
    private readonly TimeZoneInfo _tz;

    public SchedulingClock(SchedulingSettings settings)
    {
        if (string.IsNullOrWhiteSpace(settings.TimeZoneId))
            throw new InvalidOperationException(
                "Scheduling:TimeZoneId is not configured. Set it to a valid time zone id, e.g. 'Africa/Cairo'.");

        if (settings.MinCancellationHours < 0)
            throw new InvalidOperationException("Scheduling:MinCancellationHours cannot be negative.");

        if (settings.MaxBookingDaysAhead is < 1 or > 365)
            throw new InvalidOperationException("Scheduling:MaxBookingDaysAhead must be between 1 and 365.");

        try
        {
            _tz = TimeZoneInfo.FindSystemTimeZoneById(settings.TimeZoneId);
        }
        catch (Exception ex) when (ex is TimeZoneNotFoundException or InvalidTimeZoneException)
        {
            throw new InvalidOperationException(
                $"Scheduling:TimeZoneId '{settings.TimeZoneId}' could not be resolved on this machine. " +
                "Use a valid IANA id (e.g. 'Africa/Cairo') or the Windows id ('Egypt Standard Time'). " +
                "On Linux containers make sure tzdata is installed.", ex);
        }

        // The double-booking guarantee relies on UTC and clinic-local 30-minute grids coinciding.
        // That holds only when every UTC offset of the zone is a multiple of 30 minutes.
        if (_tz.BaseUtcOffset.Ticks % Grid.Ticks != 0 ||
            _tz.GetAdjustmentRules().Any(r => r.DaylightDelta.Ticks % Grid.Ticks != 0 ||
                                              r.BaseUtcOffsetDelta.Ticks % Grid.Ticks != 0))
        {
            throw new InvalidOperationException(
                $"Scheduling:TimeZoneId '{settings.TimeZoneId}' has UTC offsets that are not multiples of 30 minutes, " +
                "which is not supported by the 30-minute slot grid.");
        }
    }

    public string TimeZoneId => _tz.Id;
    public int SlotMinutes => 30;
    public DateTime UtcNow => DateTime.UtcNow;
    public DateOnly TodayLocal => DateOnly.FromDateTime(ToLocal(UtcNow));

    public DateTime ToLocal(DateTime utc)
        => TimeZoneInfo.ConvertTimeFromUtc(DateTime.SpecifyKind(utc, DateTimeKind.Utc), _tz);

    public bool IsOnSlotGrid(DateTime utc)
        => utc.Ticks % TimeSpan.TicksPerSecond == 0 && utc.Second == 0 && utc.Minute % SlotMinutes == 0;

    public (DateTime StartUtc, DateTime EndUtc) GetLocalDayUtcBounds(DateOnly localDate)
        => (StartOfLocalDayUtc(localDate), StartOfLocalDayUtc(localDate.AddDays(1)));

    public IReadOnlyList<TimeSlot> GenerateSlots(DateOnly localDate, TimeOnly workStart, TimeOnly workEnd)
    {
        var slots = new List<TimeSlot>();
        var end = workEnd.ToTimeSpan();

        for (var t = workStart.ToTimeSpan(); t + Grid <= end; t += Grid)
        {
            var localStart = TimeOnly.FromTimeSpan(t);

            if (!TryLocalToUtc(localDate, localStart, out var startUtc))
                continue; // nonexistent (DST gap) or ambiguous (DST overlap) local time

            slots.Add(new TimeSlot(startUtc, startUtc.Add(Grid), localStart, TimeOnly.FromTimeSpan(t + Grid)));
        }

        return slots;
    }

    private bool TryLocalToUtc(DateOnly date, TimeOnly time, out DateTime utc)
    {
        var local = date.ToDateTime(time, DateTimeKind.Unspecified);

        if (_tz.IsInvalidTime(local) || _tz.IsAmbiguousTime(local))
        {
            utc = default;
            return false;
        }

        utc = DateTime.SpecifyKind(TimeZoneInfo.ConvertTimeToUtc(local, _tz), DateTimeKind.Utc);
        return true;
    }

    private DateTime StartOfLocalDayUtc(DateOnly date)
    {
        var local = date.ToDateTime(TimeOnly.MinValue, DateTimeKind.Unspecified);

        // Some zones switch to DST at midnight, so 00:00 may not exist: use the first valid instant.
        while (_tz.IsInvalidTime(local))
            local = local.AddMinutes(30);

        if (_tz.IsAmbiguousTime(local))
        {
            var largestOffset = _tz.GetAmbiguousTimeOffsets(local).Max();
            return DateTime.SpecifyKind(local - largestOffset, DateTimeKind.Utc); // earlier instant
        }

        return DateTime.SpecifyKind(TimeZoneInfo.ConvertTimeToUtc(local, _tz), DateTimeKind.Utc);
    }
}
