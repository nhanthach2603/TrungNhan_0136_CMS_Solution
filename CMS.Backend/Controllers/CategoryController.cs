/*
    Ho ten sinh vien: Thach Tran Trung Nhan
    Ma sv: 2123110136
    Ngay tao: 15 / 05 / 2026
 */



using Microsoft.AspNetCore.Mvc;
using CMS.Data.Entities; // Kết nối tới lớp dữ liệu bạn vừa tạo

public class CategoryController : Controller
{
    public IActionResult Index()
    {
        // Tạo danh sách dữ liệu mẫu trực tiếp trong code
        var list = new List<Category> {
            new Category { Id = 1, Name = "Tin Công Nghệ", Description = "Review Laptop, AI" },
            new Category { Id = 2, Name = "Giáo Dục", Description = "Thông tin tuyển sinh" }
        };
        return View(list); // Gửi danh sách này sang giao diện
    }
}