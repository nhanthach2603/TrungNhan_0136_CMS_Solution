using CMS.Data;
using CMS.Data.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CMS.Backend.Controllers
{
    [Authorize(Roles = "Admin")]
    public class AdminCustomersController : Controller
    {
        private readonly ApplicationDbContext _context;

        public AdminCustomersController(ApplicationDbContext context)
        {
            _context = context;
        }

        public IActionResult Index(int page = 1)
        {
            const int pageSize = 10;
            var query = _context.Customers
                .Include(c => c.Orders)
                .OrderBy(c => c.Id);
            int total = query.Count();
            var customers = query.Skip((page - 1) * pageSize).Take(pageSize).ToList();
            ViewBag.CurrentPage = page;
            ViewBag.TotalPages  = (int)Math.Ceiling(total / (double)pageSize);
            ViewBag.TotalCount  = total;
            ViewBag.PageSize    = pageSize;
            ViewBag.PagingController = "AdminCustomers";
            ViewBag.PagingAction = "Index";
            return View(customers);
        }

        public IActionResult Details(int id)
        {
            var customer = _context.Customers
                .Include(c => c.Orders!)
                    .ThenInclude(o => o.OrderDetails!)
                .FirstOrDefault(c => c.Id == id);

            if (customer == null) return NotFound();
            return View(customer);
        }

        [HttpGet]
        public IActionResult Create()
        {
            return View();
        }

        [HttpPost]
        public IActionResult Create(Customer model)
        {
            if (ModelState.IsValid)
            {
                if (_context.Customers.Any(c => c.Email.ToLower() == model.Email.ToLower()))
                {
                    ModelState.AddModelError("Email", "Email đã tồn tại!");
                    return View(model);
                }
                _context.Customers.Add(model);
                _context.SaveChanges();
                return RedirectToAction("Index");
            }
            return View(model);
        }

        [HttpGet]
        public IActionResult Edit(int id)
        {
            var item = _context.Customers.Find(id);
            if (item == null) return NotFound();
            return View(item);
        }

        [HttpPost]
        public IActionResult Edit(Customer model)
        {
            if (ModelState.IsValid)
            {
                var existing = _context.Customers.AsNoTracking().FirstOrDefault(c => c.Id == model.Id);
                if (existing != null && existing.Email != model.Email)
                {
                    if (_context.Customers.Any(c => c.Email.ToLower() == model.Email.ToLower()))
                    {
                        ModelState.AddModelError("Email", "Email đã tồn tại!");
                        return View(model);
                    }
                }
                _context.Customers.Update(model);
                _context.SaveChanges();
                return RedirectToAction("Index");
            }
            return View(model);
        }

        [HttpPost]
        public IActionResult Delete(int id)
        {
            var item = _context.Customers
                .Include(c => c.Orders!)
                    .ThenInclude(o => o.OrderDetails)
                .FirstOrDefault(c => c.Id == id);

            if (item != null)
            {
                if (item.Orders != null)
                {
                    foreach (var order in item.Orders)
                    {
                        if (order.OrderDetails != null)
                            _context.OrderDetails.RemoveRange(order.OrderDetails);
                    }
                    _context.Orders.RemoveRange(item.Orders);
                }
                _context.Customers.Remove(item);
                _context.SaveChanges();
            }
            return RedirectToAction("Index");
        }
    }
}
