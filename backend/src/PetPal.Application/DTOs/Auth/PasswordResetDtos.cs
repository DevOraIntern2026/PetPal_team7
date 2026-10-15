using System.ComponentModel.DataAnnotations;

namespace PetPal.Application.DTOs.Auth;

public class ForgotPasswordRequest
{
    [Required, EmailAddress, MaxLength(256)]
    public string Email { get; set; } = null!;
}

public class ResetPasswordRequest
{
    [Required, EmailAddress, MaxLength(256)]
    public string Email { get; set; } = null!;

    [Required, RegularExpression(@"^\d{6}$", ErrorMessage = "Code must be 6 digits.")]
    public string Code { get; set; } = null!;

    [Required, MinLength(8), MaxLength(100)]
    public string NewPassword { get; set; } = null!;
}