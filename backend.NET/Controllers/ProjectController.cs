using System.Text.Json;
using api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace api.Controllers
{
    [Route("[controller]s")]
    [ApiController]
    public class ProjectController : ControllerBase
    {
        private readonly ILogger<ProjectController> _logger;
        private readonly JobiverseContext _context;

        public ProjectController(ILogger<ProjectController> logger, JobiverseContext context)
        {
            _logger = logger;
            _context = context;
        }

        public record ProjectLocationDto(
            string? Province,
            string? District,
            string? Ward
        );

        public record ProjectDto(
            string? title,
            string? description,
            ProjectLocationDto? location,
            string? content,
            string? workingTime,
            long? salary,
            int? expRequired,
            int? hiringCount,
            DateTime? deadline,
            List<string>? major,
            List<string>? specialization,
            List<string>? applicants,
            List<string>? assignedStudents
        );

        // [HttpGet]
        // public async Task<IActionResult> GetAllProjects(
        //     [FromQuery] string? major,
        //     [FromQuery] string? spec,
        //     [FromQuery] string? expRequired,
        //     [FromQuery] string? workTypes,
        //     [FromQuery] string? sortBy,
        //     [FromQuery] string? search
        // )
        // {
        //     var query = _context.Projects
        //         .AsNoTracking()
        //         .Include(p => p.Account)
        //         .Include(p => p.Majors)
        //         .Include(p => p.Specializations)
        //         .Include(p => p.ProjectApplicants)
        //         .AsQueryable();

        //     if (!string.IsNullOrWhiteSpace(major))
        //     {
        //         var majorIds = major.Split(',').ToHashSet();
        //         query = query.Where(p => p.Majors.Any(m => majorIds.Contains(m.MajorId)));
        //     }

        //     if (!string.IsNullOrWhiteSpace(spec))
        //     {
        //         var specIds = spec.Split(',').ToHashSet();
        //         query = query.Where(p => p.Specializations.Any(s => specIds.Contains(s.SpecializationId)));
        //     }

        //     if (!string.IsNullOrWhiteSpace(expRequired))
        //     {
        //         var expList = expRequired.Split(',').Select(int.Parse).ToList();
        //         query = query.Where(p => p.ExpRequired.HasValue && expList.Contains(p.ExpRequired.Value));
        //     }

        //     if (!string.IsNullOrWhiteSpace(workTypes))
        //     {
        //         var types = workTypes.Split(',').ToHashSet();
        //         query = query.Where(p => p.WorkType != null && types.Contains(p.WorkType));
        //     }

        //     if (!string.IsNullOrWhiteSpace(search))
        //     {
        //         query = query.Where(p =>
        //             (p.Title ?? "").Contains(search) ||
        //             (p.Description ?? "").Contains(search) ||
        //             (p.ProjectLocation != null &&
        //                 ((p.ProjectLocation.Province ?? "").Contains(search) ||
        //                 (p.ProjectLocation.District ?? "").Contains(search) ||
        //                 (p.ProjectLocation.Ward ?? "").Contains(search))));
        //     }

        //     query = sortBy switch
        //     {
        //         "newest" => query.OrderByDescending(p => p.CreatedAt),
        //         "oldest" => query.OrderBy(p => p.CreatedAt),
        //         "salaryAsc" => query.OrderBy(p => p.Salary),
        //         "salaryDesc" => query.OrderByDescending(p => p.Salary),
        //         _ => query.OrderByDescending(p => p.CreatedAt)
        //     };

        //     var result = await query
        //         .Where(p => p.Account != null && (p.Account.Deleted == false))
        //         .Select(p => new
        //         {
        //             _id = p.ProjectId,
        //             account = new
        //             {
        //                 _id = p.Account.AccountId,
        //                 avatar = p.Account.Avatar == null ? null : new
        //                 {
        //                     data = Convert.ToBase64String(p.Account.Avatar),
        //                     contentType = p.Account.AvatarType
        //                 }
        //             },
        //             p.Title,
        //             p.Description,
        //             p.ProjectLocation,
        //             p.Salary,
        //             p.ExpRequired,
        //             p.WorkType,
        //             p.WorkingTime,
        //             p.HiringCount,
        //             major = p.Majors.Select(m => m.MajorId),
        //             specialization = p.Specializations.Select(s => s.SpecializationId)
        //         })
        //         .ToListAsync();

        //     return Ok(result);
        // }

        // [HttpGet("my")]
        // public async Task<IActionResult> GetMyProjects()
        // {
        //     var accountId = User.FindFirst("AccountId")?.Value;
        //     if (accountId == null) return Unauthorized("AccountId not found in token");

        //     var projects = await _context.Projects
        //         .AsNoTracking()
        //         .Where(p => p.AccountId == accountId)
        //         .ToListAsync();

        //     var result = projects.Select(p => new
        //     {
        //         _id = p.ProjectId,
        //         account = p.AccountId,
        //         p.Title,
        //         p.Description,
        //         p.ProjectLocation,
        //         p.Salary,
        //         p.ExpRequired,
        //         p.WorkType,
        //         p.WorkingTime,
        //         p.HiringCount,
        //         major = p.Majors.Select(m => m.MajorId),
        //         specialization = p.Specializations.Select(s => s.SpecializationId),
        //         applicants = p.ProjectApplicants.Select(s => s.StudentId),
        //         deadline = p.Deadline
        //     });

        //     return Ok(result);
        // }

        // [HttpPost("my")]
        // public async Task<IActionResult> CreateProject([FromBody] ProjectDto dto)
        // {
        //     var accountId = User.FindFirst("AccountId")?.Value;
        //     if (accountId == null) return Unauthorized("AccountId not found in token");

        //     _logger.LogInformation("Req {req}", JsonSerializer.Serialize(dto));

        //     var project = new Project
        //     {
        //         ProjectId = Guid.NewGuid().ToString(),
        //         Title = dto.title,
        //         Description = dto.description,
        //         ProjectLocation = dto.location != null
        //             ? new ProjectLocation
        //             {
        //                 Province = dto.location.Province,
        //                 District = dto.location.District,
        //                 Ward = dto.location.Ward
        //             }
        //             : null,
        //         AccountId = accountId,
        //         Content = dto.content,
        //         WorkingTime = dto.workingTime,
        //         Salary = dto.salary,
        //         HiringCount = dto.hiringCount,
        //         ExpRequired = dto.expRequired,
        //         Deadline = dto.deadline ?? DateTime.UtcNow.AddDays(30),
        //         Majors = await _context.Majors
        //             .Where(m => dto.major != null && dto.major.Contains(m.MajorId))
        //             .ToListAsync(),
        //         Specializations = await _context.Specializations
        //             .Where(s => dto.specialization != null && dto.specialization.Contains(s.SpecializationId))
        //             .ToListAsync(),
        //         ProjectApplicants = await _context.Students
        //             .Where(s => dto.applicants != null && dto.applicants.Contains(s.StudentId))
        //             .ToListAsync(),
        //     };

        //     _context.Projects.Add(project);
        //     await _context.SaveChangesAsync();

        //     return Ok();
        // }
    }
}
