using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PetPal.Application.Constants;
using PetPal.Application.DTOs.Appointments;
using PetPal.Application.Interfaces;
using PetPal.Domain.Enums;

namespace PetPal.API.Controllers
{
    [Route("api/admin/appointments")]
    [ApiController]
    [Authorize(Roles = Roles.Admin)]
    public class AdminAppointmentsController : ControllerBase
    {
        private readonly IAppointmentService _appointments;

        public AdminAppointmentsController(IAppointmentService appointments) => _appointments = appointments;

        [HttpGet]
        public async Task<IActionResult> Search([FromQuery] Guid? doctorId, [FromQuery] DateOnly? date,
            [FromQuery] AppointmentStatus? status, [FromQuery] int page = 1, [FromQuery] int pageSize = 20,
            CancellationToken ct = default)
            => Ok(await _appointments.AdminSearchAsync(doctorId, date, status, page, pageSize, ct));

        [HttpPut("{id:guid}/status")]
        public async Task<IActionResult> UpdateStatus(Guid id, UpdateAppointmentStatusRequest request, CancellationToken ct)
            => Ok(await _appointments.AdminUpdateStatusAsync(id, request.Status, ct));
    }
}
