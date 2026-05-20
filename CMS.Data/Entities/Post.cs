using System;
using System.ComponentModel.DataAnnotations; // Thư viện cấu hình ràng buộc dữ liệu
using System.ComponentModel.DataAnnotations.Schema; // Thư viện cấu hình mối quan hệ giữa các bảng

namespace CMS.Data.Entities
{
    /// <summary>
    /// Lớp đại diện cho bảng Posts (Bài viết) trong Cơ sở dữ liệu
    /// </summary>
    public class Post
    {
        [Key] // Cấu hình thuộc tính Id làm Khóa chính
        public int Id { get; set; }

        [Required] // Bắt buộc phải có tiêu đề khi tạo bài viết
        [StringLength(250)] // Giới hạn tiêu đề tối đa 250 ký tự
        public string Title { get; set; } // Tiêu đề bài viết

        [Required] // Bắt buộc phải có nội dung
        public string Content { get; set; } // Nội dung chi tiết của bài viết (lưu dạng văn bản dài hoặc HTML)

        public string? ImageUrl { get; set; } // Đường dẫn hình ảnh đại diện của bài viết (Được phép NULL)

        public DateTime CreatedDate { get; set; } = DateTime.Now; // Ngày tạo bài viết, mặc định lấy thời gian hiện tại của hệ thống

        public string? Status { get; set; } // Trạng thái bài viết (Ví dụ: "Draft" - Bản nháp, "Published" - Đã xuất bản)

       
        // THIẾT LẬP KHÓA NGOẠI (FOREIGN KEY)
      

        public int CategoryId { get; set; } // Cột lưu ID của danh mục mà bài viết này thuộc về (Khóa ngoại)

        [ForeignKey("CategoryId")] // Khai báo cho Entity Framework biết CategoryId là khóa ngoại liên kết sang bảng Category
        public virtual Category Category { get; set; } // Thuộc tính điều hướng giúp lấy nhanh thông tin danh mục cha
    }
}