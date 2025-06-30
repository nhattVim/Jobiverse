using api.DTOs;
using api.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace api.Controllers
{
    [Route("[controller]s")]
    [ApiController]
    public class SpecController : ControllerBase
    {
        private readonly JobiverseContext _context;

        public SpecController(JobiverseContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetSpecs()
        {
            var specs = await _context.Specializations.ToListAsync();
            var specsDto = specs.Select(s => new SpecDto
            (
                s.SpecializationId,
                s.MajorId,
                s.Name,
                s.Description
            )).ToList();

            return Ok(specsDto);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetSpecById(string id)
        {
            var spec = await _context.Specializations.FindAsync(id);
            if (spec == null) return NotFound();
            var specDto = new SpecDto
            (
                spec.SpecializationId,
                spec.MajorId,
                spec.Name,
                spec.Description
            );

            return Ok(specDto);
        }
    }
}
