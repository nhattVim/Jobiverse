using System.ComponentModel.DataAnnotations;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Text.Json;
using api.Models;
using api.Settings;
using Google.Apis.Auth;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;

namespace api.Controllers
{
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly JobiverseContext _context;
        private readonly JwtSettings _jwtSettings;
        private readonly ILogger<CVController> _logger;

        public record RegisterDto
        {
            [EmailAddress]
            public string? email { get; set; }
            public string? phoneNumber { get; set; }
            [MinLength(6)]
            public string? password { get; set; }
            public string role { get; set; } = null!;
            public string authProvider { get; set; } = null!;
            public string? ggToken { get; set; }
            public string? fbToken { get; set; }
        }

        public record LoginDto(
            string? emailOrPhone,
            string? password,
            string? ggToken,
            string? fbToken,
            string authProvider = "local"
        );

        public AuthController(JobiverseContext context, IOptions<JwtSettings> jwtOptions, ILogger<CVController> logger)
        {
            _logger = logger;
            _context = context;
            _jwtSettings = jwtOptions.Value;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterDto req)
        {
            var provider = req.authProvider.ToLower();

            if (provider == "local")
            {
                // Validate the request
                if (string.IsNullOrWhiteSpace(req.email) ||
                    string.IsNullOrWhiteSpace(req.password) ||
                    string.IsNullOrWhiteSpace(req.phoneNumber) ||
                    string.IsNullOrWhiteSpace(req.role))
                {
                    return BadRequest(new { message = "Missing required fields for local registration" });
                }

                var email = req.email.Trim();
                var phone = req.phoneNumber.Trim();
                var password = req.password.Trim();
                var accountRole = req.role?.Trim();

                var existing = await _context.Accounts
                    .AsNoTracking()
                    .FirstOrDefaultAsync(u => (u.Email == email || u.PhoneNumber == phone) && u.Deleted == false);

                if (existing != null)
                {
                    if (existing.Email == email)
                        return BadRequest(new { message = "Email already in use" });
                    if (existing.PhoneNumber == phone)
                        return BadRequest(new { message = "Phone number already in use" });
                }

                var hashedPassword = BCrypt.Net.BCrypt.HashPassword(password);

                byte[] defaultAvatar = await System.IO.File.ReadAllBytesAsync("Assets/default-avatar.png");
                string defaultAvatarType = "image/png";

                var newAccount = new Account
                {
                    AccountId = Guid.NewGuid().ToString(),
                    Email = email,
                    PhoneNumber = phone,
                    Password = hashedPassword,
                    AccountRole = accountRole ?? "",
                    AuthProvider = provider,
                    Avatar = defaultAvatar,
                    AvatarType = defaultAvatarType
                };

                _context.Accounts.Add(newAccount);
                await _context.SaveChangesAsync();

                return Ok(new { message = "User registered successfully" });
            }
            else if (provider == "google")
            {
                // Validate the request
                if (string.IsNullOrWhiteSpace(req.ggToken))
                    return BadRequest(new { message = "Missing Google ID token" });

                var payload = await GoogleJsonWebSignature.ValidateAsync(req.ggToken);

                var email = payload.Email;
                var avatarUrl = payload.Picture;
                var name = payload.Name;

                var existing = await _context.Accounts
                    .AsNoTracking()
                    .FirstOrDefaultAsync(u => u.Email == email && u.Deleted == false);
                if (existing != null) return Ok(new { message = "Account already exists" });

                byte[]? avatar = null;
                string? avatarType = null;

                if (!string.IsNullOrWhiteSpace(avatarUrl))
                {
                    using var httpClient = new HttpClient();
                    try
                    {
                        avatar = await httpClient.GetByteArrayAsync(avatarUrl);
                        var response = await httpClient.GetAsync(avatarUrl, HttpCompletionOption.ResponseHeadersRead);
                        if (response.Content.Headers.ContentType != null)
                        {
                            avatarType = response.Content.Headers.ContentType.MediaType;
                        }
                        else
                        {
                            avatarType = "image/jpeg";
                        }
                    }
                    catch (Exception ex)
                    {
                        Console.WriteLine($"Unexpected error while downloading avatar: {ex.Message}");
                    }
                }

                var account = new Account
                {
                    AccountId = Guid.NewGuid().ToString(),
                    Email = email,
                    Avatar = avatar,
                    AuthProvider = provider,
                    AccountRole = req.role,
                    AvatarType = avatarType
                };

                _context.Accounts.Add(account);
                await _context.SaveChangesAsync();

                return Ok(new { message = "User registered successfully" });
            }
            else if (provider == "facebook")
            {
                if (string.IsNullOrWhiteSpace(req.fbToken))
                    return BadRequest(new { message = "Missing Facebook access token" });

                using var httpClient = new HttpClient();
                var fbResponse = await httpClient.GetStringAsync($"https://graph.facebook.com/me?fields=id,name,email,picture.width(200).height(200)&access_token={req.fbToken}");
                var fbData = JsonSerializer.Deserialize<JsonElement>(fbResponse);

                var email = fbData.GetProperty("email").GetString();
                var name = fbData.GetProperty("name").GetString();
                var avatarUrl = fbData.GetProperty("picture").GetProperty("data").GetProperty("url").GetString();

                if (email == null) return BadRequest(new { message = "Facebook account must have an email" });

                var existing = await _context.Accounts
                        .AsNoTracking()
                        .FirstOrDefaultAsync(u => u.Email == email && u.Deleted == false);

                if (existing != null) return Ok(new { message = "Account already exists" });

                byte[]? avatar = null;
                string? avatarType = null;

                if (!string.IsNullOrWhiteSpace(avatarUrl))
                {
                    try
                    {
                        avatar = await httpClient.GetByteArrayAsync(avatarUrl);
                        var response = await httpClient.GetAsync(avatarUrl, HttpCompletionOption.ResponseHeadersRead);
                        if (response.Content.Headers.ContentType != null)
                            avatarType = response.Content.Headers.ContentType.MediaType;
                        else
                            avatarType = "image/jpeg";
                    }
                    catch (Exception ex)
                    {
                        _logger.LogError(ex, "Error downloading Facebook avatar");
                    }
                }

                var account = new Account
                {
                    AccountId = Guid.NewGuid().ToString(),
                    Email = email,
                    Avatar = avatar,
                    AvatarType = avatarType,
                    AccountRole = req.role,
                    AuthProvider = provider
                };

                _context.Accounts.Add(account);
                await _context.SaveChangesAsync();

                return Ok(new { message = "User registered successfully" });
            }

            return BadRequest(new { message = "Unsupported provider" });
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto req)
        {
            var provider = req.authProvider.ToLower();

            if (provider == "local")
            {
                if (string.IsNullOrWhiteSpace(req.emailOrPhone) || string.IsNullOrWhiteSpace(req.password))
                {
                    return BadRequest(new { message = "Missing required fields for local login" });
                }

                var emailOrPhone = req.emailOrPhone.Trim();
                var password = req.password.Trim();
                var isEmail = emailOrPhone.Contains("@");

                var account = isEmail
                    ? await _context.Accounts
                        .AsNoTracking()
                        .FirstOrDefaultAsync(a => a.Email == emailOrPhone && a.Deleted == false)
                    : await _context.Accounts
                        .AsNoTracking()
                        .FirstOrDefaultAsync(a => a.PhoneNumber == emailOrPhone && a.Deleted == false);

                if (account == null)
                    return BadRequest(new { message = "Invalid email/phone or password" });

                if (!BCrypt.Net.BCrypt.Verify(password, account.Password))
                    return BadRequest(new { message = "Invalid email/phone or password" });

                var claims = new List<Claim>
                {
                    new Claim("AccountId", account.AccountId),
                    new Claim(ClaimTypes.Email, account.Email ?? ""),
                    new Claim(ClaimTypes.Role, account.AccountRole),
                    new Claim("Provider", account.AuthProvider ?? "local")
                };

                var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwtSettings.Key));
                var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

                var token = new JwtSecurityToken(
                    issuer: _jwtSettings.Issuer,
                    audience: _jwtSettings.Audience,
                    claims: claims,
                    expires: DateTime.UtcNow.AddMinutes(_jwtSettings.ExpiresInMinutes),
                    signingCredentials: creds
                );

                var jwtToken = new JwtSecurityTokenHandler().WriteToken(token);

                Response.Cookies.Append("token", jwtToken, new CookieOptions
                {
                    HttpOnly = true,
                    Secure = true,
                    SameSite = SameSiteMode.None,
                    Path = "/",
                    Expires = DateTimeOffset.UtcNow.AddMinutes(_jwtSettings.ExpiresInMinutes)
                });

                return Ok(new { message = "Login successful", token });
            }
            else if (provider == "google")
            {
                if (string.IsNullOrWhiteSpace(req.ggToken))
                    return BadRequest(new { message = "Missing Google ID token" });

                var payload = await GoogleJsonWebSignature.ValidateAsync(req.ggToken);
                var email = payload.Email;

                var account = await _context.Accounts
                    .AsNoTracking()
                    .FirstOrDefaultAsync(u => u.Email == email && u.Deleted == false);
                if (account == null)
                {
                    return Unauthorized(new { message = "Vui lòng đăng kí trước" });
                }

                var claims = new List<Claim>
                {
                    new Claim("AccountId", account.AccountId),
                    new Claim(ClaimTypes.Email, account.Email ?? ""),
                    new Claim(ClaimTypes.Role, account.AccountRole),
                    new Claim("Provider", account.AuthProvider ?? "google")
                };

                var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwtSettings.Key));
                var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
                var expires = DateTime.UtcNow.AddMinutes(_jwtSettings.ExpiresInMinutes);

                var token = new JwtSecurityToken(
                    issuer: _jwtSettings.Issuer,
                    audience: _jwtSettings.Audience,
                    claims: claims,
                    expires: expires,
                    signingCredentials: creds
                );

                var jwtToken = new JwtSecurityTokenHandler().WriteToken(token);

                Response.Cookies.Append("token", jwtToken, new CookieOptions
                {
                    HttpOnly = true,
                    Secure = true,
                    SameSite = SameSiteMode.None,
                    Path = "/",
                    Expires = expires
                });

                return Ok(new { message = "Login successful", token = jwtToken });
            }
            else if (provider == "facebook")
            {
                if (string.IsNullOrWhiteSpace(req.fbToken))
                    return BadRequest(new { message = "Missing Facebook access token" });

                using var httpClient = new HttpClient();
                var fbResponse = await httpClient.GetStringAsync($"https://graph.facebook.com/me?fields=id,name,email&access_token={req.fbToken}");
                var fbData = JsonSerializer.Deserialize<JsonElement>(fbResponse);
                var email = fbData.GetProperty("email").GetString();

                if (email == null)
                    return Unauthorized(new { message = "Facebook account must have an email" });

                var account = await _context.Accounts
                    .AsNoTracking()
                    .FirstOrDefaultAsync(u => u.Email == email && u.Deleted == false);

                if (account == null)
                    return Unauthorized(new { message = "Vui lòng đăng kí trước" });

                var claims = new List<Claim>
                {
                    new Claim("AccountId", account.AccountId),
                    new Claim(ClaimTypes.Email, account.Email ?? ""),
                    new Claim(ClaimTypes.Role, account.AccountRole),
                    new Claim("Provider", account.AuthProvider ?? "facebook")
                };

                var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwtSettings.Key));
                var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
                var expires = DateTime.UtcNow.AddMinutes(_jwtSettings.ExpiresInMinutes);

                var token = new JwtSecurityToken(
                    issuer: _jwtSettings.Issuer,
                    audience: _jwtSettings.Audience,
                    claims: claims,
                    expires: expires,
                    signingCredentials: creds
                );

                var jwtToken = new JwtSecurityTokenHandler().WriteToken(token);

                Response.Cookies.Append("token", jwtToken, new CookieOptions
                {
                    HttpOnly = true,
                    Secure = true,
                    SameSite = SameSiteMode.None,
                    Path = "/",
                    Expires = expires
                });

                return Ok(new { message = "Login successful", token = jwtToken });
            }

            return BadRequest(new { message = "Unsupported provider" });
        }

        [HttpPost("logout")]
        public IActionResult Logout()
        {
            Response.Cookies.Delete("token");
            return Ok(new { message = "Logged out successfully" });
        }
    }
}
