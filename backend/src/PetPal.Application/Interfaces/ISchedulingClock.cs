namespace PetPal.Application.Interfaces;

public readonly record struct TimeSlot(DateTime StartUtc, DateTime EndUtc, TimeOnly LocalStart, TimeOnly LocalEnd);

/// <summary>
/// The single place that converts between clinic-local wall-clock time and UTC.
/// </summary>
public interface ISchedulingClock
{
    string TimeZoneId { get; }
    int SlotMinutes { get; }
    DateTime UtcNow { get; }
    DateOnly TodayLocal { get; }

    DateTime ToLocal(DateTime utc);

    /// <summary>True when the instant is on the global 30-minute grid with no seconds/fraction.</summary>
    bool IsOnSlotGrid(DateTime utc);

    /// <summary>UTC [start, end) of the given clinic-local calendar day (DST-safe).</summary>
    (DateTime StartUtc, DateTime EndUtc) GetLocalDayUtcBounds(DateOnly localDate);

    /// <summary>30-minute slots in [workStart, workEnd). Nonexistent/ambiguous local times are skipped.</summary>
    IReadOnlyList<TimeSlot> GenerateSlots(DateOnly localDate, TimeOnly workStart, TimeOnly workEnd);
}
