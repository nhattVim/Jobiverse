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
    [ApiController]
    public class EmployerController : ControllerBase
    {
        private readonly JobiverseContext _context;

        public EmployerController(JobiverseContext context)
        {
            _context = context;
        }

        public record EmployerProfileDto
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

        [Authorize(Roles = "employer")]
        [HttpGet]
        public IActionResult getAllProfiles()
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

        [Authorize]
        [HttpGet("{id}")]
        public async Task<IActionResult> GetProfileById(string id)
        {
            try
            {
                var employer = await _context.Employers
                    .AsNoTracking()
                    .Include(e => e.Account)
                    .SingleOrDefaultAsync(e => e.AccountId == id);

                if (employer == null || employer.Account == null || employer.Account.Deleted == true)
                {
                    return NotFound(new { message = "Không tìm thấy employer hoặc tài khoản đã bị xoá" });
                }

                var result = new
                {
                    employer.AccountId,
                    employer.CompanyName,
                    employer.Industry,
                    employer.CompanyInfo,
                    employer.Address,
                    account = new
                    {
                        employer.Account.Email,
                        employer.Account.Avatar,
                        employer.Account.Deleted
                    }
                };

                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Lỗi khi lấy thông tin employer", error = ex.Message });
            }
        }

        [Authorize(Roles = "employer")]
        [HttpGet("me")]
        public async Task<IActionResult> getMyProfile()
        {
            try
            {
                var accountId = User.FindFirst("AccountId")?.Value;
                if (accountId == null) return Unauthorized("AccountId not found in token");

                var profile = await _context.Employers
                    .FirstOrDefaultAsync(s => s.AccountId == accountId);
                if (profile == null) return NotFound("Profile not found");

                var result = new EmployerProfileDto
                {
                    BusinessScale = profile.BusinessScale,
                    CompanyName = profile.CompanyName,
                    RepresentativeName = profile.RepresentativeName,
                    Position = profile.Position,
                    Industry = profile.Industry,
                    CompanyInfo = profile.CompanyInfo,
                    Prove = profile.Prove,
                    Address = profile.Address
                };
                return Ok(result);
            }
            catch
            {
                return StatusCode(500);
            }
        }

        [Authorize(Roles = "employer")]
        [HttpPost("me")]
        public async Task<IActionResult> createProfile([FromBody] EmployerProfileDto req)
        {
            try
            {
                var accountId = User.FindFirst("AccountId")?.Value;
                if (accountId == null) return Unauthorized("AccountId not found in token");

                if (req.BusinessScale != "Private individuals" && req.BusinessScale != "Companies")
                {
                    return BadRequest("Invalid BusinessScale. Must be 'Private individuals' or 'Companies'.");
                }

                var profile = new Employer
                {
                    EmployerId = Guid.NewGuid().ToString(),
                    AccountId = accountId,
                    BusinessScale = req.BusinessScale,
                    CompanyName = req.CompanyName,
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

        [Authorize(Roles = "employer")]
        [HttpPut("me")]
        public async Task<IActionResult> updateMyProfile([FromBody] EmployerProfileDto req)
        {
            try
            {
                var accountId = User.FindFirst("AccountId")?.Value;
                if (accountId == null) return Unauthorized("AccountId not found in token");

                var employer = await _context.Employers.SingleOrDefaultAsync(t => t.AccountId.Equals(accountId));
                if (employer == null)
                    return BadRequest("Student not exist!");

                if (req.BusinessScale != "Private individuals" && req.BusinessScale != "Companies")
                {
                    return BadRequest("Invalid BusinessScale. Must be 'Private individuals' or 'Companies'.");
                }

                employer.BusinessScale = req.BusinessScale;
                employer.CompanyName = req.CompanyName;
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
    }
}
