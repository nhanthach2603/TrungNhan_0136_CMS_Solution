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

        public IActionResult Index(int page = 1)
        {
            const int pageSize = 10;
            var query = _context.Products.Include(p => p.CategoryProduct).OrderBy(p => p.Id);
            int total = query.Count();
            var products = query.Skip((page - 1) * pageSize).Take(pageSize).ToList();
            ViewBag.CurrentPage = page;
            ViewBag.TotalPages  = (int)Math.Ceiling(total / (double)pageSize);
            ViewBag.TotalCount  = total;
            ViewBag.PageSize    = pageSize;
            ViewBag.PagingController = "AdminProducts";
            ViewBag.PagingAction = "Index";
            return View(products);
        }

        [HttpGet]
        public IActionResult Create()
        {
            ViewBag.CategoryList = new SelectList(_context.CategoriesProducts, "Id", "Name");
            return View();
        }

        [HttpPost]
        public IActionResult Create(Product model, List<IFormFile>? uploadImages)
        {
            if (ModelState.IsValid)
            {
                var imageUrls = new List<string>();

                if (uploadImages != null && uploadImages.Any())
                {
                    var uploadsDir = Path.Combine(_env.WebRootPath, "uploads");
                    Directory.CreateDirectory(uploadsDir);

                    foreach (var file in uploadImages)
                    {
                        if (file.Length > 0)
                        {
                            var fileName = Guid.NewGuid() + Path.GetExtension(file.FileName);
                            var filePath = Path.Combine(uploadsDir, fileName);
                            using (var stream = new FileStream(filePath, FileMode.Create))
                            {
                                file.CopyTo(stream);
                            }
                            imageUrls.Add("/uploads/" + fileName);
                        }
                    }
                }

                // Store first image as primary ImageUrl, rest as JSON in AdditionalImages (if exists)
                // or store all as comma-separated in ImageUrl
                if (imageUrls.Any())
                {
                    model.ImageUrl = string.Join(",", imageUrls);
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
        public IActionResult Edit(Product model, List<IFormFile>? uploadImages, string? removeImageUrl)
        {
            if (ModelState.IsValid)
            {
                var old = _context.Products.AsNoTracking().FirstOrDefault(x => x.Id == model.Id);
                var existingImages = old?.ImageUrl?.Split(',', StringSplitOptions.RemoveEmptyEntries).ToList()
                                    ?? new List<string>();

                // Remove an image if requested
                if (!string.IsNullOrEmpty(removeImageUrl))
                {
                    existingImages.RemoveAll(u => u == removeImageUrl);
                }

                // Add new uploaded images
                if (uploadImages != null && uploadImages.Any())
                {
                    var uploadsDir = Path.Combine(_env.WebRootPath, "uploads");
                    Directory.CreateDirectory(uploadsDir);

                    foreach (var file in uploadImages)
                    {
                        if (file.Length > 0)
                        {
                            var fileName = Guid.NewGuid() + Path.GetExtension(file.FileName);
                            var filePath = Path.Combine(uploadsDir, fileName);
                            using (var stream = new FileStream(filePath, FileMode.Create))
                            {
                                file.CopyTo(stream);
                            }
                            existingImages.Add("/uploads/" + fileName);
                        }
                    }
                }

                model.ImageUrl = string.Join(",", existingImages);

                _context.Products.Update(model);
                _context.SaveChanges();
                return RedirectToAction("Index");
            }
            ViewBag.CategoryList = new SelectList(_context.CategoriesProducts, "Id", "Name", model.CategoryProductId);
            return View(model);
        }

        [HttpPost]
        public IActionResult RemoveImage(int productId, string imageUrl)
        {
            var product = _context.Products.Find(productId);
            if (product != null)
            {
                var images = product.ImageUrl?.Split(',', StringSplitOptions.RemoveEmptyEntries).ToList()
                             ?? new List<string>();
                images.RemoveAll(u => u == imageUrl);
                product.ImageUrl = string.Join(",", images);
                _context.SaveChanges();
            }
            return RedirectToAction("Edit", new { id = productId });
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
