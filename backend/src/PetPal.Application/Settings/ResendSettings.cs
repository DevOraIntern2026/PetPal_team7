using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PetPal.Application.Settings
{
    public class ResendSettings
    {
        public const string SectionName = "Resend";

        public string ApiKey { get; set; } = "";

        public string From { get; set; } = "PetPal <onboarding@resend.dev>";
    }
}
