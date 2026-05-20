using System.Collections.Generic;
using System.ComponentModel.DataAnnotations; // Thư viện chứa các ràng buộc dữ liệu (Data Annotations)

namespace CMS.Data.Entities
{
    /// <summary>
    /// Lớp đại diện cho bảng Categories (Danh mục bài viết) trong Cơ sở dữ liệu
    /// </summary>
    public class Category
    {
        [Key] // Đánh dấu thuộc tính phía dưới là Khóa chính (Primary Key) và tự động tăng (Identity)
        public int Id { get; set; }

        [Required] // Ràng buộc bắt buộc nhập dữ liệu (Cột NOT NULL trong SQL)
        [StringLength(100)] // Giới hạn độ dài chuỗi tối đa là 100 ký tự (nvarchar(100))
        public string Name { get; set; } // Tên danh mục (Ví dụ: Tin tức, Khuyến mãi, Sự kiện)

        public string? Description { get; set; } // Mô tả chi tiết danh mục (Dấu ? cho phép cột này bị rỗng/NULL)

        public string? Slug { get; set; } // Đường dẫn thân thiện cho SEO (Ví dụ: tin-tuc, khuyen-mai)

        /// <summary>
        /// Thuộc tính điều hướng (Navigation Property).
        /// Thiết lập mối quan hệ 1-N: Một danh mục (Category) có thể chứa nhiều bài viết (Posts).
        /// </summary>
        public virtual ICollection<Post> Posts { get; set; } = new List<Post>();
    }
}