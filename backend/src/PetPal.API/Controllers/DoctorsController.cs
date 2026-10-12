using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PetPal.Application.Exceptions;
using PetPal.Application.Interfaces;

namespace PetPal.API.Controllers
{
    /// <summary>Browsing for authenticated users: active doctors only.</summary>
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class DoctorsController : ControllerBase
    {
        private readonly IDoctorService _doctors;

        public DoctorsController(IDoctorService doctors) => _doctors = doctors;

        [HttpGet]
        public async Task<IActionResult> GetAll([FromQuery] string? specialty, [FromQuery] int page = 1,
            [FromQuery] int pageSize = 20, CancellationToken ct = default)
            => Ok(await _doctors.GetActiveAsync(specialty, page, pageSize, ct));

        [HttpGet("{id:guid}")]
        public async Task<IActionResult> GetById(Guid id, CancellationToken ct)
            => Ok(await _doctors.GetActiveByIdAsync(id, ct));

        [HttpGet("{id:guid}/availability")]
        public async Task<IActionResult> GetAvailability(Guid id, [FromQuery] DateOnly? date, CancellationToken ct)
        {
            if (date is null)
                throw new BadRequestException("Query parameter 'date' (yyyy-MM-dd) is required.");

            return Ok(await _doctors.GetAvailabilityAsync(id, date.Value, ct));
        }
    }
}
