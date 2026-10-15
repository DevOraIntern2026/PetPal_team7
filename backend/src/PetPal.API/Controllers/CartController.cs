using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PetPal.Application.DTOs.Store;
using PetPal.Application.Interfaces;

namespace PetPal.API.Controllers
{
    /// <summary>The cart always belongs to the authenticated user taken from the token.</summary>
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class CartController : ControllerBase
    {
        private readonly ICartService _cart;

        public CartController(ICartService cart) => _cart = cart;

        [HttpGet]
        public async Task<IActionResult> Get(CancellationToken ct)
            => Ok(await _cart.GetAsync(ct));

        [HttpPost("items")]
        public async Task<IActionResult> AddItem(AddCartItemRequest request, CancellationToken ct)
            => Ok(await _cart.AddItemAsync(request, ct));

        [HttpPut("items/{productId:guid}")]
        public async Task<IActionResult> UpdateItem(Guid productId, UpdateCartItemRequest request, CancellationToken ct)
            => Ok(await _cart.UpdateItemAsync(productId, request, ct));

        [HttpDelete("items/{productId:guid}")]
        public async Task<IActionResult> RemoveItem(Guid productId, CancellationToken ct)
            => Ok(await _cart.RemoveItemAsync(productId, ct));

        [HttpDelete]
        public async Task<IActionResult> Clear(CancellationToken ct)
        {
            await _cart.ClearAsync(ct);
            return NoContent();
        }
    }
}
