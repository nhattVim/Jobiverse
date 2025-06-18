using api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace api.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class AccountController : ControllerBase
    {
        private readonly JobiverseContext _context;

        public AccountController(JobiverseContext context)
        {
            _context = context;
        }

        [Authorize()]
        [HttpGet("detail")]
        public async Task<IActionResult> GetAccountDetail()
        {
            var accountId = User.FindFirst("AccountId")?.Value;
            if (accountId == null) return Unauthorized(new { message = "Unauthorized" });

            var account = await _context.Accounts
                .AsNoTracking()
                .Where(a => a.AccountId == Guid.Parse(accountId).ToString())
                .FirstOrDefaultAsync();

            if (account == null) return NotFound(new { message = "Account not found" });

            var dto = new
            {
                _id = account.AccountId,
                role = account.AccountRole,
                authProvider = account.AuthProvider,
                email = account.Email!,
                profile = account.Profile
            };

            return Ok(dto);
        }

        [Authorize()]
        [HttpGet("avatar")]
        public async Task<IActionResult> GetAccountAvatar()
        {
            var accountId = HttpContext.User.FindFirst("AccountId")?.Value;
            if (accountId == null) return Unauthorized(new { message = "Unauthorized" });

            var account = await _context.Accounts
                .AsNoTracking()
                .Where(a => a.AccountId == Guid.Parse(accountId).ToString())
                .FirstOrDefaultAsync();

            if (account == null) return NotFound(new { message = "Account not found" });

            if (account.Avatar != null && !string.IsNullOrEmpty(account.AvatarType))
            {
                return File(account.Avatar, account.AvatarType);
            }
            else
            {
                return NotFound(new { message = "Avatar not found" });
            }
        }

        [Authorize()]
        [HttpPut("profile")]
        public async Task<IActionResult> HasProfile()
        {
            var accountId = User.FindFirst("AccountId")?.Value;
            if (accountId == null) return Unauthorized(new { message = "Chưa đăng nhập" });

            var account = await _context.Accounts
                .Where(a => a.AccountId == accountId)
                .FirstOrDefaultAsync();

            if (account == null) return NotFound(new { message = "Tài khoản không tồn tại" });
            account.Profile = true;

            _context.Accounts.Update(account);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Đã cập nhật trạng thái có profile" });
        }

        [Authorize()]
        [HttpGet("has-password")]
        public async Task<IActionResult> HasPassword()
        {
            var accountId = User.FindFirst("AccountId")?.Value;
            if (accountId == null) return Unauthorized(new { message = "Unauthorized" });

            return Ok(new
            {
                hasPassword = await _context.Accounts
                    .Where(a => a.AccountId == accountId && a.Password != null)
                    .AnyAsync()
            });
        }
    }
}
