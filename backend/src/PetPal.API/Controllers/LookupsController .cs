using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using PetPal.Application.Interfaces;

namespace PetPal.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LookupsController : ControllerBase
    {
        private readonly ILookupService _lookupService;

        public LookupsController(ILookupService lookups) => _lookupService = lookups;

        [HttpGet("pet-types")]
        public async Task<IActionResult> GetPetTypes(CancellationToken ct)
            => Ok(await _lookupService.GetPetTypesAsync(ct));

        [HttpGet("pet-types/{petTypeId:guid}/breeds")]
        public async Task<IActionResult> GetBreeds(Guid petTypeId, CancellationToken ct)
            => Ok(await _lookupService.GetBreedsAsync(petTypeId, ct));
    }
}
