using api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace api.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class NotifyController : ControllerBase
    {
        private readonly JobiverseContext _context;

        public NotifyController(JobiverseContext context)
        {
            _context = context;
        }

        [Authorize()]
        [HttpGet("unread-count")]
        public async Task<IActionResult> GetUnreadCount()
        {
            var accountId = User.FindFirst("AccountId")?.Value;
            if (accountId == null) return Unauthorized(new { message = "Unauthorized" });
            return Ok(new
            {
                unreadCount = await _context.Notifications
                    .Where(n => n.AccountId == Guid.Parse(accountId).ToString() && n.IsRead == 0)
                    .CountAsync()
            });
        }
    }
}
