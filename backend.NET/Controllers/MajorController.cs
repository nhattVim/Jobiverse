using api.DTOs;
using api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace api.Controllers
{
    [Route("[controller]s")]
    [ApiController]
    public class MajorController : ControllerBase
    {
        private readonly JobiverseContext _context;

        public MajorController(JobiverseContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetMajors()
        {
            var majors = await _context.Majors.ToListAsync();
            var majorsDto = majors.Select(m => new MajorDto(
                m.MajorId,
                m.Name,
                m.Description
            )).ToList();

            return Ok(majorsDto);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetMajorById(string id)
        {
            var major = await _context.Majors.FindAsync(id);
            if (major == null) return NotFound();
            var majorDto = new MajorDto
            (
                major.MajorId,
                major.Name,
                major.Description
            );

            return Ok(majorDto);
        }
    }
}
