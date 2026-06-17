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
    // DTO nhận dữ liệu đăng ký khách hàng
    public class CustomerRegisterDTO
    {
        public string FullName { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public string? Phone { get; set; }
        public string? Address { get; set; }
    }

    // DTO nhận dữ liệu đăng nhập khách hàng
    public class CustomerLoginDTO
    {
        public string Email { get; set; }
        public string Password { get; set; }
    }

    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public AuthController(ApplicationDbContext context)
        {
            _context = context;
        }

        // POST: api/Auth/CustomerRegister
        [HttpPost("CustomerRegister")]
        public async Task<IActionResult> CustomerRegister([FromBody] CustomerRegisterDTO input)
        {
            if (input == null
                || string.IsNullOrWhiteSpace(input.Email)
                || string.IsNullOrWhiteSpace(input.Password)
                || string.IsNullOrWhiteSpace(input.FullName))
            {
                return BadRequest(new { message = "Vui lòng nhập đầy đủ Họ tên, Email và Mật khẩu!" });
            }

            // Kiểm tra email đã tồn tại
            var existing = await _context.Customers
                .FirstOrDefaultAsync(c => c.Email.ToLower() == input.Email.ToLower());

            if (existing != null)
            {
                return Conflict(new { message = "Email đã được sử dụng!" });
            }

            var customer = new Customer
            {
                FullName = input.FullName,
                Email = input.Email,
                Password = input.Password, // Lưu thô theo yêu cầu tối giản
                Phone = input.Phone,
                Address = input.Address
            };

            _context.Customers.Add(customer);
            await _context.SaveChangesAsync();

            return StatusCode(201, new
            {
                message = "Đăng ký tài khoản thành công",
                customerId = customer.Id,
                fullName = customer.FullName,
                email = customer.Email
            });
        }

        // POST: api/Auth/CustomerLogin
        [HttpPost("CustomerLogin")]
        public async Task<IActionResult> CustomerLogin([FromBody] CustomerLoginDTO input)
        {
            if (input == null
                || string.IsNullOrWhiteSpace(input.Email)
                || string.IsNullOrWhiteSpace(input.Password))
            {
                return BadRequest(new { message = "Vui lòng nhập Email và Mật khẩu!" });
            }

            var customer = await _context.Customers
                .FirstOrDefaultAsync(c => c.Email.ToLower() == input.Email.ToLower()
                                       && c.Password == input.Password);

            if (customer == null)
            {
                return Unauthorized(new { message = "Email hoặc mật khẩu không đúng!" });
            }

            return Ok(new
            {
                message = "Đăng nhập thành công",
                customerId = customer.Id,
                fullName = customer.FullName,
                email = customer.Email,
                phone = customer.Phone,
                address = customer.Address
            });
        }
    }
}
