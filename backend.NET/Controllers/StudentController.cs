using System.Text.Json.Serialization;
using api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace api.Controllers
{
    [Route("[controller]s")]
    [Authorize(Roles = "student")]
    [ApiController]
    public class StudentController : ControllerBase
    {
        private readonly JobiverseContext _context;
        private readonly ILogger<CVController> _logger;

        public record ProfileDto
        {
            public string? name { get; init; }
            public string? mssv { get; init; }
            public string? major { get; init; }
            public string? university { get; init; }

            [JsonPropertyName("specialization")]
            public string? spec { get; init; }
        }

        public StudentController(JobiverseContext context, ILogger<CVController> logger)
        {
            _context = context;
            _logger = logger;
        }

        [HttpGet("me")]
        public async Task<IActionResult> GetMyProfile()
        {
            var accountId = User.FindFirst("AccountId")?.Value;
            if (accountId == null) return Unauthorized("AccountId not found in token");

            var profile = await _context.Students
                .FirstOrDefaultAsync(s => s.AccountId == accountId);
            if (profile == null) return NotFound("Profile not found");

            var result = new ProfileDto
            {
                mssv = profile.Mssv,
                name = profile.Name,
                major = profile.MajorId,
                spec = profile.SpecializationId,
                university = profile.University
            };

            return Ok(result);
        }

        [HttpPost]
        public async Task<IActionResult> CreateProfile([FromBody] ProfileDto req)
        {
            var accountId = User.FindFirst("AccountId")?.Value;
            if (accountId == null) return Unauthorized("AccountId not found in token");

            if (await _context.Students.AnyAsync(s => s.AccountId == accountId))
                return BadRequest("Profile already exists");

            var profile = new Student
            {
                StudentId = Guid.NewGuid().ToString(),
                AccountId = accountId,
                Mssv = req.mssv,
                Name = req.name,
                MajorId = req.major,
                SpecializationId = req.spec,
                University = req.university
            };

            _context.Students.Add(profile);
            await _context.SaveChangesAsync();

            return StatusCode(201, profile);
        }
    }
}
