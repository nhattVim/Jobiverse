using api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace api.Controllers
{
    [Authorize(Roles = "employer,student")]
    [Route("[controller]")]
    [ApiController]
    public class NotifyController : ControllerBase
    {
        private readonly JobiverseContext _context;

        public NotifyController(JobiverseContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetNotifications()
        {
            var accountId = User.FindFirst("AccountId")?.Value;
            if (accountId == null) return Unauthorized(new { message = "Unauthorized" });

            var notifications = await _context.Notifications
                .Where(n => n.AccountId == accountId && n.Deleted != true)
                .OrderByDescending(n => n.CreatedAt)
                .ToListAsync();

            var result = notifications.Select(c => new
            {
                _id = c.NotificationId,
                content = c.Content,
                createdAt = c.CreatedAt
            }).ToList();

            return Ok(result);
        }

        [HttpGet("unread-count")]
        public async Task<IActionResult> GetUnreadCount()
        {
            var accountId = User.FindFirst("AccountId")?.Value;
            if (accountId == null) return Unauthorized(new { message = "Unauthorized" });

            try
            {
                var unreadCount = await _context.Notifications
                    .Where(n => n.AccountId == accountId && n.IsRead == 0 && n.Deleted != true)
                    .CountAsync();

                return Ok(new { unreadCount });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Internal server error", error = ex.Message });
            }
        }

        [HttpPut("mark-as-read")]
        public async Task<IActionResult> MarkAsRead()
        {
            var accountId = User.FindFirst("AccountId")?.Value;
            if (accountId == null) return Unauthorized(new { message = "Unauthorized" });

            try
            {
                var notifications = await _context.Notifications
                    .Where(n => n.AccountId == accountId && n.IsRead == 0 && n.Deleted != true)
                    .ToListAsync();

                if (notifications.Count == 0)
                {
                    return Ok(new { message = "No unread notifications found" });
                }

                foreach (var notification in notifications)
                {
                    notification.IsRead = 1;
                }

                await _context.SaveChangesAsync();

                return Ok(new { message = "All notifications marked as read" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Internal server error", error = ex.Message });
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteNotification(string id)
        {
            var accountId = User.FindFirst("AccountId")?.Value;
            if (accountId == null) return Unauthorized(new { message = "Chưa đăng nhập" });

            try
            {
                var notification = await _context.Notifications
                    .FirstOrDefaultAsync(n => n.NotificationId == id && n.AccountId == accountId);

                if (notification == null)
                    return NotFound(new { message = "Notification not found" });

                notification.Deleted = true;
                await _context.SaveChangesAsync();

                return Ok(new { message = "Notification deleted successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Internal server error", error = ex.Message });
            }
        }

        [HttpDelete()]
        public async Task<IActionResult> DeleteAllNotifications()
        {
            var accountId = User.FindFirst("AccountId")?.Value;
            if (accountId == null) return Unauthorized(new { message = "Unauthorized" });

            try
            {
                var notifications = await _context.Notifications
                    .Where(n => n.AccountId == accountId && n.Deleted != true)
                    .ToListAsync();

                if (notifications.Count == 0)
                    return NotFound(new { message = "No notifications found" });

                foreach (var notification in notifications)
                {
                    notification.Deleted = true;
                }

                await _context.SaveChangesAsync();

                return Ok(new { message = "All notifications deleted successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Internal server error", error = ex.Message });
            }
        }
    }
}
