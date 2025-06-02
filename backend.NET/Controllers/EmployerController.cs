using api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Text.Json.Serialization;
using static api.Controllers.StudentController;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace api.Controllers
{
    [Route("[controller]s")]
    [Authorize(Roles = "employer")]
    [ApiController]
    public class EmployerController : ControllerBase
    {
        private readonly JobiverseContext _context;

        public EmployerController(JobiverseContext context)
        {
            _context = context;
        }
        public record ProfileDto
        {
            public string? BusinessScale { get; init; }
            public string? CompanyName { get; init; }
            public string? RepresentativeName { get; init; }
            public string? Position { get; init; }
            public string? Industry { get; init; }
            public string? CompanyInfo { get; init; }
            public string? Prove { get; init; }
            public string? Address { get; init; }
        }
        [HttpGet]
        public IActionResult GetAllEmployer()
        {
            try
            {
                if (_context == null || _context.Employers == null)
                    return StatusCode(500, "Database context is not initialized");

                var employers = _context.Employers.ToList();

                if (employers.Count > 0)
                    return StatusCode(200, employers);

                return StatusCode(404, "No employers found");
            }
            catch 
            {
                // Gợi ý: log lỗi ex.Message để tiện debug
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpGet("me")]
        public async Task<IActionResult> GetMyProfile()
        {
            try
            {
                var accountId = User.FindFirst("AccountId")?.Value;
                if (accountId == null) return Unauthorized("AccountId not found in token");

                var profile = await _context.Employers
                    .FirstOrDefaultAsync(s => s.AccountId == accountId);
                if (profile == null) return NotFound("Profile not found");

                var result = new ProfileDto
                {
                    BusinessScale = profile.BusinessScale,
                    CompanyName = profile.CompanyInfo,
                    RepresentativeName = profile.RepresentativeName,
                    Position = profile.Position,
                    Industry = profile.Industry,
                    CompanyInfo = profile.CompanyInfo,
                    Prove = profile.Prove,
                    Address = profile.Address
                };
                return Ok(result);
            } catch
            {
                return StatusCode(500);
            }
        }

        [HttpPost]
        public async Task<IActionResult> CreateProfile([FromBody] ProfileDto req)
        {
            try
            {
                var accountId = User.FindFirst("AccountId")?.Value;
                if (accountId == null) return Unauthorized("AccountId not found in token");

                var profile = new Employer
                {
                    EmployerId = Guid.NewGuid().ToString(),
                    AccountId = accountId,
                    BusinessScale = req.BusinessScale,
                    CompanyName = req.CompanyInfo,
                    RepresentativeName = req.RepresentativeName,
                    Position = req.Position,
                    Industry = req.Industry,
                    CompanyInfo = req.CompanyInfo,
                    Prove = req.Prove,
                    Address = req.Address
                };

                _context.Employers.Add(profile);
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

                var employer = await _context.Employers.SingleOrDefaultAsync(t => t.AccountId.Equals(accountId));
                if (employer == null)
                {
                    return BadRequest("Student not exist!");
                }
                employer.BusinessScale = req.BusinessScale;
                employer.CompanyName = req.CompanyInfo;
                employer.RepresentativeName = req.RepresentativeName;
                employer.Position = req.Position;
                employer.Industry = req.Industry;
                employer.CompanyInfo = req.CompanyInfo;
                employer.Prove = req.Prove;
                employer.Address = req.Address;
                await _context.SaveChangesAsync();

                return StatusCode(200);
            }
            catch
            {
                return BadRequest();
            }
        }

        [HttpGet("search")]
        public async Task<IActionResult> SearchEmployer([FromQuery] string companyName,  [FromQuery] string representativeName)
        {
            try
            {
                var query = _context.Employers.AsQueryable();

                if (!string.IsNullOrEmpty(companyName))
                {
                    query = query.Where(s => s.CompanyName == companyName);
                }
                if (!string.IsNullOrEmpty(representativeName))
                {
                    query = query.Where(s => s.RepresentativeName == representativeName);
                }

                var results = query.Select(profile => new ProfileDto
                {
                    BusinessScale = profile.BusinessScale,
                    CompanyName = profile.CompanyInfo,
                    RepresentativeName = profile.RepresentativeName,
                    Position = profile.Position,
                    Industry = profile.Industry,
                    CompanyInfo = profile.CompanyInfo,
                    Prove = profile.Prove,
                    Address = profile.Address
                }).ToList();
                return StatusCode(200, results);
            }
            catch
            {
                return BadRequest();
            }
        }
    }
}
