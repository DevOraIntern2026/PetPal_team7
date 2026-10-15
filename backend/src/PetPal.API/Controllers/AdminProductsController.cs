using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PetPal.Application.Constants;
using PetPal.Application.DTOs.Store;
using PetPal.Application.Interfaces;

namespace PetPal.API.Controllers
{
    [Route("api/admin/products")]
    [ApiController]
    [Authorize(Roles = Roles.Admin)]
    public class AdminProductsController : ControllerBase
    {
        private readonly IProductService _products;

        public AdminProductsController(IProductService products) => _products = products;

        [HttpGet]
        public async Task<IActionResult> GetAll([FromQuery] string? category, [FromQuery] string? search,
            [FromQuery] int page = 1, [FromQuery] int pageSize = 20, CancellationToken ct = default)
            => Ok(await _products.GetAllAsync(category, search, page, pageSize, ct));

        [HttpGet("{id:guid}")]
        public async Task<IActionResult> GetById(Guid id, CancellationToken ct)
            => Ok(await _products.GetByIdAsync(id, ct));

        [HttpPost]
        public async Task<IActionResult> Create(ProductRequest request, CancellationToken ct)
        {
            var product = await _products.CreateAsync(request, ct);
            return CreatedAtAction(nameof(GetById), new { id = product.Id }, product);
        }

        [HttpPut("{id:guid}")]
        public async Task<IActionResult> Update(Guid id, ProductRequest request, CancellationToken ct)
            => Ok(await _products.UpdateAsync(id, request, ct));

        [HttpPost("{id:guid}/activate")]
        public async Task<IActionResult> Activate(Guid id, CancellationToken ct)
            => Ok(await _products.SetActiveAsync(id, true, ct));

        [HttpPost("{id:guid}/deactivate")]
        public async Task<IActionResult> Deactivate(Guid id, CancellationToken ct)
            => Ok(await _products.SetActiveAsync(id, false, ct));
    }
}
