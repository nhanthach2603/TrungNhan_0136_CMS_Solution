/*
    Ho ten sinh vien: Thach Tran Trung Nhan
    Ma sv: 2123110136
    Ngay tao: 28 / 05 / 2026
 */

using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using System.Security.Claims;
using CMS.Data;
using CMS.Data.Entities;

namespace CMS.Backend.Controllers
{
    public class AccountController : Controller
    {
        private readonly ApplicationDbContext _context;

        public AccountController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: Hiển thị trang đăng nhập
        [HttpGet]
        public IActionResult Login()
        {
            return View();
        }

        // POST: Xử lý đăng nhập
        [HttpPost]
        public async Task<IActionResult> Login(string username, string password)
        {
            // Tìm user theo username
            var user = _context.Users.FirstOrDefault(u => u.Username == username);

            if (user != null && BCrypt.Net.BCrypt.Verify(password, user.PasswordHash))
            {
                // Tạo danh sách Claims
                var claims = new List<Claim>
                {
                    new Claim(ClaimTypes.Name, user.Username),
                    new Claim(ClaimTypes.Role, user.Role),
                    new Claim("FullName", user.FullName)
                };

                var claimsIdentity = new ClaimsIdentity(claims, CookieAuthenticationDefaults.AuthenticationScheme);

                // Đăng nhập bằng Cookie
                await HttpContext.SignInAsync(
                    CookieAuthenticationDefaults.AuthenticationScheme,
                    new ClaimsPrincipal(claimsIdentity));

                return RedirectToAction("Index", "Home");
            }

            // Sai thông tin đăng nhập
            ViewBag.Error = "Tên đăng nhập hoặc mật khẩu không đúng!";
            return View();
        }

        // Đăng xuất
        public async Task<IActionResult> Logout()
        {
            await HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
            return RedirectToAction("Login");
        }

        // Trang báo lỗi truy cập
        [HttpGet]
        public IActionResult AccessDenied()
        {
            return View();
        }
    }
}
