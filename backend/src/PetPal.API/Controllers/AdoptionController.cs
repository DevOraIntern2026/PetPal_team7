using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PetPal.Application.DTOs.Adoption;
using PetPal.Application.Interfaces;

namespace PetPal.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class AdoptionController : ControllerBase
    {
        private readonly IAdoptionService _adoption;

        public AdoptionController(IAdoptionService adoption) => _adoption = adoption;

        [HttpGet]
        public async Task<IActionResult> Search([FromQuery] AdoptionQuery query, CancellationToken ct)
            => Ok(await _adoption.SearchAvailableAsync(query, ct));

        [HttpGet("my")]
        public async Task<IActionResult> GetMine([FromQuery] int page = 1, [FromQuery] int pageSize = 20, CancellationToken ct = default)
            => Ok(await _adoption.GetMineAsync(page, pageSize, ct));

        [HttpGet("{id:guid}")]
        public async Task<IActionResult> GetById(Guid id, CancellationToken ct)
            => Ok(await _adoption.GetByIdAsync(id, ct));

        [HttpPost]
        public async Task<IActionResult> Create(AdoptionListingRequest request, CancellationToken ct)
        {
            var listing = await _adoption.CreateAsync(request, ct);
            return CreatedAtAction(nameof(GetById), new { id = listing.Id }, listing);
        }

        [HttpPut("{id:guid}")]
        public async Task<IActionResult> Update(Guid id, AdoptionListingRequest request, CancellationToken ct)
            => Ok(await _adoption.UpdateAsync(id, request, ct));

        [HttpDelete("{id:guid}")]
        public async Task<IActionResult> Delete(Guid id, CancellationToken ct)
        {
            await _adoption.DeleteAsync(id, ct);
            return NoContent();
        }
    }
}
