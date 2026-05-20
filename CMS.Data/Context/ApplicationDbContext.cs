using CMS.Data.Entities;
using Microsoft.EntityFrameworkCore;

namespace CMS.Data.Context
{
    /// <summary>
    /// Lớp kết nối trung tâm dữ liệu quản lý cấu trúc bảng hệ thống CMS 
    /// </summary>
    public class ApplicationDbContext : DbContext
    {
        // Hàm khởi tạo nhận cấu hình ConnectionString từ file appsettings.json 
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {
        }

        // Đăng ký các bảng dữ liệu cốt lõi 
        public DbSet<Category> Categories { get; set; }
        public DbSet<Post> Posts { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<Customer> Customers { get; set; }
        public DbSet<Order> Orders { get; set; }

        /// <summary>
        /// Cấu hình nâng cao Fluent API và khởi tạo dữ liệu mẫu Data Seeding 
        /// </summary>
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Giữ lại các thiết lập mặc định của EF Core 
            base.OnModelCreating(modelBuilder);

            // 1. FLUENT API: Tự động cấu hình ngày giờ hiện tại cho thuộc tính CreatedDate 
            modelBuilder.Entity<Post>()
                .Property(p => p.CreatedDate)
                .HasDefaultValueSql("GETDATE()"); // 

            // 2. DELETE BEHAVIOR: Đảm bảo an toàn, không cho phép xóa danh mục khi có bài viết bên trong 
            modelBuilder.Entity<Post>()
                .HasOne(p => p.Category)
                .WithMany(c => c.Posts)
                .OnDelete(DeleteBehavior.Restrict); // 

            // 3. DATA SEEDING: Nạp sẵn danh mục bài viết mẫu ban đầu 
            modelBuilder.Entity<Category>().HasData(
                new Category { Id = 1, Name = "Tin tức", Slug = "tin-tuc" }, // 
                new Category { Id = 2, Name = "Sự kiện", Slug = "su-kien" }  // 
            );

            // 4. DATA SEEDING: Khởi tạo sẵn tài khoản quản trị mặc định của CMS 
            modelBuilder.Entity<User>().HasData(
                new User
                {
                    Id = 1,
                    Username = "admin",
                    Password = "123", // 
                    FullName = "Quản trị viên",
                    Role = "Admin" // 
                }
            );
        }
    }
}