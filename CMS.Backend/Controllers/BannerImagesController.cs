using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CMS.Data;

namespace CMS.Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BannerImagesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public BannerImagesController(ApplicationDbContext context)
        {
            _context = context;
        }

        private string GetFullImageUrl(string? imageUrl)
        {
            if (string.IsNullOrEmpty(imageUrl)) return imageUrl!;
            if (imageUrl.StartsWith("http")) return imageUrl;
            var request = HttpContext.Request;
            return $"{request.Scheme}://{request.Host}{imageUrl}";
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var banners = await _context.BannerImages
                .Where(b => b.IsActive)
                .OrderBy(b => b.SortOrder)
                .Select(b => new
                {
                    b.Id,
                    b.Name,
                    ImageUrl = b.ImageUrl,
                    b.LinkUrl,
                    b.SortOrder,
                    b.IsActive
                })
                .ToListAsync();

            var result = banners.Select(b => new
            {
                b.Id,
                b.Name,
                ImageUrl = GetFullImageUrl(b.ImageUrl),
                b.LinkUrl,
                b.SortOrder,
                b.IsActive
            });

            return Ok(result);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var b = await _context.BannerImages.FindAsync(id);
            if (b == null) return NotFound();
            return Ok(new
            {
                b.Id,
                b.Name,
                ImageUrl = GetFullImageUrl(b.ImageUrl),
                b.LinkUrl,
                b.SortOrder,
                b.IsActive
            });
        }
    }
}
