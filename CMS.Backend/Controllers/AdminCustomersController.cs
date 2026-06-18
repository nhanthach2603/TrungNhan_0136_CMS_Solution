using CMS.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Linq;

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

        // GET: AdminCustomers
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

        // GET: AdminCustomers/Details/5
        public IActionResult Details(int id)
        {
            var customer = _context.Customers
                .Include(c => c.Orders!)
                    .ThenInclude(o => o.OrderDetails!)
                .FirstOrDefault(c => c.Id == id);

            if (customer == null)
            {
                return NotFound();
            }

            return View(customer);
        }
    }
}
