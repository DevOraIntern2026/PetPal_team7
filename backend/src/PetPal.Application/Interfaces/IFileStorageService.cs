using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PetPal.Application.Interfaces
{
    public interface IFileStorageService
    {
        Task<string> SaveImageAsync(Stream content, long length, string folder, CancellationToken ct = default);
    }
}
