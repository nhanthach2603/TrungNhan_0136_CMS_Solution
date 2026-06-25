/*
    Ho ten sinh vien: Thach Tran Trung Nhan
    Ma sv: 2123110136
    Ngay tao: 04 / 06 / 2026
 */

using CMS.Data;
using CMS.Data.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CMS.Backend.Controllers
{
    [Authorize(Roles = "Admin")]
    public class AdminCategoriesProductsController : Controller
    {
        private readonly ApplicationDbContext _context;

        public AdminCategoriesProductsController(ApplicationDbContext context)
        {
            _context = context;
        }

        public IActionResult Index(int page = 1)
        {
            const int pageSize = 10;
            var query = _context.CategoriesProducts.OrderBy(c => c.Id);
            int total = query.Count();
            var data = query.Skip((page - 1) * pageSize).Take(pageSize).ToList();
            ViewBag.CurrentPage = page;
            ViewBag.TotalPages  = (int)Math.Ceiling(total / (double)pageSize);
            ViewBag.TotalCount  = total;
            ViewBag.PageSize    = pageSize;
            ViewBag.PagingController = "AdminCategoriesProducts";
            ViewBag.PagingAction = "Index";
            return View(data);
        }

        [HttpGet]
        public IActionResult Create()
        {
            return View();
        }

        [HttpPost]
        public IActionResult Create(CategoryProduct model)
        {
            if (ModelState.IsValid)
            {
                _context.CategoriesProducts.Add(model);
                _context.SaveChanges();
                return RedirectToAction("Index");
            }
            return View(model);
        }

        [HttpGet]
        public IActionResult Edit(int id)
        {
            var item = _context.CategoriesProducts.Find(id);
            if (item == null) return NotFound();
            return View(item);
        }

        [HttpPost]
        public IActionResult Edit(CategoryProduct model)
        {
            if (ModelState.IsValid)
            {
                _context.CategoriesProducts.Update(model);
                _context.SaveChanges();
                return RedirectToAction("Index");
            }
            return View(model);
        }

        public IActionResult Delete(int id)
        {
            var item = _context.CategoriesProducts.Find(id);
            if (item != null)
            {
                _context.CategoriesProducts.Remove(item);
                _context.SaveChanges();
            }
            return RedirectToAction("Index");
        }
    }
}
