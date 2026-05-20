using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;

namespace CMS.Backend.Controllers
{
    [ApiController] // Đánh dấu lớp này là một API Controller 
    [Route("api/[controller]")] // Cấu hình đường dẫn URL: api/category 
    public class CategoryController : ControllerBase // Kế thừa cấu trúc API chuẩn của .NET 
    {
        /// <summary>
        /// API Lấy danh sách tất cả các danh mục bài viết 
        /// </summary>
        [HttpGet] // Giao thức lấy dữ liệu 
        public IActionResult GetAll() // 
        {
            // Tạo dữ liệu giả lập (Mock Data) theo slide 
            var data = new List<string> { "Tin tức", "Sự kiện" }; // 

            return Ok(data); // Trả về mã trạng thái 200 kèm dữ liệu dạng JSON 
        }
    }
}