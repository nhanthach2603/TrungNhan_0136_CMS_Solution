using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace CMS.Data.Entities
{
    /// <summary>
    /// Bảng lưu trữ thông tin của người mua hàng 
    /// </summary>
    public class Customer
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [StringLength(100)]
        public required string FullName { get; set; }

        [Required]
        [StringLength(100)]
        [EmailAddress]
        public required string Email { get; set; } // Email liên hệ 

        [Required]
        [StringLength(20)]
        public required string Phone { get; set; } // Số điện thoại 

        [StringLength(250)]
        public string? Address { get; set; } // Địa chỉ giao hàng 

        // Mối quan hệ 1-N: Một khách hàng có thể đặt nhiều đơn hàng 
        public virtual ICollection<Order> Orders { get; set; } = new List<Order>();
    }
}