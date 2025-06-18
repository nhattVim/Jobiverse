using System.Text.Json;
using api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace api.Controllers
{
    [Route("[controller]s")]
    [Authorize]
    [ApiController]
    public class FavoriteController : ControllerBase
    {
        private readonly ILogger<FavoriteController> _logger;
        private readonly JobiverseContext _context;
        public record FavoriteDto(string projectId);

        public FavoriteController(ILogger<FavoriteController> logger, JobiverseContext context)
        {
            _logger = logger;
            _context = context;
        }

        // [HttpGet]
        // public async Task<IActionResult> GetFavorites()
        // {
        //     var accountId = User.FindFirst("AccountId")?.Value;

        //     var favorites = await _context.Favorites
        //         .AsNoTracking()
        //         .Where(f => f.AccountId == accountId)
        //         .ToListAsync();

        //     var result = favorites.Select(f => new
        //     {
        //         _id = f.FavoriteId,
        //         account = f.AccountId,
        //         createdAt = f.CreatedAt,
        //         project = _context.Projects
        //             .Where(p => p.ProjectId == f.ProjectId)
        //             .Select(p => new
        //             {
        //                 _id = p.ProjectId,
        //                 account = p.AccountId,
        //                 p.Title,
        //                 p.Description,
        //                 p.Status,
        //                 p.Location
        //             })
        //             .FirstOrDefault()
        //     });

        //     return Ok(result);
        // }

        // [HttpPost]
        // public async Task<IActionResult> AddFavorite([FromBody] FavoriteDto req)
        // {
        //     var accountId = User.FindFirst("AccountId")?.Value;
        //     if (string.IsNullOrEmpty(accountId)) return Unauthorized("You must be logged in to add a favorite.");

        //     var existingFavorite = await _context.Favorites
        //         .FirstOrDefaultAsync(f => f.ProjectId == req.projectId && f.AccountId == accountId);

        //     if (existingFavorite != null) return Conflict("This job is already in your favorites.");

        //     var favorite = new Favorite
        //     {
        //         FavoriteId = Guid.NewGuid().ToString(),
        //         AccountId = accountId,
        //         ProjectId = req.projectId,
        //     };

        //     _context.Favorites.Add(favorite);
        //     await _context.SaveChangesAsync();

        //     return Ok(new { Message = "Job added to favorites successfully." });
        // }

        // [HttpDelete("{projectId}")]
        // public async Task<IActionResult> RemoveFavorite(string? projectId)
        // {
        //     if (string.IsNullOrEmpty(projectId)) return BadRequest("Project ID is required to remove a favorite.");

        //     var accountId = User.FindFirst("AccountId")?.Value;
        //     if (string.IsNullOrEmpty(accountId)) return Unauthorized("You must be logged in to remove a favorite.");

        //     var favorite = await _context.Favorites
        //         .FirstOrDefaultAsync(f => f.ProjectId == projectId && f.AccountId == accountId);

        //     if (favorite == null) return NotFound("This job is not in your favorites.");

        //     _context.Favorites.Remove(favorite);
        //     await _context.SaveChangesAsync();

        //     return Ok(new { Message = "Job removed from favorites successfully." });
        // }
    }
}
