using PetPal.Domain.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PetPal.Domain.Entities
{
    public class PostImage : BaseEntity
    {
        public Guid PostId { get; set; }
        public Post Post { get; set; } = null!;

        public string ImageUrl { get; set; } = null!;

    }
}
