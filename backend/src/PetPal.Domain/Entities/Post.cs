using PetPal.Domain.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PetPal.Domain.Entities
{
    public class Post : BaseEntity
    {
        public Guid UserId { get; set; }

        public string Content { get; set; } = null!;

        public ICollection<PostImage> Images { get; set; } = new List<PostImage>();
        public ICollection<Comment> Comments { get; set; } = new List<Comment>();
        public ICollection<PostLike> Likes { get; set; } = new List<PostLike>();

    }
}
