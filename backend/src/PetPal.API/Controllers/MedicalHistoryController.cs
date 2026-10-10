using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using PetPal.Application.DTOs.MedicalHistory;
using PetPal.Application.Interfaces;

namespace PetPal.API.Controllers
{
    [Route("api/pets/{petId:guid}/medical-history")]
    [ApiController]
    public class MedicalHistoryController : ControllerBase
    {
        private readonly IMedicalHistoryService _service;

        public MedicalHistoryController(IMedicalHistoryService service) => _service = service;

        [HttpGet]
        public async Task<IActionResult> GetAll(Guid petId, CancellationToken ct)
            => Ok(await _service.GetAllAsync(petId, ct));

        [HttpGet("{id:guid}")]
        public async Task<IActionResult> GetById(Guid petId, Guid id, CancellationToken ct)
            => Ok(await _service.GetByIdAsync(petId, id, ct));

        [HttpPost]
        public async Task<IActionResult> Create(Guid petId, MedicalHistoryRequest request, CancellationToken ct)
        {
            var item = await _service.CreateAsync(petId, request, ct);
            return CreatedAtAction(nameof(GetById), new { petId, id = item.Id }, item);
        }

        [HttpPut("{id:guid}")]
        public async Task<IActionResult> Update(Guid petId, Guid id, MedicalHistoryRequest request, CancellationToken ct)
            => Ok(await _service.UpdateAsync(petId, id, request, ct));

        [HttpDelete("{id:guid}")]
        public async Task<IActionResult> Delete(Guid petId, Guid id, CancellationToken ct)
        {
            await _service.DeleteAsync(petId, id, ct);
            return NoContent();
        }
    }
}
