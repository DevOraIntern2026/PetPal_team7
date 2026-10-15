using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PetPal.Application.Constants;
using PetPal.Application.DTOs.Store;
using PetPal.Application.Interfaces;
using PetPal.Domain.Enums;

namespace PetPal.API.Controllers
{
    [Route("api/admin/orders")]
    [ApiController]
    [Authorize(Roles = Roles.Admin)]
    public class AdminOrdersController : ControllerBase
    {
        private readonly IOrderService _orders;

        public AdminOrdersController(IOrderService orders) => _orders = orders;

        [HttpGet]
        public async Task<IActionResult> Search([FromQuery] OrderStatus? status, [FromQuery] int page = 1,
            [FromQuery] int pageSize = 20, CancellationToken ct = default)
            => Ok(await _orders.AdminSearchAsync(status, page, pageSize, ct));

        // Single order: GET /api/orders/{id} (admins may read any order).

        [HttpPut("{id:guid}/status")]
        public async Task<IActionResult> UpdateStatus(Guid id, UpdateOrderStatusRequest request, CancellationToken ct)
            => Ok(await _orders.AdminUpdateStatusAsync(id, request.Status, ct));

        [HttpPut("{id:guid}/payment-status")]
        public async Task<IActionResult> UpdatePaymentStatus(Guid id, UpdatePaymentStatusRequest request, CancellationToken ct)
            => Ok(await _orders.AdminUpdatePaymentStatusAsync(id, request.PaymentStatus, ct));
    }
}
