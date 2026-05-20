using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CMS.Data.Entities
{
    public class Order
    {
        [Key] // Khóa chính [cite: 192]
        public int Id { get; set; }

        [Required] // Bắt buộc phải có ngày đặt hàng [cite: 292]
        public DateTime OrderDate { get; set; } = DateTime.Now; // Mặc định lấy thời gian hiện tại [cite: 268]

        [Required]
        public int Status { get; set; } // Trạng thái đơn hàng (0: Chờ duyệt, 1: Đã giao, 2: Hủy) [cite: 268]

        // ==========================================
        // THIẾT LẬP MỐI QUAN HỆ KHÓA NGOẠI
        // ==========================================

        [Required]
        public int CustomerId { get; set; } // Khóa ngoại liên kết tới bảng Customer [cite: 194]

        [ForeignKey("CustomerId")]
        public virtual Customer Customer { get; set; } // Thuộc tính điều hướng về khách hàng cha
    }
}