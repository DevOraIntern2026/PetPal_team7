using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PetPal.Application.DTOs.Appointments;
using PetPal.Application.Interfaces;

namespace PetPal.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class AppointmentsController : ControllerBase
    {
        private readonly IAppointmentService _appointments;

        public AppointmentsController(IAppointmentService appointments) => _appointments = appointments;

        [HttpPost]
        public async Task<IActionResult> Create(CreateAppointmentRequest request, CancellationToken ct)
        {
            var appointment = await _appointments.CreateAsync(request, ct);
            return CreatedAtAction(nameof(GetById), new { id = appointment.Id }, appointment);
        }

        [HttpGet("my")]
        public async Task<IActionResult> GetMy(CancellationToken ct)
            => Ok(await _appointments.GetMyAsync(ct));

        [HttpGet("{id:guid}")]
        public async Task<IActionResult> GetById(Guid id, CancellationToken ct)
            => Ok(await _appointments.GetByIdAsync(id, ct));

        /// <summary>Cancels (soft) the appointment; the record is kept for history.</summary>
        [HttpDelete("{id:guid}")]
        public async Task<IActionResult> Cancel(Guid id, CancellationToken ct)
        {
            await _appointments.CancelAsync(id, ct);
            return NoContent();
        }
    }
}
