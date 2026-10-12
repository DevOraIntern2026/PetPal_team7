using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PetPal.Application.Constants;
using PetPal.Application.DTOs.Adoption;
using PetPal.Application.Interfaces;
using PetPal.Domain.Enums;

namespace PetPal.API.Controllers
{
    [Route("api/admin/adoption")]
    [ApiController]
    [Authorize(Roles = Roles.Admin)]
    public class AdminAdoptionController : ControllerBase
    {
        private readonly IAdoptionService _adoption;

        public AdminAdoptionController(IAdoptionService adoption) => _adoption = adoption;

        [HttpGet]
        public async Task<IActionResult> Search([FromQuery] AdoptionStatus? status, [FromQuery] Guid? ownerId,
            [FromQuery] int page = 1, [FromQuery] int pageSize = 20, CancellationToken ct = default)
            => Ok(await _adoption.AdminSearchAsync(status, ownerId, page, pageSize, ct));

        [HttpPut("{id:guid}/status")]
        public async Task<IActionResult> SetStatus(Guid id, UpdateAdoptionStatusRequest request, CancellationToken ct)
            => Ok(await _adoption.AdminSetStatusAsync(id, request.Status, ct));

        [HttpDelete("{id:guid}")]
        public async Task<IActionResult> Remove(Guid id, CancellationToken ct)
        {
            await _adoption.AdminSetStatusAsync(id, AdoptionStatus.Removed, ct);
            return NoContent();
        }
    }
}
