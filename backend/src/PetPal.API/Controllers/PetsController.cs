using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using PetPal.Application.DTOs.Pets;
using PetPal.Application.Interfaces;

namespace PetPal.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PetsController : ControllerBase
    {
        private readonly IPetService _petService;

        public PetsController(IPetService pets) => _petService = pets;

        [HttpGet]
        public async Task<IActionResult> GetMyPets(CancellationToken ct)
            => Ok(await _petService.GetMyPetsAsync(ct));

        [HttpGet("{id:guid}")]
        public async Task<IActionResult> GetById(Guid id, CancellationToken ct)
            => Ok(await _petService.GetByIdAsync(id, ct));

        [HttpPost]
        public async Task<IActionResult> Create(PetRequest request, CancellationToken ct)
        {
            var pet = await _petService.CreateAsync(request, ct);
            return CreatedAtAction(nameof(GetById), new { id = pet.Id }, pet);
        }

        [HttpPut("{id:guid}")]
        public async Task<IActionResult> Update(Guid id, PetRequest request, CancellationToken ct)
            => Ok(await _petService.UpdateAsync(id, request, ct));

        [HttpDelete("{id:guid}")]
        public async Task<IActionResult> Delete(Guid id, CancellationToken ct)
        {
            await _petService.DeleteAsync(id, ct);
            return NoContent();
        }
    }
}
