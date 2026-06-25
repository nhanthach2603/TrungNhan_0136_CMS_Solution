/*
    Ho ten sinh vien: Thach Tran Trung Nhan
    Ma sv: 2123110136
    Ngay tao: 15 / 05 / 2026
 */

using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using CMS.Data;
using CMS.Data.Entities;

namespace CMS.Backend.Controllers
{
    [Authorize]
    public class PostController : Controller
    {
        private readonly ApplicationDbContext _context;
        private readonly IWebHostEnvironment _env;

        public PostController(ApplicationDbContext context, IWebHostEnvironment env)
        {
            _context = context;
            _env = env;
        }

        // Hiển thị danh sách bài viết
        public IActionResult Index(int page = 1)
        {
            const int pageSize = 9;
            var query = _context.Posts.Include(p => p.Category).OrderByDescending(p => p.CreatedDate);
            int total = query.Count();
            var posts = query.Skip((page - 1) * pageSize).Take(pageSize).ToList();
            ViewBag.CurrentPage = page;
            ViewBag.TotalPages  = (int)Math.Ceiling(total / (double)pageSize);
            ViewBag.TotalCount  = total;
            ViewBag.PageSize    = pageSize;
            ViewBag.PagingController = "Post";
            ViewBag.PagingAction = "Index";
            return View(posts);
        }

        // Chi tiết bài viết
        public IActionResult Details(int id)
        {
            var post = _context.Posts.Find(id);
            if (post == null) return NotFound();
            return View(post);
        }

        // GET: Thêm bài viết mới
        [HttpGet]
        public IActionResult Create()
        {
            var categories = _context.Categories.ToList();
            ViewBag.CategoryList = new SelectList(categories, "Id", "Name");
            return View();
        }

        // POST: Thêm bài viết mới
        [HttpPost]
        public IActionResult Create(Post model, IFormFile uploadImage)
        {
            // Xử lý upload ảnh
            if (uploadImage != null && uploadImage.Length > 0)
            {
                var fileName = Guid.NewGuid() + Path.GetExtension(uploadImage.FileName);
                var filePath = Path.Combine(_env.WebRootPath, "uploads", fileName);

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    uploadImage.CopyTo(stream);
                }

                model.ImageUrl = "/uploads/" + fileName;
            }

            model.CreatedDate = DateTime.Now;
            _context.Posts.Add(model);
            _context.SaveChanges();

            return RedirectToAction("Index");
        }

        // GET: Sửa bài viết
        [HttpGet]
        public IActionResult Edit(int id)
        {
            var post = _context.Posts.AsNoTracking().FirstOrDefault(x => x.Id == id);
            if (post == null) return NotFound();

            var categories = _context.Categories.ToList();
            ViewBag.CategoryList = new SelectList(categories, "Id", "Name");

            return View(post);
        }

        // POST: Sửa bài viết
        [HttpPost]
        public IActionResult Edit(Post model, IFormFile uploadImage)
        {
            // Xử lý upload ảnh mới
            if (uploadImage != null && uploadImage.Length > 0)
            {
                var fileName = Guid.NewGuid() + Path.GetExtension(uploadImage.FileName);
                var filePath = Path.Combine(_env.WebRootPath, "uploads", fileName);

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    uploadImage.CopyTo(stream);
                }

                model.ImageUrl = "/uploads/" + fileName;
            }
            else
            {
                // Giữ nguyên ảnh cũ nếu không chọn ảnh mới
                var oldPost = _context.Posts.AsNoTracking().FirstOrDefault(x => x.Id == model.Id);
                if (oldPost != null)
                {
                    model.ImageUrl = oldPost.ImageUrl;
                }
            }

            _context.Posts.Update(model);
            _context.SaveChanges();

            return RedirectToAction("Index");
        }

        // Xóa bài viết
        public IActionResult Delete(int id)
        {
            var post = _context.Posts.Find(id);
            if (post != null)
            {
                _context.Posts.Remove(post);
                _context.SaveChanges();
            }

            return RedirectToAction("Index");
        }
    }
}
