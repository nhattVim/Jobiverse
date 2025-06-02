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
        [HttpGet]
        public IActionResult GetAllStudent()
        {
            return StatusCode(200, _context.Students.ToList());
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetStudentByIDAsync(string id)
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
        public async Task<IActionResult> GetMyProfile()
        {
            try
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
            } catch {
                return BadRequest();
            }
        }

        [HttpPost]
        public async Task<IActionResult> CreateProfile([FromBody] ProfileDto req)
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

        [HttpPut]
        public async Task<IActionResult> UpdateProfile([FromBody] ProfileDto req)
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

        [HttpGet("search")]
        public async Task<IActionResult> SearchStudent([FromQuery] string mssv, [FromQuery] string name)
        {
            try
            {
                var query = _context.Students.AsQueryable();

                if (!string.IsNullOrEmpty(mssv))
                {
                    query = query.Where(s => s.Mssv == mssv);
                }
                if (!string.IsNullOrEmpty(name))
                {
                    query = query.Where(s => s.Name == name);
                }

                var results = query.Select(student => new ProfileDto
                {
                    mssv = student.Mssv,
                    name = student.Name,
                    major = student.MajorId,
                    spec = student.SpecializationId,
                    university = student.University
                }).ToList();
                return StatusCode(200, results);
            }
            catch
            {
                return BadRequest();
            }
        }

        // recommend students by major 
        [HttpGet("recommend/{id}")]
        public async Task<IActionResult> RecommendStudents(string id, [FromQuery] string major, [FromQuery] string specialization)
        {
            try
            {
                var query = _context.Students.AsQueryable();

                if (!string.IsNullOrEmpty(specialization))
                {
                    query = query.Where(s => s.SpecializationId == specialization);
                }

                if (!string.IsNullOrEmpty(major))
                {
                    query = query.Where(s => s.MajorId == major);
                }

                var results = await query.Select(student => new ProfileDto
                {
                    mssv = student.Mssv,
                    name = student.Name,
                    major = student.MajorId,
                    spec = student.SpecializationId,
                    university = student.University
                }).ToListAsync();
                return Ok(results);
            }
            catch
            {
               return BadRequest();
            }
        }
    }
}
