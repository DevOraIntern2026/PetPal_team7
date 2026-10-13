using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PetPal.Application.Settings
{
    public class GoogleAuthSettings
    {
        public const string SectionName = "Google";

        // Web client ID first; Android/iOS IDs too if the idToken can carry them.
        public string[] ClientIds { get; set; } = [];
    }

    public class FacebookAuthSettings
    {
        public const string SectionName = "Facebook";

        public string AppId { get; set; } = "";

        public string AppSecret { get; set; } = "";
    }
}
