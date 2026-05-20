using System.ComponentModel.DataAnnotations;

namespace CMS.Data.Entities
{
    /// <summary>
    /// Bảng lưu trữ thông tin tài khoản Admin/Editor quản lý hệ thống CMS 
    /// </summary>
    public class User
    {
        [Key] // Khóa chính 
        public int Id { get; set; }

        [Required] // Không được để trống 
        [StringLength(50)]
        public required string Username { get; set; } // Tên đăng nhập 

        [Required]
        [StringLength(250)]
        public required string Password { get; set; } // Mật khẩu đã mã hóa 

        [Required]
        [StringLength(100)]
        public required string FullName { get; set; } // Họ tên hiển thị 

        [Required]
        [StringLength(20)]
        public required string Role { get; set; } // Quyền hạn: Admin hoặc Editor 
    }
}