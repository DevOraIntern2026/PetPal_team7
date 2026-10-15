namespace PetPal.Domain.Enums;

public enum AdoptionStatus
{
    Available = 1,
    Adopted = 2,
    Hidden = 3,   // set by an admin (moderation)
    Removed = 4   // soft delete by the owner or an admin
}
