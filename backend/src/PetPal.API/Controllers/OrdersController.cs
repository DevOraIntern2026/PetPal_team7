using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PetPal.Application.DTOs.Store;
using PetPal.Application.Interfaces;

namespace PetPal.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class OrdersController : ControllerBase
    {
        private readonly IOrderService _orders;

        public OrdersController(IOrderService orders) => _orders = orders;

        [HttpPost("checkout")]
        public async Task<IActionResult> Checkout(CheckoutRequest request, CancellationToken ct)
        {
            var order = await _orders.CheckoutAsync(request, ct);
            return CreatedAtAction(nameof(GetById), new { id = order.Id }, order);
        }

        [HttpGet("my")]
        public async Task<IActionResult> GetMy(CancellationToken ct)
            => Ok(await _orders.GetMyAsync(ct));

        [HttpGet("{id:guid}")]
        public async Task<IActionResult> GetById(Guid id, CancellationToken ct)
            => Ok(await _orders.GetByIdAsync(id, ct));
    }
}
