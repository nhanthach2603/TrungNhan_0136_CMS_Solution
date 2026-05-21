/*
    Ho ten sinh vien: Thach Tran Trung Nhan
    Ma sv: 2123110136
    Ngay tao: 15 / 05 / 2026
 */


namespace CMS.Data.Entities
{
    // thuc the danh muc bai viet
    public class Category
    {
        public int Id { get; set; }
        public string Name { get; set; } // Tên danh mục (vd: Tin Giáo Dục)
        public string Description { get; set; }

        // Quan hệ: Một danh mục có nhiều bài viết
        public virtual ICollection<Post> Posts { get; set; }
    }
}