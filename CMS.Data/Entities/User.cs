/*
    Ho ten sinh vien: Thach Tran Trung Nhan
    Ma sv: 2123110136
    Ngay tao: 15 / 05 / 2026
 */

namespace CMS.Data.Entities
{
    // thuc the nhan vien quan tri
    public class User
    {
        public int Id { get; set; }
        public string Username { get; set; }
        public string PasswordHash { get; set; }
        public string FullName { get; set; }
        public string Role { get; set; } // Quản trị viên hoặc Biên tập viên
    }
}