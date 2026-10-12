using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PetPal.Application.Constants;
using PetPal.Application.DTOs.Doctors;
using PetPal.Application.Interfaces;

namespace PetPal.API.Controllers
{
    [Route("api/admin/doctors")]
    [ApiController]
    [Authorize(Roles = Roles.Admin)]
    public class AdminDoctorsController : ControllerBase
    {
        private readonly IDoctorService _doctors;

        public AdminDoctorsController(IDoctorService doctors) => _doctors = doctors;

        [HttpGet]
        public async Task<IActionResult> GetAll([FromQuery] string? specialty, [FromQuery] int page = 1,
            [FromQuery] int pageSize = 20, CancellationToken ct = default)
            => Ok(await _doctors.GetAllAsync(specialty, page, pageSize, ct));

        [HttpGet("{id:guid}")]
        public async Task<IActionResult> GetById(Guid id, CancellationToken ct)
            => Ok(await _doctors.GetByIdAsync(id, ct));

        [HttpPost]
        public async Task<IActionResult> Create(CreateDoctorRequest request, CancellationToken ct)
        {
            var doctor = await _doctors.CreateAsync(request, ct);
            return CreatedAtAction(nameof(GetById), new { id = doctor.Id }, doctor);
        }

        [HttpPut("{id:guid}")]
        public async Task<IActionResult> Update(Guid id, DoctorRequest request, CancellationToken ct)
            => Ok(await _doctors.UpdateAsync(id, request, ct));

        [HttpPut("{id:guid}/schedule")]
        public async Task<IActionResult> SetSchedule(Guid id, SetScheduleRequest request, CancellationToken ct)
            => Ok(await _doctors.SetScheduleAsync(id, request, ct));

        [HttpPost("{id:guid}/activate")]
        public async Task<IActionResult> Activate(Guid id, CancellationToken ct)
            => Ok(await _doctors.SetActiveAsync(id, true, ct));

        [HttpPost("{id:guid}/deactivate")]
        public async Task<IActionResult> Deactivate(Guid id, CancellationToken ct)
            => Ok(await _doctors.SetActiveAsync(id, false, ct));
    }
}
