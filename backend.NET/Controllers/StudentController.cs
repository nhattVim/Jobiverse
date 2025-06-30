using System.Text.Json.Serialization;
using System.Xml.Linq;
using api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace api.Controllers
{
    [Route("[controller]s")]
    [Authorize(Roles = "student")]
    [ApiController]
    public class StudentController : ControllerBase
    {
        private readonly JobiverseContext _context;
        private readonly ILogger<CVController> _logger;

        public record StudentProfileDto
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

        [HttpGet]
        public IActionResult getAllProfiles()
        {
            return StatusCode(200, _context.Students.ToList());
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> getProfileById(string id)
        {
            try
            {
                var student = await _context.Students.SingleOrDefaultAsync(t => t.StudentId.Equals(id));
                if (student == null)
                {
                    return BadRequest("Student not exist!");
                }
                return StatusCode(200, student);
            }

            catch
            {
                return BadRequest();
            }
        }

        [HttpGet("me")]
        public async Task<IActionResult> getMyProfile()
        {
            try
            {
                var accountId = User.FindFirst("AccountId")?.Value;
                if (accountId == null) return Unauthorized("AccountId not found in token");

                var profile = await _context.Students
                    .FirstOrDefaultAsync(s => s.AccountId == accountId);
                if (profile == null) return NotFound("Profile not found");

                var result = new
                {
                    _id = profile.StudentId,
                    mssv = profile.Mssv,
                    name = profile.Name,
                    major = profile.MajorId,
                    spec = profile.SpecializationId,
                    university = profile.University
                };

                return Ok(result);
            }
            catch
            {
                return BadRequest();
            }
        }

        [HttpPost("me")]
        public async Task<IActionResult> createProfile([FromBody] StudentProfileDto req)
        {
            try
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
            catch
            {
                return BadRequest();
            }
        }

        [HttpPut("me")]
        public async Task<IActionResult> updateMyProfile([FromBody] StudentProfileDto req)
        {
            try
            {
                var accountId = User.FindFirst("AccountId")?.Value;
                if (accountId == null) return Unauthorized("AccountId not found in token");

                var student = await _context.Students.SingleOrDefaultAsync(t => t.AccountId.Equals(accountId));
                if (student == null)
                {
                    return BadRequest("Student not exist!");
                }
                student.Mssv = req.mssv;
                student.Name = req.name;
                student.MajorId = req.major;
                student.SpecializationId = req.spec;
                student.University = req.university;
                await _context.SaveChangesAsync();

                return StatusCode(200);
            }
            catch
            {
                return BadRequest();
            }
        }
    }
}
