using System.Text.Json;
using api.DTOs.CV;
using api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Playwright;

namespace api.Controllers
{
    [Route("[controller]")]
    [Authorize(Roles = "student")]
    [ApiController]
    public class CVController : ControllerBase
    {
        private readonly JobiverseContext _context;
        private readonly ILogger<CVController> _logger;

        public CVController(JobiverseContext context, ILogger<CVController> logger)
        {
            _context = context;
            _logger = logger;
        }

        public record GeneratePdfRequestDto(string fileName = null!, string html = null!);

        [HttpGet("my")]
        public async Task<IActionResult> GetMyCVs()
        {
            var accountId = User.FindFirst("AccountId")?.Value;
            if (accountId == null) return Unauthorized("Unauthorized");

            var student = await _context.Students
                .AsNoTracking()
                .FirstOrDefaultAsync(s => s.AccountId == accountId);
            if (student == null) return NotFound("Student not found");

            var cvs = await _context.Cvs
                .AsNoTracking()
                .Where(c => c.StudentId == student.StudentId)
                .ToListAsync();

            var result = cvs.Select(c => new CvDto
            {
                _id = c.Cvid,
                Title = c.Title,
                DesiredPosition = c.DesiredPosition,
                LastUpdated = c.LastUpdated,
            }).ToList();

            return Ok(result);
        }

        [HttpGet("my/uploads")]
        public async Task<IActionResult> GetCVUploads()
        {
            var accountId = User.FindFirst("AccountId")?.Value;
            if (accountId == null) return Unauthorized("Unauthorized");

            var student = await _context.Students
                .AsNoTracking()
                .FirstOrDefaultAsync(s => s.AccountId == accountId);
            if (student == null) return NotFound("Student not found");

            var uploads = await _context.CvUploads
                .AsNoTracking()
                .Where(u => u.StudentId == student.StudentId)
                .ToListAsync();

            var result = uploads.Select(u => new
            {
                _id = u.FileId,
                title = u.Title,
            }).ToList();

            return Ok(result);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetCVById(string id)
        {
            var cv = await _context.Cvs
                .AsNoTracking()
                .Include(c => c.CvAchievements)
                .Include(c => c.CvActivities)
                .Include(c => c.CvEducations)
                .Include(c => c.CvLanguages)
                .Include(c => c.CvSocials)
                .Include(c => c.CvExperiences)
                .Include(c => c.CvSkills)
                .FirstOrDefaultAsync(e => e.Cvid == id);
            if (cv == null) return NotFound();

            var result = new
            {
                _id = cv.Cvid,
                title = cv.Title,
                avatar = cv.Avatar,
                name = cv.Name,
                birthday = cv.Birthday,
                gender = cv.Gender,
                phone = cv.Phone,
                email = cv.Email,
                address = cv.Address,
                website = cv.Website,
                summary = cv.Summary,
                desiredPosition = cv.DesiredPosition,
                lastUpdated = cv.LastUpdated,

                achievements = cv.CvAchievements.Select(a => new
                {
                    _id = a.AchievementId,
                    title = a.Title,
                    description = a.Description
                }).ToList(),

                activities = cv.CvActivities.Select(a => new
                {
                    _id = a.ActivityId,
                    title = a.Title,
                    organization = a.Organization,
                    startDate = a.StartDate,
                    endDate = a.EndDate,
                    description = a.Description
                }).ToList(),

                educations = cv.CvEducations.Select(e => new
                {
                    _id = e.EducationId,
                    degree = e.Degree,
                    school = e.School,
                    startDate = e.StartDate,
                    endDate = e.EndDate
                }).ToList(),

                languages = cv.CvLanguages.Select(l => new
                {
                    _id = l.LanguageId,
                    language = l.Language,
                    level = l.Level
                }).ToList(),

                socials = cv.CvSocials.Select(s => new
                {
                    _id = s.SocialId,
                    platform = s.Platform,
                    link = s.Link
                }).ToList(),

                experiences = cv.CvExperiences.Select(e => new
                {
                    _id = e.ExperienceId,
                    company = e.Company,
                    position = e.Position,
                    start = e.StartDate,
                    end = e.EndDate,
                    description = e.Description
                }).ToList(),

                skills = cv.CvSkills.Select(s => new
                {
                    _id = s.SkillId,
                    skillName = s.SkillName
                }).ToList(),
            };

            return Ok(result);
        }

        [HttpPost]
        public async Task<IActionResult> CreateCV([FromBody] CvDto req)
        {
            var accountId = User.FindFirst("AccountId")?.Value;
            if (accountId == null) return Unauthorized("Unauthorized");

            var student = await _context.Students
                .AsNoTracking()
                .FirstOrDefaultAsync(s => s.AccountId == accountId);
            if (student == null) return NotFound("Student not found");

            if (req == null) return BadRequest("CV cannot be null");

            var cvEntity = new Cv
            {
                Cvid = Guid.NewGuid().ToString(),
                StudentId = student.StudentId,
                Title = req.Title,
                Avatar = req.Avatar,
                Name = req.Name,
                Birthday = req.Birthday,
                Gender = req.Gender,
                Phone = req.Phone,
                Email = req.Email,
                Address = req.Address,
                Website = req.Website,
                Summary = req.Summary,
                DesiredPosition = req.DesiredPosition,
                LastUpdated = DateTime.UtcNow,

                CvAchievements = req.Achievements?.Select(a => new CvAchievement
                {
                    AchievementId = Guid.NewGuid().ToString(),
                    Title = a.Title,
                    Description = a.Description,
                }).ToList() ?? new List<CvAchievement>(),

                CvActivities = req.Activities?.Select(a => new CvActivity
                {
                    ActivityId = Guid.NewGuid().ToString(),
                    Title = a.Title,
                    Organization = a.Organization,
                    StartDate = a.StartDate,
                    EndDate = a.EndDate,
                    Description = a.Description
                }).ToList() ?? new List<CvActivity>(),

                CvEducations = req.Educations?.Select(e => new CvEducation
                {
                    EducationId = Guid.NewGuid().ToString(),
                    Degree = e.Degree,
                    School = e.School,
                    StartDate = e.StartDate,
                    EndDate = e.EndDate
                }).ToList() ?? new List<CvEducation>(),

                CvLanguages = req.Languages?.Select(l => new CvLanguage
                {
                    LanguageId = Guid.NewGuid().ToString(),
                    Language = l.Language,
                    Level = l.Level
                }).ToList() ?? new List<CvLanguage>(),

                CvSocials = req.Socials?.Select(s => new CvSocial
                {
                    SocialId = Guid.NewGuid().ToString(),
                    Platform = s.Platform,
                    Link = s.Link
                }).ToList() ?? new List<CvSocial>(),

                CvExperiences = req.Experiences?.Select(a => new CvExperience
                {
                    ExperienceId = Guid.NewGuid().ToString(),
                    Company = a.Company,
                    Position = a.Position,
                    StartDate = a.Start,
                    EndDate = a.End,
                    Description = a.Description
                }).ToList() ?? new List<CvExperience>(),

                CvSkills = req.Skills?.Select(s => new CvSkill
                {
                    SkillId = Guid.NewGuid().ToString(),
                    SkillName = s
                }).ToList() ?? new List<CvSkill>(),
            };

            _context.Cvs.Add(cvEntity);
            await _context.SaveChangesAsync();

            return StatusCode(201);
        }

        [HttpPost("uploads")]
        public async Task<IActionResult> UploadCV([FromForm] List<IFormFile> files)
        {
            var accountId = User.FindFirst("AccountId")?.Value;
            if (accountId == null) return Unauthorized("Unauthorized");

            var student = await _context.Students
                .AsNoTracking()
                .FirstOrDefaultAsync(s => s.AccountId == accountId);
            if (student == null) return NotFound("Student not found");

            if (files == null || files.Count == 0)
                return BadRequest("File is required");

            foreach (var file in files)
            {
                if (file.Length == 0) continue;

                var fileExt = Path.GetExtension(file.FileName).ToLower();
                if (fileExt != ".pdf" && fileExt != ".doc" && fileExt != ".docx")
                    return BadRequest("Only PDF, DOC, and DOCX files are allowed.");

                using var memoryStream = new MemoryStream();
                await file.CopyToAsync(memoryStream);
                var fileBytes = memoryStream.ToArray();

                var cvUpload = new CvUpload
                {
                    FileId = Guid.NewGuid().ToString(),
                    StudentId = student.StudentId,
                    Title = Path.GetFileNameWithoutExtension(file.FileName),
                    FileName = file.FileName,
                    FileType = file.ContentType,
                    File = fileBytes,
                    UploadedAt = DateTime.UtcNow
                };

                _context.CvUploads.Add(cvUpload);
            }

            await _context.SaveChangesAsync();
            return Ok("Tải lên thành công.");
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateCV(string id, [FromBody] CvDto req)
        {
            try
            {
                var accountId = User.FindFirst("AccountId")?.Value;
                if (accountId == null) return Unauthorized("Unauthorized");

                var student = await _context.Students
                    .AsNoTracking()
                    .FirstOrDefaultAsync(s => s.AccountId == accountId);
                if (student == null) return NotFound("Student not found");

                if (req == null) return BadRequest("CV cannot be null");

                var cvEntity = await _context.Cvs
                    .Include(c => c.CvAchievements)
                    .Include(c => c.CvActivities)
                    .Include(c => c.CvEducations)
                    .Include(c => c.CvLanguages)
                    .Include(c => c.CvSocials)
                    .Include(c => c.CvExperiences)
                    .Include(c => c.CvSkills)
                    .FirstOrDefaultAsync(c => c.Cvid == id);
                if (cvEntity == null) return NotFound("CV not found");

                // Cập nhật thông tin cơ bản
                cvEntity.Title = req.Title;
                cvEntity.Avatar = req.Avatar;
                cvEntity.Name = req.Name;
                cvEntity.Birthday = req.Birthday;
                cvEntity.Gender = req.Gender;
                cvEntity.Phone = req.Phone;
                cvEntity.Email = req.Email;
                cvEntity.Address = req.Address;
                cvEntity.Website = req.Website;
                cvEntity.Summary = req.Summary;
                cvEntity.DesiredPosition = req.DesiredPosition;
                cvEntity.LastUpdated = DateTime.UtcNow;

                // cvEntity.CvAchievements = req.Achievements?.Select(a => new CvAchievement
                // {
                //     // AchievementId = Guid.NewGuid().ToString(),
                //     Title = a.Title,
                //     Description = a.Description
                // }).ToList() ?? new List<CvAchievement>();

                _context.CvActivities.RemoveRange(cvEntity.CvActivities);
                if (req.Activities != null)
                {
                    _context.CvActivities.AddRange(req.Activities.Select(a => new CvActivity
                    {
                        ActivityId = Guid.NewGuid().ToString(),
                        Cvid = cvEntity.Cvid,
                        Title = a.Title,
                        Organization = a.Organization,
                        StartDate = a.StartDate,
                        EndDate = a.EndDate,
                        Description = a.Description
                    }));
                }
                // cvEntity.CvActivities = req.Activities?.Select(a => new CvActivity
                // {
                //     ActivityId = Guid.NewGuid().ToString(),
                //     Title = a.Title,
                //     Organization = a.Organization,
                //     StartDate = a.StartDate,
                //     EndDate = a.EndDate,
                //     Description = a.Description
                // }).ToList() ?? new List<CvActivity>();

                // cvEntity.CvEducations = req.Educations?.Select(e => new CvEducation
                // {
                //     EducationId = Guid.NewGuid().ToString(),
                //     Degree = e.Degree,
                //     School = e.School,
                //     StartDate = e.StartDate,
                //     EndDate = e.EndDate
                // }).ToList() ?? new List<CvEducation>();

                // cvEntity.CvLanguages = req.Languages?.Select(l => new CvLanguage
                // {
                //     LanguageId = Guid.NewGuid().ToString(),
                //     Language = l.Language,
                //     Level = l.Level
                // }).ToList() ?? new List<CvLanguage>();

                // cvEntity.CvSocials = req.Socials?.Select(s => new CvSocial
                // {
                //     SocialId = Guid.NewGuid().ToString(),
                //     Platform = s.Platform,
                //     Link = s.Link
                // }).ToList() ?? new List<CvSocial>();

                // cvEntity.CvExperiences = req.Experiences?.Select(e => new CvExperience
                // {
                //     ExperienceId = Guid.NewGuid().ToString(),
                //     Company = e.Company,
                //     Position = e.Position,
                //     StartDate = e.Start,
                //     EndDate = e.End,
                //     Description = e.Description
                // }).ToList() ?? new List<CvExperience>();

                // cvEntity.CvSkills = req.Skills?.Select(s => new CvSkill
                // {
                //     SkillId = Guid.NewGuid().ToString(),
                //     SkillName = s
                // }).ToList() ?? new List<CvSkill>();

                // Lưu thay đổi

                await _context.SaveChangesAsync();

                return Ok("CV updated successfully.");
            }
            catch (Exception ex)
            {
                _logger.LogError("Error updating CV with ID {Id}: {Message}", id, ex.Message);
                return StatusCode(500, "An error occurred while updating the CV. " + ex.Message);
            }
        }

        [HttpPost("generate-pdf")]
        public async Task<IActionResult> GeneratePdf([FromBody] GeneratePdfRequestDto req)
        {
            using var playwright = await Playwright.CreateAsync();
            await using var browser = await playwright.Chromium.LaunchAsync(new BrowserTypeLaunchOptions
            {
                Headless = true
            });

            var page = await browser.NewPageAsync();
            await page.SetContentAsync(req.html, new PageSetContentOptions { WaitUntil = WaitUntilState.NetworkIdle });

            var pdfBytes = await page.PdfAsync(new PagePdfOptions
            {
                Format = "A4",
                PrintBackground = true,
                Margin = new() { Top = "10mm", Bottom = "10mm", Left = "10mm", Right = "10mm" }
            });

            return File(pdfBytes, "application/pdf", req.fileName ?? "document.pdf");
        }
    }
}
