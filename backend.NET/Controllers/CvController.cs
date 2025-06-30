using System.ComponentModel.DataAnnotations;
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
    [Authorize]
    [ApiController]
    public class CVController : ControllerBase
    {
        public class UploadCVRequest
        {
            [Required]
            public List<IFormFile> Files { get; set; } = new();
        }

        private readonly JobiverseContext _context;
        private readonly ILogger<CVController> _logger;

        public CVController(JobiverseContext context, ILogger<CVController> logger)
        {
            _context = context;
            _logger = logger;
        }

        [HttpGet("my")]
        public async Task<IActionResult> GetAllMyCVs()
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
        public async Task<IActionResult> GetAllMyCVUploads()
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
                    start = a.StartDate,
                    end = a.EndDate,
                    description = a.Description
                }).ToList(),

                educations = cv.CvEducations.Select(e => new
                {
                    _id = e.EducationId,
                    degree = e.Degree,
                    school = e.School,
                    start = e.StartDate,
                    end = e.EndDate
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

        [HttpGet("uploads/{id}")]
        public async Task<IActionResult> GetUpCVById(string id)
        {
            var upload = await _context.CvUploads
                .AsNoTracking()
                .FirstOrDefaultAsync(u => u.FileId == id);

            if (upload == null || upload.File == null || upload.FileType == null)
                return NotFound("Cv upload not found");

            return File(upload.File, upload.FileType, upload.FileName ?? "cv-upload.pdf");
        }

        [HttpGet("default")]
        public async Task<IActionResult> GetDefaultCv()
        {
            var accountId = User.FindFirst("AccountId")?.Value;
            if (accountId == null) return Unauthorized("Unauthorized");

            var student = await _context.Students
                .AsNoTracking()
                .FirstOrDefaultAsync(s => s.AccountId == accountId);

            if (student == null || student.DefaultCvId == null)
                return NotFound("Sinh viên chưa có CV mặc định");

            var type = student.DefaultCvType;
            var cv = student.DefaultCvId;

            if (type == "CV")
            {
                var cvData = await _context.Cvs
                    .AsNoTracking()
                    .FirstOrDefaultAsync(c => c.Cvid == student.DefaultCvId);

                if (cvData == null) return NotFound("Default CV not found");

                return Ok(new { type, cv = new { _id = cvData.Cvid } });
            }
            else if (type == "CVUpload")
            {
                var uploadData = await _context.CvUploads
                    .AsNoTracking()
                    .FirstOrDefaultAsync(c => c.FileId == student.DefaultCvId);

                if (uploadData == null) return NotFound("Default CV not found");

                return Ok(new { type, cv = new { _id = uploadData.FileId } });
            }
            else
            {
                return BadRequest("Loại CV không hợp lệ");
            }
        }

        [HttpPost("{id}/set-default")]
        public async Task<IActionResult> SetDefaultCV(string id, [FromBody] JsonDocument body)
        {
            var accountId = User.FindFirst("AccountId")?.Value;
            if (accountId == null) return Unauthorized("Unauthorized");

            var student = await _context.Students
                .FirstOrDefaultAsync(s => s.AccountId == accountId);
            if (student == null) return NotFound("Student not found");

            var root = body.RootElement;

            var type = root.TryGetProperty("type", out var typeProp) ? typeProp.GetString() : null;

            if (type == "CV")
            {
                var cv = await _context.Cvs.FindAsync(id);
                if (cv == null) return NotFound("CV not found");

                student.DefaultCvId = id;
                student.DefaultCvType = type;
            }
            else if (type == "CVUpload")
            {
                var upload = await _context.CvUploads.FindAsync(id);
                if (upload == null) return NotFound("Upload not found");

                student.DefaultCvId = id;
                student.DefaultCvType = type;
            }
            else
            {
                return BadRequest("Invalid type. Must be 'cv' or 'upload'.");
            }

            await _context.SaveChangesAsync();

            return Ok(new { message = "Default CV set successfully" });
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
                    StartDate = a.Start,
                    EndDate = a.End,
                    Description = a.Description
                }).ToList() ?? new List<CvActivity>(),

                CvEducations = req.Educations?.Select(e => new CvEducation
                {
                    EducationId = Guid.NewGuid().ToString(),
                    Degree = e.Degree,
                    School = e.School,
                    StartDate = e.Start,
                    EndDate = e.End
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

            if (student.DefaultCvId == null)
            {
                student.DefaultCvId = cvEntity.Cvid;
                student.DefaultCvType = "CV";
                _context.Students.Update(student);
                await _context.SaveChangesAsync();
            }

            return StatusCode(201);
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

                _context.CvAchievements.RemoveRange(cvEntity.CvAchievements);
                _context.CvActivities.RemoveRange(cvEntity.CvActivities);
                _context.CvEducations.RemoveRange(cvEntity.CvEducations);
                _context.CvLanguages.RemoveRange(cvEntity.CvLanguages);
                _context.CvSocials.RemoveRange(cvEntity.CvSocials);
                _context.CvExperiences.RemoveRange(cvEntity.CvExperiences);
                _context.CvSkills.RemoveRange(cvEntity.CvSkills);

                if (req.Achievements != null && req.Achievements.Any())
                {
                    var newAchievements = req.Achievements.Select(a => new CvAchievement
                    {
                        AchievementId = Guid.NewGuid().ToString(),
                        Cvid = id,
                        Title = a.Title,
                        Description = a.Description
                    });

                    await _context.CvAchievements.AddRangeAsync(newAchievements);
                }

                if (req.Activities != null && req.Activities.Any())
                {
                    var newActivities = req.Activities.Select(a => new CvActivity
                    {
                        ActivityId = Guid.NewGuid().ToString(),
                        Cvid = id,
                        Title = a.Title,
                        Organization = a.Organization,
                        StartDate = a.Start,
                        EndDate = a.End,
                        Description = a.Description
                    });

                    await _context.CvActivities.AddRangeAsync(newActivities);
                }

                if (req.Educations != null && req.Educations.Any())
                {
                    var newEducations = req.Educations.Select(e => new CvEducation
                    {
                        EducationId = Guid.NewGuid().ToString(),
                        Cvid = id,
                        Degree = e.Degree,
                        School = e.School,
                        StartDate = e.Start,
                        EndDate = e.End
                    });

                    await _context.CvEducations.AddRangeAsync(newEducations);
                }

                if (req.Languages != null && req.Languages.Any())
                {
                    var newLanguages = req.Languages.Select(l => new CvLanguage
                    {
                        LanguageId = Guid.NewGuid().ToString(),
                        Cvid = id,
                        Language = l.Language,
                        Level = l.Level
                    });

                    await _context.CvLanguages.AddRangeAsync(newLanguages);
                }

                if (req.Socials != null && req.Socials.Any())
                {
                    var newSocials = req.Socials.Select(s => new CvSocial
                    {
                        SocialId = Guid.NewGuid().ToString(),
                        Cvid = id,
                        Platform = s.Platform,
                        Link = s.Link
                    });

                    await _context.CvSocials.AddRangeAsync(newSocials);
                }

                if (req.Experiences != null && req.Experiences.Any())
                {
                    var newExperiences = req.Experiences.Select(e => new CvExperience
                    {
                        ExperienceId = Guid.NewGuid().ToString(),
                        Cvid = id,
                        Company = e.Company,
                        Position = e.Position,
                        StartDate = e.Start,
                        EndDate = e.End,
                        Description = e.Description
                    });

                    await _context.CvExperiences.AddRangeAsync(newExperiences);
                }

                if (req.Skills != null && req.Skills.Any())
                {
                    var newSkills = req.Skills.Select(s => new CvSkill
                    {
                        SkillId = Guid.NewGuid().ToString(),
                        Cvid = id,
                        SkillName = s
                    });

                    await _context.CvSkills.AddRangeAsync(newSkills);
                }


                await _context.SaveChangesAsync();

                return Ok("CV updated successfully.");
            }
            catch (Exception ex)
            {
                _logger.LogError("Error updating CV with ID {Id}: {Message}", id, ex.Message);
                return StatusCode(500, "An error occurred while updating the CV. " + ex.Message);
            }
        }

        [HttpPost("uploads")]
        public async Task<IActionResult> UploadCV([FromForm] UploadCVRequest request)
        {
            var accountId = User.FindFirst("AccountId")?.Value;
            if (accountId == null) return Unauthorized("Unauthorized");

            var student = await _context.Students.FirstOrDefaultAsync(s => s.AccountId == accountId);
            if (student == null) return NotFound("Student not found");

            if (request.Files == null || request.Files.Count == 0)
                return BadRequest("File is required");

            var file = request.Files[0];

            if (file.Length == 0)
                return BadRequest("File is empty");

            var fileExt = Path.GetExtension(file.FileName).ToLower();
            if (fileExt != ".pdf" && fileExt != ".doc" && fileExt != ".docx")
                return BadRequest("Only PDF, DOC, and DOCX files are allowed.");

            using var memoryStream = new MemoryStream();
            await file.CopyToAsync(memoryStream);
            var fileBytes = memoryStream.ToArray();

            var fileId = Guid.NewGuid().ToString();

            var cvUpload = new CvUpload
            {
                FileId = fileId,
                StudentId = student.StudentId,
                Title = Path.GetFileNameWithoutExtension(file.FileName),
                FileName = file.FileName,
                FileType = file.ContentType,
                File = fileBytes,
                UploadedAt = DateTime.UtcNow
            };

            _context.CvUploads.Add(cvUpload);
            await _context.SaveChangesAsync();

            if (student.DefaultCvId == null)
            {
                student.DefaultCvId = fileId;
                student.DefaultCvType = "CVUpload";
                _context.Students.Update(student);
                await _context.SaveChangesAsync();
            }

            return Ok(new
            {
                message = "Tải lên CV thành công",
                uploadedFile = new
                {
                    _id = fileId,
                    title = Path.GetFileNameWithoutExtension(file.FileName),
                    fileName = file.FileName,
                    fileType = file.ContentType
                }
            });
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCv(string id)
        {
            var cv = await _context.Cvs.FindAsync(id);
            if (cv == null) return NotFound("CV không tồn tại");

            var student = await _context.Students
                .FirstOrDefaultAsync(s => s.DefaultCvId == id);

            if (student != null)
            {
                student.DefaultCvId = null;
                student.DefaultCvType = null;
                _context.Students.Update(student);
            }

            _context.Cvs.Remove(cv);
            await _context.SaveChangesAsync();

            return Ok("CV deleted successfully.");
        }

        [HttpDelete("uploads/{id}")]
        public async Task<IActionResult> DeleteUploadCv(string id)
        {
            var upload = await _context.CvUploads.FindAsync(id);
            if (upload == null) return NotFound("Upload not found");

            var student = await _context.Students
                .FirstOrDefaultAsync(s => s.DefaultCvId == id);

            if (student != null)
            {
                student.DefaultCvId = null;
                student.DefaultCvType = null;
                _context.Students.Update(student);
            }

            _context.CvUploads.Remove(upload);
            await _context.SaveChangesAsync();

            return Ok("Upload deleted successfully.");
        }

        [HttpPost("generate-pdf")]
        public async Task<IActionResult> GeneratePdf([FromBody] JsonDocument body)
        {
            var root = body.RootElement;

            string? fileName = root.TryGetProperty("fileName", out var fn) ? fn.GetString() : null;
            string? html = root.TryGetProperty("html", out var ht) ? ht.GetString() : null;

            if (string.IsNullOrWhiteSpace(html))
                return BadRequest("Missing or empty 'html' content.");

            using var playwright = await Playwright.CreateAsync();
            await using var browser = await playwright.Chromium.LaunchAsync(
                new BrowserTypeLaunchOptions { Headless = true });

            var page = await browser.NewPageAsync();
            await page.SetContentAsync(html, new PageSetContentOptions { WaitUntil = WaitUntilState.NetworkIdle });

            var pdfBytes = await page.PdfAsync(new PagePdfOptions
            {
                Format = "A4",
                PrintBackground = true,
            });

            return File(pdfBytes, "application/pdf", fileName ?? "cv.pdf");
        }
    }
}
