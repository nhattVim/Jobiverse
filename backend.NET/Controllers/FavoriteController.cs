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

        [HttpPost]
        public async Task<IActionResult> SaveFavorite([FromBody] FavoriteDto dto)
        {
            var accountId = User.FindFirst("AccountId")?.Value;
            if (accountId == null)
                return Unauthorized("AccountId not found in token");

            var project = await _context.Projects.FindAsync(dto.projectId);
            if (project == null)
                return NotFound(new { message = "Project not found" });

            var existingFavorite = await _context.Set<Favorite>()
                .FirstOrDefaultAsync(f => f.AccountId == accountId && f.ProjectId == dto.projectId);

            if (existingFavorite != null)
                return BadRequest(new { message = "This project is already in your favorites" });

            var favorite = new Favorite
            {
                AccountId = accountId,
                ProjectId = dto.projectId
            };

            _context.Add(favorite);
            await _context.SaveChangesAsync();

            return StatusCode(201, new { message = "Project saved to favorites successfully", favorite });
        }

        [HttpGet]
        public async Task<IActionResult> GetFavorites()
        {
            var accountId = User.FindFirst("AccountId")?.Value;
            if (accountId == null)
                return Unauthorized("AccountId not found in token");

            var existingProjectIds = await _context.Projects
                .Select(p => p.ProjectId)
                .ToListAsync();

            var favorites = await _context.Set<Favorite>()
                .Where(f => f.AccountId == accountId)
                .Include(f => f.Project)
                    .ThenInclude(p => p.Account)
                .Include(f => f.Project)
                    .ThenInclude(p => p.ProjectLocation)
                .OrderByDescending(f => f.Project.CreatedAt)
                .ToListAsync();

            var validFavorites = favorites
                .Where(f => f.Project != null && existingProjectIds.Contains(f.ProjectId))
                .ToList();

            var result = new List<object>();

            foreach (var fav in validFavorites)
            {
                object? profile = null;
                var project = fav.Project;
                if (project?.Account != null)
                {
                    if (project.Account.AccountRole == "student")
                    {
                        var student = await _context.Set<Student>()
                            .AsNoTracking()
                            .FirstOrDefaultAsync(s => s.AccountId == project.Account.AccountId);
                        if (student != null)
                            profile = new { name = student.Name };
                    }
                    else if (project.Account.AccountRole == "employer")
                    {
                        var employer = await _context.Set<Employer>()
                            .AsNoTracking()
                            .FirstOrDefaultAsync(e => e.AccountId == project.Account.AccountId);
                        if (employer != null)
                            profile = new { companyName = employer.CompanyName };
                    }
                }

                result.Add(new
                {
                    //favoriteId = new { fav.AccountId, fav.ProjectId },
                    fav.CreatedAt,
                    project = new
                    {
                        _id = project?.ProjectId,
                        project?.Title,
                        location = project?.ProjectLocation == null ? null : new
                        {
                            project.ProjectLocation.Province,
                            project.ProjectLocation.District,
                            project.ProjectLocation.Ward
                        },
                        project?.Status,
                        project?.Salary,
                        project?.WorkType,
                        account = project?.Account == null ? null : new
                        {
                            role = project.Account.AccountRole,
                            avatar = project.Account.Avatar == null ? null : new
                            {
                                data = Convert.ToBase64String(project.Account.Avatar),
                                contentType = project.Account.AvatarType
                            }
                        },
                        profile,
                    }
                });
            }

            return Ok(result);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> RemoveFavorite(string id)
        {
            var accountId = User.FindFirst("AccountId")?.Value;
            if (accountId == null)
                return Unauthorized("AccountId not found in token");

            var favorite = await _context.Set<Favorite>()
                .FirstOrDefaultAsync(f => f.AccountId == accountId && f.ProjectId == id);

            if (favorite == null)
                return NotFound(new { message = "Favorite not found" });

            _context.Remove(favorite);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Favorite removed successfully" });
        }
    }
}
