/*
    Ho ten sinh vien: Thach Tran Trung Nhan
    Ma sv: 2123110136
    Ngay tao: 21 / 05 / 2026
 */

using Microsoft.EntityFrameworkCore;
using CMS.Data.Entities;

namespace CMS.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options) { }

        // Khai báo các bảng dữ liệu
        public DbSet<Category> Categories { get; set; }
        public DbSet<Post> Posts { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<CategoryProduct> CategoriesProducts { get; set; }
        public DbSet<Product> Products { get; set; }
        public DbSet<Customer> Customers { get; set; }
        public DbSet<Order> Orders { get; set; }
        public DbSet<OrderDetail> OrderDetails { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Seed tài khoản test
            modelBuilder.Entity<User>().HasData(
                new User { Id = 1, Username = "admin", PasswordHash = "123456", FullName = "Quản Trị Viên", Role = "Admin" },
                new User { Id = 2, Username = "nhanvien", PasswordHash = "123456", FullName = "Nhân Viên Test", Role = "NhanVien" }
            );
        }
    }
}
