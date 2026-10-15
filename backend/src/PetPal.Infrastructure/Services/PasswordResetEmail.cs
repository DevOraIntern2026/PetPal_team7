namespace PetPal.Infrastructure.Services
{
    internal static class PasswordResetEmail
    {
        public static (string Subject, string Html, string Text) Build(string code, int minutes)
        {
            var subject = "رمز إعادة تعيين كلمة المرور | PetPal password reset code";

            var text =
                $"رمز إعادة تعيين كلمة المرور في PetPal: {code}\n" +
                $"ينتهي هذا الرمز خلال {minutes} دقيقة. إذا لم تطلب ذلك، يمكنك تجاهل هذه الرسالة.\n\n" +
                $"Your PetPal password reset code: {code}\n" +
                $"It expires in {minutes} minutes. If you didn't request this, you can ignore this email.";

            var html =
                "<div style=\"font-family:Arial,sans-serif;max-width:480px;margin:0 auto;padding:24px;\">" +
                "<h2 style=\"color:#2fa6c4;margin:0 0 16px;\">PetPal</h2>" +
                "<div dir=\"rtl\" style=\"text-align:right;margin-bottom:8px;\">رمز إعادة تعيين كلمة المرور الخاص بك:</div>" +
                "<div style=\"margin-bottom:8px;\">Your password reset code:</div>" +
                $"<div style=\"font-size:34px;font-weight:bold;letter-spacing:8px;text-align:center;padding:16px;background:#f3f9fb;border-radius:12px;margin:16px 0;\">{code}</div>" +
                $"<div dir=\"rtl\" style=\"text-align:right;color:#666;font-size:13px;\">ينتهي هذا الرمز خلال {minutes} دقيقة. إذا لم تطلب ذلك، يمكنك تجاهل هذه الرسالة.</div>" +
                $"<div style=\"color:#666;font-size:13px;margin-top:8px;\">It expires in {minutes} minutes. If you didn't request this, you can ignore this email.</div>" +
                "</div>";

            return (subject, html, text);
        }
    }
}