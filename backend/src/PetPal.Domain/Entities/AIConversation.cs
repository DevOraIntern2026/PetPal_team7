using PetPal.Domain.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PetPal.Domain.Entities
{
    public class AIConversation : BaseEntity
    {
        public Guid UserId { get; set; }

        public Guid PetId { get; set; }
        public Pet Pet { get; set; } = null!;

        public ICollection<AIMessage> Messages { get; set; } = new List<AIMessage>();
    }
}
