/*
    Ho ten sinh vien: Thach Tran Trung Nhan
    Ma sv: 2123110136
    Ngay tao: 28 / 05 / 2026
 */

using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CMS.Data;
using CMS.Data.Entities;

namespace CMS.Backend.Controllers
{
    // DTO nhận dữ liệu đặt hàng
    public class OrderInputDTO
    {
        public int CustomerId { get; set; }
        public string? Notes { get; set; }
    }

    [Route("api/[controller]")]
    [ApiController]
    public class OrdersController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public OrdersController(ApplicationDbContext context)
        {
            _context = context;
        }

        // POST: api/orders
        [HttpPost]
        public async Task<IActionResult> CreateOrder([FromBody] OrderInputDTO input)
        {
            var newOrder = new Order
            {
                OrderDate = DateTime.Now,
                CustomerId = input.CustomerId,
                Status = 0,
                Notes = input.Notes
            };

            _context.Orders.Add(newOrder);
            await _context.SaveChangesAsync();

            return StatusCode(201, new
            {
                message = "Đặt hàng thành công",
                orderId = newOrder.Id
            });
        }
    }
}
