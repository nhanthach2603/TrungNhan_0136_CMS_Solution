/*
    Ho ten sinh vien: Thach Tran Trung Nhan
    Ma sv: 2123110136
    Ngay tao: 15 / 05 / 2026
 */

using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using CMS.Data;
using CMS.Data.Entities;

namespace CMS.Backend.Controllers
{
    [Authorize(Roles = "Admin")]
    public class UserController : Controller
    {
        private readonly ApplicationDbContext _context;

        public UserController(ApplicationDbContext context)
        {
            _context = context;
        }

        // Hiển thị danh sách thành viên
        public IActionResult Index()
        {
            var users = _context.Users.ToList();
            return View(users);
        }

        // GET: Thêm thành viên mới
        [HttpGet]
        public IActionResult Create()
        {
            return View();
        }

        // POST: Thêm thành viên mới
        [HttpPost]
        public IActionResult Create(User model)
        {
            // Kiểm tra trùng Username
            if (_context.Users.Any(u => u.Username == model.Username))
            {
                ModelState.AddModelError("Username", "Tên đăng nhập đã tồn tại!");
                return View(model);
            }

            _context.Users.Add(model);
            _context.SaveChanges();

            return RedirectToAction("Index");
        }

        // GET: Sửa thông tin thành viên
        [HttpGet]
        public IActionResult Edit(int id)
        {
            var user = _context.Users.AsNoTracking().FirstOrDefault(x => x.Id == id);
            if (user == null) return NotFound();

            return View(user);
        }

        // POST: Sửa thông tin thành viên
        [HttpPost]
        public IActionResult Edit(User model, string NewPassword)
        {
            // Nếu có mật khẩu mới thì cập nhật
            if (!string.IsNullOrEmpty(NewPassword))
            {
                model.PasswordHash = NewPassword;
            }
            else
            {
                // Giữ nguyên mật khẩu cũ
                var oldUser = _context.Users.AsNoTracking().FirstOrDefault(x => x.Id == model.Id);
                if (oldUser != null)
                {
                    model.PasswordHash = oldUser.PasswordHash;
                }
            }

            _context.Users.Update(model);
            _context.SaveChanges();

            return RedirectToAction("Index");
        }

        // Xóa thành viên
        public IActionResult Delete(int id)
        {
            var user = _context.Users.Find(id);
            if (user != null)
            {
                _context.Users.Remove(user);
                _context.SaveChanges();
            }

            return RedirectToAction("Index");
        }
    }
}
