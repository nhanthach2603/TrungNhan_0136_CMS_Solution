/*
    Ho ten sinh vien: Thach Tran Trung Nhan
    Ma sv: 2123110136
    Ngay tao: 15 / 05 / 2026
 */

using CMS.Data;
using CMS.Backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Diagnostics;
using System.Linq;

namespace CMS.Backend.Controllers
{
    [Authorize(Roles = "Admin")]
    public class HomeController : Controller
    {
        private readonly ApplicationDbContext _context;
        private readonly ILogger<HomeController> _logger;

        public HomeController(ApplicationDbContext context, ILogger<HomeController> logger)
        {
            _context = context;
            _logger = logger;
        }

        public IActionResult Index()
        {
            // 1. Thống kê Doanh thu
            ViewBag.TotalRevenue = _context.OrderDetails.Sum(d => d.UnitPrice * d.Quantity);

            // 2. Thống kê Số đơn hàng
            ViewBag.TotalOrders = _context.Orders.Count();

            // 3. Thống kê Số khách hàng
            ViewBag.TotalCustomers = _context.Customers.Count();

            // 4. Thống kê Tổng số sản phẩm
            ViewBag.TotalProducts = _context.Products.Count();

            // 5. Lấy danh sách 5 đơn hàng gần nhất
            ViewBag.RecentOrders = _context.Orders
                .Include(o => o.Customer)
                .Include(o => o.OrderDetails)
                .OrderByDescending(o => o.OrderDate)
                .Take(5)
                .ToList();

            // 6. Lấy 5 sản phẩm có lượng tồn kho cao nhất làm dữ liệu biểu đồ
            ViewBag.TopStockProducts = _context.Products
                .OrderByDescending(p => p.StockQuantity)
                .Take(5)
                .ToList();

            return View();
        }

        public IActionResult Privacy()
        {
            return View();
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}
