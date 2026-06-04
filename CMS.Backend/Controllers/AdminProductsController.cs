/*
    Ho ten sinh vien: Thach Tran Trung Nhan
    Ma sv: 2123110136
    Ngay tao: 04 / 06 / 2026
 */

using CMS.Data;
using CMS.Data.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;

namespace CMS.Backend.Controllers
{
    [Authorize(Roles = "Admin")]
    public class AdminProductsController : Controller
    {
        private readonly ApplicationDbContext _context;
        private readonly IWebHostEnvironment _env;

        public AdminProductsController(ApplicationDbContext context, IWebHostEnvironment env)
        {
            _context = context;
            _env = env;
        }

        public IActionResult Index()
        {
            var products = _context.Products
                .Include(p => p.CategoryProduct)
                .ToList();
            return View(products);
        }

        [HttpGet]
        public IActionResult Create()
        {
            ViewBag.CategoryList = new SelectList(_context.CategoriesProducts, "Id", "Name");
            return View();
        }

        [HttpPost]
        public IActionResult Create(Product model, IFormFile? uploadImage)
        {
            if (ModelState.IsValid)
            {
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

                _context.Products.Add(model);
                _context.SaveChanges();
                return RedirectToAction("Index");
            }
            ViewBag.CategoryList = new SelectList(_context.CategoriesProducts, "Id", "Name");
            return View(model);
        }

        [HttpGet]
        public IActionResult Edit(int id)
        {
            var item = _context.Products.Find(id);
            if (item == null) return NotFound();
            ViewBag.CategoryList = new SelectList(_context.CategoriesProducts, "Id", "Name", item.CategoryProductId);
            return View(item);
        }

        [HttpPost]
        public IActionResult Edit(Product model, IFormFile? uploadImage)
        {
            if (ModelState.IsValid)
            {
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
                    var old = _context.Products.AsNoTracking().FirstOrDefault(x => x.Id == model.Id);
                    if (old != null) model.ImageUrl = old.ImageUrl;
                }

                _context.Products.Update(model);
                _context.SaveChanges();
                return RedirectToAction("Index");
            }
            ViewBag.CategoryList = new SelectList(_context.CategoriesProducts, "Id", "Name", model.CategoryProductId);
            return View(model);
        }

        public IActionResult Delete(int id)
        {
            var item = _context.Products.Find(id);
            if (item != null)
            {
                _context.Products.Remove(item);
                _context.SaveChanges();
            }
            return RedirectToAction("Index");
        }
    }
}
