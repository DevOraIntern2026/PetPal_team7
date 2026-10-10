using PetPal.Domain.Common;
using PetPal.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PetPal.Domain.Entities
{
    public class AIMessage : BaseEntity
    {
        public Guid ConversationId { get; set; }
        public AIConversation Conversation { get; set; } = null!;

        public AIMessageRole Role { get; set; }
        public string Content { get; set; } = null!;
    }
}
