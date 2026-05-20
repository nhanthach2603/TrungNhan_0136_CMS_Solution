using CMS.Data.Entities; // Nhúng thư mục Entities vào để sử dụng lớp Category và Post
using Microsoft.EntityFrameworkCore; // Thư viện gốc của Entity Framework Core

namespace CMS.Data
{
    /// <summary>
    /// Lớp quản lý ngữ cảnh dữ liệu (DbContext).
    /// Đóng vai trò là cầu nối trung gian giữa code C# và Cơ sở dữ liệu SQL Server.
    /// </summary>
    public class CMSDbContext : DbContext
    {
        // Hàm khởi tạo (Constructor) nhận cấu hình kết nối (ConnectionString) từ bên ngoài (Program.cs) truyền vào
        public CMSDbContext(DbContextOptions<CMSDbContext> options) : base(options)
        {
        }

        // Khai báo tập hợp thực thể Categories, Entity Framework sẽ dựa vào đây để tạo ra bảng "Categories" trong SQL
        public DbSet<Category> Categories { get; set; }

        // Khai báo tập hợp thực thể Posts, Entity Framework sẽ dựa vào đây để tạo ra bảng "Posts" trong SQL
        public DbSet<Post> Posts { get; set; }
        // Khai báo tập hợp thực thể user , Entity Framework sẽ dựa vào đây để tạo ra bảng "user" trong SQL
        public DbSet<User> Users { get; set; }
        // Khai báo tập hợp thực thể Customers , Entity Framework sẽ dựa vào đây để tạo ra bảng "Customers" trong SQL
        public DbSet<Customer> Customers { get; set; }
        // Sau này có thêm bảng Product, Order thì khai báo tương tự tại đây...
    }
}