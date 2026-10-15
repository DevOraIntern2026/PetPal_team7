using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using PetPal.Application.DTOs.Vaccinations;
using PetPal.Application.Interfaces;

namespace PetPal.API.Controllers
{
    [Route("api/pets/{petId:guid}/vaccinations")]
    [ApiController]
    [Authorize]
    public class VaccinationsController : ControllerBase
    {
        private readonly IVaccinationService _service;

        public VaccinationsController(IVaccinationService service) => _service = service;

        [HttpGet]
        public async Task<ActionResult<VaccinationLogDto>> GetLog(Guid petId, CancellationToken ct)
            => Ok(await _service.GetLogAsync(petId, ct));

        [HttpGet("{id:guid}")]
        public async Task<ActionResult<VaccinationDto>> GetById(Guid petId, Guid id, CancellationToken ct)
            => Ok(await _service.GetByIdAsync(petId, id, ct));

        [HttpPost]
        public async Task<ActionResult<VaccinationDto>> Create(Guid petId, VaccinationRequest request, CancellationToken ct)
        {
            var item = await _service.CreateAsync(petId, request, ct);
            return CreatedAtAction(nameof(GetById), new { petId, id = item.Id }, item);
        }

        [HttpPut("{id:guid}")]
        public async Task<ActionResult<VaccinationDto>> Update(Guid petId, Guid id, VaccinationRequest request, CancellationToken ct)
            => Ok(await _service.UpdateAsync(petId, id, request, ct));

        [HttpDelete("{id:guid}")]
        public async Task<IActionResult> Delete(Guid petId, Guid id, CancellationToken ct)
        {
            await _service.DeleteAsync(petId, id, ct);
            return NoContent();
        }
    }
}
