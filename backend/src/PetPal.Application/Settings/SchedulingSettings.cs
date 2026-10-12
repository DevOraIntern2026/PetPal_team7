namespace PetPal.Application.Settings;

public class SchedulingSettings
{
    public const string SectionName = "Scheduling";

    /// <summary>Clinic time zone id, e.g. "Africa/Cairo". Validated at startup.</summary>
    public string TimeZoneId { get; set; } = null!;

    /// <summary>Users cannot cancel an appointment that starts sooner than this.</summary>
    public int MinCancellationHours { get; set; } = 2;

    /// <summary>How far ahead appointments can be booked / availability queried.</summary>
    public int MaxBookingDaysAhead { get; set; } = 60;
}
