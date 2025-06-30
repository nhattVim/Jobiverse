using System.ComponentModel.DataAnnotations;
using System.Text.Json;
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
        public class ChangeAvatarRequest
        {
            [Required]
            public IFormFile Avatar { get; set; } = null!;
        }

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

            string? name = null;

            if (account.AccountRole == "student")
            {
                var student = await _context.Students
                    .AsNoTracking()
                    .Where(s => s.AccountId == account.AccountId)
                    .FirstOrDefaultAsync();

                if (student != null && student.Name != null) name = student.Name;
            }
            else if (account.AccountRole == "employer")
            {
                var employer = await _context.Employers
                    .AsNoTracking()
                    .Where(e => e.AccountId == account.AccountId)
                    .FirstOrDefaultAsync();

                if (employer != null && employer.CompanyName != null) name = employer.CompanyName;
            }

            var dto = new
            {
                _id = account.AccountId,
                role = account.AccountRole,
                authProvider = account.AuthProvider,
                email = account.Email!,
                profile = account.Profile,
                name
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

        [Authorize()]
        [HttpPut("update-password")]
        public async Task<IActionResult> UpdatePassword([FromBody] JsonDocument body)
        {
            try
            {
                var accountId = User.FindFirst("AccountId")?.Value;
                if (accountId == null)
                    return Unauthorized(new { message = "Unauthorized" });

                var account = await _context.Accounts.FindAsync(accountId);
                if (account == null)
                    return NotFound(new { message = "Tài khoản không tồn tại" });

                var root = body.RootElement;

                string? currentPassword = root.TryGetProperty("currentPassword", out var cp) ? cp.GetString() : null;
                string? newPassword = root.TryGetProperty("newPassword", out var np) ? np.GetString() : null;

                if (string.IsNullOrWhiteSpace(newPassword))
                    return BadRequest(new { message = "Vui lòng nhập mật khẩu mới" });

                bool hasPassword = !string.IsNullOrWhiteSpace(account.Password);

                if (hasPassword)
                {
                    if (string.IsNullOrWhiteSpace(currentPassword))
                        return BadRequest(new { message = "Vui lòng nhập mật khẩu hiện tại" });

                    bool isMatch = BCrypt.Net.BCrypt.Verify(currentPassword, account.Password);
                    if (!isMatch)
                        return BadRequest(new { message = "Mật khẩu hiện tại không đúng." });
                }

                account.Password = BCrypt.Net.BCrypt.HashPassword(newPassword);
                await _context.SaveChangesAsync();

                return Ok(new
                {
                    message = hasPassword
                        ? "Đổi mật khẩu thành công."
                        : "Thiết lập mật khẩu thành công."
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    message = "Lỗi máy chủ khi thay đổi mật khẩu",
                    error = ex.Message
                });
            }
        }

        [Authorize]
        [HttpPut("update-phone")]
        public async Task<IActionResult> UpdatePhone([FromBody] JsonDocument body)
        {
            try
            {
                var accountId = User.FindFirst("AccountId")?.Value;
                if (accountId == null) return Unauthorized(new { message = "Chưa đăng nhập" });

                var root = body.RootElement;

                string? newPhone = root.TryGetProperty("phone", out var phoneProp) ? phoneProp.GetString() : null;

                if (string.IsNullOrWhiteSpace(newPhone))
                    return BadRequest(new { message = "Vui lòng nhập số điện thoại mới" });

                var phoneExists = await _context.Accounts
                    .Where(a => a.PhoneNumber == newPhone && a.AccountId != accountId)
                    .FirstOrDefaultAsync();

                if (phoneExists != null)
                    return Conflict(new { message = "Số điện thoại đã được sử dụng bởi tài khoản khác" });

                var account = await _context.Accounts.FindAsync(accountId);
                if (account == null)
                    return NotFound(new { message = "Không tìm thấy tài khoản" });

                account.PhoneNumber = newPhone;
                await _context.SaveChangesAsync();

                return Ok(new { message = "Cập nhật số điện thoại thành công" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    message = "Lỗi máy chủ khi cập nhật số điện thoại",
                    error = ex.Message
                });
            }
        }

        [Authorize]
        [HttpPut("avatar")]
        public async Task<IActionResult> changeAvatar([FromForm] ChangeAvatarRequest req)
        {
            var accountId = User.FindFirst("AccountId")?.Value;
            if (accountId == null) return Unauthorized(new { message = "Chưa đăng nhập" });

            if (req.Avatar == null || req.Avatar.Length == 0)
                return BadRequest(new { message = "Vui lòng chọn ảnh đại diện mới" });

            var account = await _context.Accounts.FindAsync(accountId);
            if (account == null) return NotFound(new { message = "Không tìm thấy tài khoản" });

            using var memoryStream = new MemoryStream();
            await req.Avatar.CopyToAsync(memoryStream);

            account.Avatar = memoryStream.ToArray();
            account.AvatarType = req.Avatar.ContentType;

            _context.Accounts.Update(account);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Cập nhật ảnh đại diện thành công" });
        }
    }
}
