/*
    Ho ten sinh vien: Thach Tran Trung Nhan
    Ma sv: 2123110136
    Ngay tao: 28 / 05 / 2026
 */

using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CMS.Data;

namespace CMS.Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PostsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public PostsController(ApplicationDbContext context)
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

        // GET: api/posts
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var posts = await _context.Posts
                .OrderByDescending(p => p.Id)
                .Select(p => new
                {
                    p.Id,
                    p.Title,
                    p.ImageUrl,
                    p.CreatedDate,
                    CategoryName = p.Category.Name
                })
                .ToListAsync();

            var result = posts.Select(p => new
            {
                p.Id,
                p.Title,
                ImageUrl = GetFullImageUrl(p.ImageUrl),
                p.CreatedDate,
                p.CategoryName
            });

            return Ok(result);
        }

        // GET: api/posts/category/{categoryId}
        [HttpGet("category/{categoryId}")]
        public async Task<IActionResult> GetByCategory(int categoryId)
        {
            var posts = await _context.Posts
                .Where(p => p.CategoryId == categoryId)
                .OrderByDescending(p => p.Id)
                .Select(p => new
                {
                    p.Id,
                    p.Title,
                    p.ImageUrl,
                    p.CreatedDate,
                    CategoryName = p.Category.Name
                })
                .ToListAsync();

            var result = posts.Select(p => new
            {
                p.Id,
                p.Title,
                ImageUrl = GetFullImageUrl(p.ImageUrl),
                p.CreatedDate,
                p.CategoryName
            });

            return Ok(result);
        }

        // GET: api/posts/{id}
        [HttpGet("{id}")]
        public async Task<IActionResult> GetDetail(int id)
        {
            var post = await _context.Posts
                .Where(p => p.Id == id)
                .Select(p => new
                {
                    p.Id,
                    p.Title,
                    p.Content,
                    p.ImageUrl,
                    p.CreatedDate,
                    p.CategoryId,
                    CategoryName = p.Category.Name
                })
                .FirstOrDefaultAsync();

            if (post == null)
            {
                return NotFound(new { message = "Không tìm thấy bài viết" });
            }

            return Ok(new
            {
                post.Id,
                post.Title,
                post.Content,
                ImageUrl = GetFullImageUrl(post.ImageUrl),
                post.CreatedDate,
                post.CategoryId,
                post.CategoryName
            });
        }
    }
}
