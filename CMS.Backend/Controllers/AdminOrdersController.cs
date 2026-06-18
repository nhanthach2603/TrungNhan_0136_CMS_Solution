using CMS.Data;
using CMS.Data.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Text;

namespace CMS.Backend.Controllers
{
    [Authorize(Roles = "Admin")]
    public class AdminOrdersController : Controller
    {
        private readonly ApplicationDbContext _context;

        public AdminOrdersController(ApplicationDbContext context)
        {
            _context = context;
        }

        public IActionResult Index(int page = 1)
        {
            const int pageSize = 10;
            var query = _context.Orders
                .Include(o => o.Customer)
                .Include(o => o.OrderDetails)
                .OrderByDescending(o => o.OrderDate);
            int total = query.Count();
            var orders = query.Skip((page - 1) * pageSize).Take(pageSize).ToList();
            ViewBag.CurrentPage = page;
            ViewBag.TotalPages  = (int)Math.Ceiling(total / (double)pageSize);
            ViewBag.TotalCount  = total;
            ViewBag.PageSize    = pageSize;
            ViewBag.PagingController = "AdminOrders";
            ViewBag.PagingAction = "Index";
            return View(orders);
        }

        public IActionResult Details(int id)
        {
            var order = _context.Orders
                .Include(o => o.Customer)
                .Include(o => o.OrderDetails!)
                    .ThenInclude(d => d.Product)
                .FirstOrDefault(o => o.Id == id);

            if (order == null) return NotFound();
            return View(order);
        }

        [HttpPost]
        public IActionResult UpdateStatus(int id, int status)
        {
            var order = _context.Orders.Find(id);
            if (order != null)
            {
                order.Status = status;
                _context.SaveChanges();
            }
            return RedirectToAction(nameof(Details), new { id = id });
        }

        [HttpPost]
        public IActionResult Delete(int id)
        {
            var order = _context.Orders
                .Include(o => o.OrderDetails)
                .FirstOrDefault(o => o.Id == id);

            if (order != null)
            {
                if (order.OrderDetails != null)
                    _context.OrderDetails.RemoveRange(order.OrderDetails);
                _context.Orders.Remove(order);
                _context.SaveChanges();
            }
            return RedirectToAction(nameof(Index));
        }

        public IActionResult ExportWord(int id)
        {
            var order = _context.Orders
                .Include(o => o.Customer)
                .Include(o => o.OrderDetails!)
                    .ThenInclude(d => d.Product)
                .FirstOrDefault(o => o.Id == id);

            if (order == null) return NotFound();

            var grandTotal = order.OrderDetails?.Sum(d => d.UnitPrice * d.Quantity) ?? 0;

            string statusText;
            switch (order.Status)
            {
                case 0: statusText = "Cho duyet"; break;
                case 1: statusText = "Dang giao hang"; break;
                case 2: statusText = "Hoan thanh"; break;
                case 3: statusText = "Huy don"; break;
                default: statusText = "Khong xac dinh"; break;
            }

            var sb = new StringBuilder();
            sb.Append("<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>");
            sb.Append("<head><meta charset='utf-8'><title>Hoa don don hang</title>");
            sb.Append("<style>");
            sb.Append("body { font-family: 'Times New Roman', serif; font-size: 12pt; }");
            sb.Append("h1 { text-align: center; font-size: 18pt; color: #1e293b; }");
            sb.Append("h2 { font-size: 14pt; color: #334155; border-bottom: 2px solid #1e293b; padding-bottom: 4px; }");
            sb.Append("table { width: 100%; border-collapse: collapse; margin: 12px 0; }");
            sb.Append("th, td { border: 1px solid #94a3b8; padding: 8px 10px; text-align: left; }");
            sb.Append("th { background-color: #1e293b; color: white; font-weight: bold; }");
            sb.Append(".total-row { background-color: #f1f5f9; font-weight: bold; font-size: 13pt; }");
            sb.Append(".info-table td { border: none; padding: 4px 10px; }");
            sb.Append(".info-table td:first-child { font-weight: bold; width: 160px; color: #64748b; }");
            sb.Append(".footer { text-align: center; margin-top: 40px; color: #94a3b8; font-size: 10pt; }");
            sb.Append("</style></head><body>");

            sb.Append("<h1>Hoa Don Don Hang</h1>");
            sb.Append("<p style='text-align:center; color:#64748b;'>Ma don hang: <strong>#" + order.Id + "</strong> | Ngay dat: <strong>" + order.OrderDate.ToString("dd/MM/yyyy HH:mm") + "</strong></p>");

            sb.Append("<h2>Thong tin khach hang</h2>");
            sb.Append("<table class='info-table'>");
            sb.Append("<tr><td>Ho ten:</td><td><strong>" + (order.Customer?.FullName ?? "") + "</strong></td></tr>");
            sb.Append("<tr><td>Email:</td><td>" + (order.Customer?.Email ?? "") + "</td></tr>");
            sb.Append("<tr><td>Dien thoai:</td><td>" + (order.Customer?.Phone ?? "N/A") + "</td></tr>");
            sb.Append("<tr><td>Dia chi:</td><td>" + (order.Customer?.Address ?? "N/A") + "</td></tr>");
            sb.Append("<tr><td>Trang thai:</td><td><strong>" + statusText + "</strong></td></tr>");
            sb.Append("</table>");

            sb.Append("<h2>Chi tiet san pham</h2>");
            sb.Append("<table>");
            sb.Append("<tr><th>STT</th><th>Ten san pham</th><th style='text-align:right'>Don gia</th><th style='text-align:center'>So luong</th><th style='text-align:right'>Thanh tien</th></tr>");
            int stt = 1;
            foreach (var d in order.OrderDetails ?? Enumerable.Empty<OrderDetail>())
            {
                var itemTotal = d.UnitPrice * d.Quantity;
                sb.Append("<tr><td>" + stt + "</td><td>" + (d.Product?.Name ?? "") + "</td><td style='text-align:right'>" + d.UnitPrice.ToString("N0") + " VND</td><td style='text-align:center'>" + d.Quantity + "</td><td style='text-align:right'>" + itemTotal.ToString("N0") + " VND</td></tr>");
                stt++;
            }
            sb.Append("<tr class='total-row'><td colspan='4' style='text-align:right'>Tong cong:</td><td style='text-align:right; color:#dc2626;'>" + grandTotal.ToString("N0") + " VND</td></tr>");
            sb.Append("</table>");

            if (!string.IsNullOrEmpty(order.Notes))
            {
                sb.Append("<h2>Ghi chu</h2>");
                sb.Append("<p>" + order.Notes + "</p>");
            }

            sb.Append("<div class='footer'>");
            sb.Append("<p>Ngay xuat: " + DateTime.Now.ToString("dd/MM/yyyy HH:mm") + "</p>");
            sb.Append("<p>ThaiCMS.Fashion - He thong quan ly don hang</p>");
            sb.Append("</div>");
            sb.Append("</body></html>");

            var bytes = Encoding.UTF8.GetBytes(sb.ToString());
            return File(bytes, "application/msword", "DonHang_" + order.Id + ".doc");
        }
    }
}
