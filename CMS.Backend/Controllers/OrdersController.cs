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
    // Một sản phẩm trong giỏ hàng gửi từ FE
    public class OrderItemDTO
    {
        public int ProductId { get; set; }
        public int Quantity { get; set; }
    }

    // DTO nhận dữ liệu đặt hàng từ FE
    public class OrderInputDTO
    {
        public int CustomerId { get; set; }
        public string? Notes { get; set; }
        public List<OrderItemDTO> Items { get; set; } = new();
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
            if (input == null || input.CustomerId <= 0)
            {
                return BadRequest(new { message = "Thiếu thông tin khách hàng!" });
            }

            if (input.Items == null || input.Items.Count == 0)
            {
                return BadRequest(new { message = "Giỏ hàng trống!" });
            }

            // Kiểm tra khách hàng tồn tại
            var customerExists = await _context.Customers.AnyAsync(c => c.Id == input.CustomerId);
            if (!customerExists)
            {
                return NotFound(new { message = "Không tìm thấy khách hàng!" });
            }

            // Tạo Order
            var newOrder = new Order
            {
                OrderDate = DateTime.Now,
                CustomerId = input.CustomerId,
                Status = 0, // 0: Chờ duyệt
                Notes = input.Notes
            };

            _context.Orders.Add(newOrder);
            await _context.SaveChangesAsync();

            decimal totalAmount = 0;

            // Lặp qua từng sản phẩm trong giỏ
            foreach (var item in input.Items)
            {
                var product = await _context.Products.FirstOrDefaultAsync(p => p.Id == item.ProductId);
                if (product == null) continue;

                // Kiểm tra tồn kho
                if (product.StockQuantity < item.Quantity)
                {
                    // Xử lý đơn giản: bỏ qua sản phẩm thiếu hàng
                    continue;
                }

                var detail = new OrderDetail
                {
                    OrderId = newOrder.Id,
                    ProductId = product.Id,
                    Quantity = item.Quantity,
                    UnitPrice = product.Price
                };
                _context.OrderDetails.Add(detail);

                // Khấu trừ tồn kho
                product.StockQuantity -= item.Quantity;
                _context.Products.Update(product);

                totalAmount += product.Price * item.Quantity;
            }

            await _context.SaveChangesAsync();

            return StatusCode(201, new
            {
                message = "Đặt hàng thành công",
                orderId = newOrder.Id,
                totalAmount = totalAmount
            });
        }

        // GET: api/orders/customer/{customerId}
        [HttpGet("customer/{customerId}")]
        public async Task<IActionResult> GetByCustomer(int customerId)
        {
            var customerExists = await _context.Customers.AnyAsync(c => c.Id == customerId);
            if (!customerExists)
            {
                return NotFound(new { message = "Không tìm thấy khách hàng!" });
            }

            var orders = await _context.Orders
                .Where(o => o.CustomerId == customerId)
                .OrderByDescending(o => o.OrderDate)
                .Select(o => new
                {
                    o.Id,
                    o.OrderDate,
                    o.Status,
                    o.Notes,
                    TotalAmount = o.OrderDetails.Sum(d => d.UnitPrice * d.Quantity),
                    Items = o.OrderDetails.Select(d => new
                    {
                        d.ProductId,
                        ProductName = d.Product.Name,
                        d.Quantity,
                        d.UnitPrice
                    })
                })
                .ToListAsync();

            return Ok(orders);
        }
    }
}
