using System.ComponentModel.DataAnnotations;

namespace CMS.Data.Entities
{
    public class BannerImage
    {
        [Key]
        public int Id { get; set; }

        [Required(ErrorMessage = "Tên banner không được để trống")]
        public string Name { get; set; }

        public string? ImageUrl { get; set; }

        public string? LinkUrl { get; set; }

        public int SortOrder { get; set; } = 0;

        public bool IsActive { get; set; } = true;
    }
}
