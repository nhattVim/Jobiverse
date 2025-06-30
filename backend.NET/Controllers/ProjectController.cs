using System;
using System.Text.Json;
using api.Models;
using api.Utils;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using static System.Net.Mime.MediaTypeNames;
using static System.Runtime.InteropServices.JavaScript.JSType;


namespace api.Controllers
{
    [Route("[controller]s")]
    [ApiController]
    public class ProjectController : ControllerBase
    {
        private readonly ILogger<ProjectController> _logger;
        private readonly JobiverseContext _context;

        public ProjectController(ILogger<ProjectController> logger, JobiverseContext context)
        {
            _logger = logger;
            _context = context;
        }

        public record ApplyProjectDto(
            string? cvId,
            string? coverLetter
        );

        public record DeleteStudentInvitedDto(
            string? StudentId
            );

        public class ActionDto
        {
            public string Action { get; set; }
        }

        public record ProjectLocationDto(
            string? Province,
            string? District,
            string? Ward
        );



        public record ProjectDto(
            string? title,
            string? description,
            ProjectLocationDto? location,
            string? content,
            string? workingTime,
            decimal? salary,
            int? expRequired,
            int? hiringCount,
            DateTime? deadline,
            List<string>? major,
            List<string>? specialization,
            List<string>? applicants
        );

        [HttpGet]
        public async Task<IActionResult> GetAllProjects(
            [FromQuery] string? major,
            [FromQuery] string? spec,
            [FromQuery] string? expRequired,
            [FromQuery] string? workTypes,
            [FromQuery] string? sortBy,
            [FromQuery] string? search,
            [FromQuery] int? page,
            [FromQuery] int? limit
        )
        {
            try
            {
                var pagination = new Pagination(page, limit);

                var query = _context.Projects
                    .AsNoTracking()
                    .Include(p => p.Account)
                    .Include(p => p.ProjectMajors)
                    .Include(p => p.ProjectSpecializations)
                    .Include(p => p.ProjectApplicants)
                    .AsQueryable();

                if (!string.IsNullOrWhiteSpace(major))
                {
                    var majorIds = major.Split(',').ToHashSet();
                    query = query.Where(p => p.ProjectMajors.Any(m => majorIds.Contains(m.MajorId)));
                }

                if (!string.IsNullOrWhiteSpace(spec))
                {
                    var specIds = spec.Split(',').ToHashSet();
                    query = query.Where(p => p.ProjectSpecializations.Any(s => specIds.Contains(s.SpecializationId)));
                }

                if (!string.IsNullOrWhiteSpace(expRequired))
                {
                    var expList = expRequired.Split(',').Select(int.Parse).ToList();
                    query = query.Where(p => p.ExpRequired.HasValue && expList.Contains(p.ExpRequired.Value));
                }

                if (!string.IsNullOrWhiteSpace(workTypes))
                {
                    var types = workTypes.Split(',').ToHashSet();
                    query = query.Where(p => p.WorkType != null && types.Contains(p.WorkType));
                }

                if (!string.IsNullOrWhiteSpace(search))
                {
                    query = query.Where(p =>
                        (p.Title ?? "").Contains(search) ||
                        (p.Description ?? "").Contains(search) ||
                        (p.ProjectLocation != null &&
                            ((p.ProjectLocation.Province ?? "").Contains(search) ||
                            (p.ProjectLocation.District ?? "").Contains(search) ||
                            (p.ProjectLocation.Ward ?? "").Contains(search))));
                }

                query = sortBy switch
                {
                    "newest" => query.OrderByDescending(p => p.CreatedAt),
                    "oldest" => query.OrderBy(p => p.CreatedAt),
                    "salaryAsc" => query.OrderBy(p => p.Salary),
                    "salaryDesc" => query.OrderByDescending(p => p.Salary),
                    _ => query.OrderByDescending(p => p.CreatedAt)
                };

                var filteredQuery = query
                    .Where(p => p.Account != null && (p.Account.Deleted == false) && p.Deleted == false);

                var total = await filteredQuery.CountAsync();

                var data = await filteredQuery
                    .Skip(pagination.Skip)
                    .Take(pagination.Limit)
                    .Select(p => new
                    {
                        _id = p.ProjectId,
                        account = new
                        {
                            _id = p.Account.AccountId,
                            avatar = p.Account.Avatar == null ? null : new
                            {
                                data = Convert.ToBase64String(p.Account.Avatar),
                                contentType = p.Account.AvatarType
                            }
                        },
                        p.Title,
                        p.Description,
                        location = p.ProjectLocation == null ? null : new
                        {
                            p.ProjectLocation.Province,
                            p.ProjectLocation.District,
                            p.ProjectLocation.Ward
                        },
                        p.Salary,
                        p.ExpRequired,
                        p.WorkType,
                        p.WorkingTime,
                        p.HiringCount,
                        major = p.ProjectMajors.Select(m => m.MajorId),
                        specialization = p.ProjectSpecializations.Select(s => s.SpecializationId)
                    })
                    .ToListAsync();

                return Ok(new PaginatedResponse<object>(data, total, pagination));
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Internal server error", error = ex.Message });
            }
        }

        [HttpGet("detail/{id}")]
        public async Task<IActionResult> GetProjectById(string id, [FromQuery] int? page, [FromQuery] int? limit)
        {
            try
            {
                var pagination = new Pagination(page, limit);

                var project = await _context.Projects
                    .AsNoTracking()
                    .Include(p => p.Account)
                    .Include(p => p.ProjectLocation)
                    .Include(p => p.ProjectMajors)
                    .Include(p => p.ProjectSpecializations)
                    .Include(p => p.ProjectApplicants)
                        .ThenInclude(a => a.Student)
                            .ThenInclude(s => s.Account)
                    .FirstOrDefaultAsync(p => p.ProjectId == id);

                if (project == null)
                    return NotFound(new { message = "No project found" });

                if (project.Account == null || project.Account.Deleted == true)
                    return NotFound(new { message = "Project owner not found or deleted" });

                // Filter applicants with valid student and account
                var applicants = project.ProjectApplicants
                    .Where(a => a.Student != null && a.Student.Account != null)
                    .Select(a => new
                    {
                        a.Status,
                        a.Cv,
                        a.CvType,
                        student = a.Student == null ? null : new
                        {
                            _id = a.Student.StudentId,
                            a.Student.Name,
                            a.Student.University,
                            account = a.Student.Account == null ? null : new
                            {
                                a.Student.Account.AccountId,
                                a.Student.Account.AccountRole,
                                a.Student.Account.Avatar,
                                a.Student.Account.Email
                            }
                        },
                        a.AppliedAt
                    })
                    .ToList();

                var pendingApplicants = applicants.Where(a => a.Status == "pending").ToList();
                var totalApplicants = pendingApplicants.Count;
                var pagedApplicants = pendingApplicants
                    .Skip(pagination.Skip)
                    .Take(pagination.Limit)
                    .ToList();

                var applicantsPagination = new PaginationMetadata(totalApplicants, pagination.Page, pagination.Limit);

                // Get project owner profile
                object? profile = null;
                if (project.Account.AccountRole == "student")
                {
                    var studentProfile = await _context.Students
                        .AsNoTracking()
                        .Include(s => s.Major)
                        .Include(s => s.Specialization)
                        .FirstOrDefaultAsync(s => s.AccountId == project.Account.AccountId);

                    if (studentProfile != null)
                    {
                        profile = new
                        {
                            studentProfile.Name,
                            studentProfile.University,
                            major = studentProfile.Major == null ? null : new { studentProfile.Major.MajorId, studentProfile.Major.Name },
                            specialization = studentProfile.Specialization == null ? null : new { studentProfile.Specialization.SpecializationId, studentProfile.Specialization.Name }
                        };
                    }
                }
                else if (project.Account.AccountRole == "employer")
                {
                    var employerProfile = await _context.Employers
                        .AsNoTracking()
                        .FirstOrDefaultAsync(e => e.AccountId == project.Account.AccountId);

                    if (employerProfile != null)
                    {
                        profile = new
                        {
                            employerProfile.CompanyName,
                            employerProfile.BusinessScale,
                            employerProfile.Industry,
                            employerProfile.Address
                        };
                    }
                }

                var result = new
                {
                    _id = project.ProjectId,
                    account = new
                    {
                        _id = project.Account.AccountId,
                        avatar = project.Account.Avatar == null ? null : new
                        {
                            data = Convert.ToBase64String(project.Account.Avatar),
                            contentType = project.Account.AvatarType
                        },
                        email = project.Account.Email,
                        role = project.Account.AccountRole
                    },
                    project.Title,
                    project.Description,
                    project.Content,
                    project.Salary,
                    project.ExpRequired,
                    project.WorkType,
                    project.WorkingTime,
                    project.HiringCount,
                    profile,
                    major = project.ProjectMajors.Select(m => m.MajorId),
                    specialization = project.ProjectSpecializations.Select(s => s.SpecializationId),
                    applicants,
                    pendingApplicants = pagedApplicants,
                    applicantsPagination,
                    deadline = project.Deadline,
                    location = project.ProjectLocation == null ? null : new
                    {
                        project.ProjectLocation.Province,
                        project.ProjectLocation.District,
                        project.ProjectLocation.Ward
                    }
                };

                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error retrieving project", error = ex.Message });
            }
        }

        [HttpGet("latest")]
        public async Task<IActionResult> GetProjectsLatest()
        {
            try
            {
                var projects = await _context.Projects
                    .AsNoTracking()
                    .Include(p => p.Account)
                    .Where(p => p.Status == "open" && p.Account != null && p.Account.Deleted == false && p.Deleted == false)
                    .OrderByDescending(p => p.Salary)
                    .ThenByDescending(p => p.CreatedAt)
                    .Select(p => new
                    {
                        _id = p.ProjectId,
                        p.Title,
                        location = p.ProjectLocation == null ? null : new
                        {
                            p.ProjectLocation.Province,
                            p.ProjectLocation.District,
                            p.ProjectLocation.Ward
                        },
                        p.Salary,
                        p.WorkType,
                        p.CreatedAt,
                        account = new
                        {
                            _id = p.Account.AccountId,
                            role = p.Account.AccountRole,
                            avatar = p.Account.Avatar == null ? null : new
                            {
                                data = Convert.ToBase64String(p.Account.Avatar),
                                contentType = p.Account.AvatarType
                            },
                            deleted = p.Account.Deleted
                        }
                    })
                    .Take(10)
                    .ToListAsync();

                return Ok(projects);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Internal server error", error = ex.Message });
            }
        }

        [Authorize]
        [HttpGet("my")]
        public async Task<IActionResult> GetMyProjects()
        {
            try
            {
                var accountId = User.FindFirst("AccountId")?.Value;
                if (accountId == null) return Unauthorized("AccountId not found in token");

                var projects = await _context.Projects
                    .AsNoTracking()
                    .Where(p => p.AccountId == accountId && p.Deleted == false)
                    .ToListAsync();

                var result = projects.Select(p => new
                {
                    _id = p.ProjectId,
                    account = p.AccountId,
                    p.Title,
                    p.CreatedAt,
                    p.UpdatedAt
                });

                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Internal server error", error = ex.Message });
            }
        }

        [Authorize]
        [HttpPost("my")]
        public async Task<IActionResult> CreateProject([FromBody] ProjectDto dto)
        {
            try
            {
                var accountId = User.FindFirst("AccountId")?.Value;
                if (accountId == null) return Unauthorized("AccountId not found in token");

                _logger.LogInformation("Req {req}", JsonSerializer.Serialize(dto));

                var project = new Project
                {
                    ProjectId = Guid.NewGuid().ToString(),
                    Title = dto.title,
                    Description = dto.description,
                    ProjectLocation = dto.location != null
                        ? new ProjectLocation
                        {
                            Province = dto.location.Province,
                            District = dto.location.District,
                            Ward = dto.location.Ward
                        }
                        : null,
                    AccountId = accountId,
                    Content = dto.content,
                    WorkingTime = dto.workingTime,
                    Salary = dto.salary,
                    HiringCount = dto.hiringCount,
                    ExpRequired = dto.expRequired,
                    Deadline = dto.deadline ?? DateTime.UtcNow.AddDays(30),
                    ProjectMajors = dto.major != null
                        ? await _context.Majors
                            .Where(m => dto.major.Contains(m.MajorId))
                            .Select(m => new ProjectMajor { MajorId = m.MajorId })
                            .ToListAsync()
                        : new List<ProjectMajor>(),
                    ProjectSpecializations = dto.specialization != null
                        ? await _context.Specializations
                            .Where(s => dto.specialization.Contains(s.SpecializationId))
                            .Select(s => new ProjectSpecialization { SpecializationId = s.SpecializationId })
                            .ToListAsync()
                        : new List<ProjectSpecialization>(),
                };

                _context.Projects.Add(project);
                await _context.SaveChangesAsync();

                return Ok();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error when creating project");
                return StatusCode(500, new { message = "Internal server error", error = ex.ToString() });
            }
        }

        [Authorize]
        [HttpPut("my/{id}")]
        public async Task<IActionResult> UpdateProject(string id, [FromBody] ProjectDto dto)
        {
            try
            {
                var accountId = User.FindFirst("AccountId")?.Value;
                if (accountId == null)
                    return Unauthorized("AccountId not found in token");

                var project = await _context.Projects
                    .Include(p => p.ProjectLocation)
                    .Include(p => p.ProjectMajors)
                    .Include(p => p.ProjectSpecializations)
                    .FirstOrDefaultAsync(p => p.ProjectId == id && p.AccountId == accountId);

                if (project == null)
                    return NotFound(new { message = "Dự án không tồn tại" });

                // Update fields
                project.Title = dto.title ?? project.Title;
                project.Description = dto.description ?? project.Description;
                project.Content = dto.content ?? project.Content;
                project.WorkingTime = dto.workingTime ?? project.WorkingTime;
                project.Salary = dto.salary ?? project.Salary;
                project.ExpRequired = dto.expRequired ?? project.ExpRequired;
                project.HiringCount = dto.hiringCount ?? project.HiringCount;
                project.Deadline = dto.deadline ?? project.Deadline;
                project.UpdatedAt = DateTime.UtcNow;

                // Update location
                if (dto.location != null)
                {
                    if (project.ProjectLocation == null)
                        project.ProjectLocation = new ProjectLocation();
                    project.ProjectLocation.Province = dto.location.Province ?? project.ProjectLocation.Province;
                    project.ProjectLocation.District = dto.location.District ?? project.ProjectLocation.District;
                    project.ProjectLocation.Ward = dto.location.Ward ?? project.ProjectLocation.Ward;
                }

                // Update majors and specializations if provided
                if (dto.major != null)
                {
                    project.ProjectMajors.Clear();
                    foreach (var majorId in dto.major)
                    {
                        project.ProjectMajors.Add(new ProjectMajor { ProjectId = project.ProjectId, MajorId = majorId });
                    }
                }
                if (dto.specialization != null)
                {
                    project.ProjectSpecializations.Clear();
                    foreach (var specId in dto.specialization)
                    {
                        project.ProjectSpecializations.Add(new ProjectSpecialization { ProjectId = project.ProjectId, SpecializationId = specId });
                    }
                }

                await _context.SaveChangesAsync();

                return Ok(project);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Internal server error", error = ex.Message });
            }
        }

        [Authorize]
        [HttpPut("my/{id}/status")]
        public async Task<IActionResult> UpdateProjectStatus(string id, [FromBody] JsonElement body)
        {
            var accountId = User.FindFirst("AccountId")?.Value;
            if (accountId == null)
                return Unauthorized("AccountId not found in token");

            if (!body.TryGetProperty("status", out var statusElement))
                return BadRequest(new { message = "Missing status field" });

            var status = statusElement.GetString();
            var allowed = new[] { "open", "closed", "in-progress" };
            if (!allowed.Contains(status))
            {
                return BadRequest(new
                {
                    message = "Invalid status value. Must be \"status\": \"open|closed|in-progress\""
                });
            }

            var project = await _context.Projects.FirstOrDefaultAsync(p => p.ProjectId == id && p.AccountId == accountId);
            if (project == null)
                return NotFound(new { message = "Project not found or not owned by you" });

            project.Status = status;
            project.UpdatedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();

            return Ok(new { message = "Project status updated successfully", project });
        }

        [Authorize]
        [HttpDelete("my/{id}")]
        public async Task<IActionResult> DeleteProject(string id)
        {
            var accountId = User.FindFirst("AccountId")?.Value;
            if (accountId == null)
                return Unauthorized("AccountId not found in token");

            var project = await _context.Projects.FirstOrDefaultAsync(p => p.ProjectId == id && p.AccountId == accountId);
            if (project == null)
                return NotFound(new { message = "Dự án không tồn tại" });

            project.Deleted = true;
            await _context.SaveChangesAsync();

            return Ok(new { message = "Dự án đã được xóa thành công" });
        }


        [HttpGet("employer/{id}")]
        public async Task<IActionResult> GetProjectsByEmployer(string id)
        {
            try
            {
                var projects = await _context.Projects
                    .AsNoTracking()
                    .Include(p => p.Account)
                    .Include(p => p.ProjectLocation)
                    .Where(p => p.AccountId == id && p.Deleted == false && p.Account != null && p.Account.Deleted == false)
                    .Select(p => new
                    {
                        _id = p.ProjectId,
                        title = p.Title,
                        location = p.ProjectLocation == null ? null : new
                        {
                            p.ProjectLocation.Province,
                            p.ProjectLocation.District,
                            p.ProjectLocation.Ward
                        },
                        salary = p.Salary,
                        workType = p.WorkType,
                        account = new
                        {
                            _id = p.Account.AccountId,
                            role = p.Account.AccountRole,
                        }
                    })
                    .ToListAsync();

                var result = new List<object>();
                foreach (var project in projects)
                {
                    object? profile = null;
                    if (project.account.role == "employer")
                    {
                        var employer = await _context.Employers
                            .AsNoTracking()
                            .FirstOrDefaultAsync(e => e.AccountId == project.account._id);
                        if (employer != null)
                        {
                            profile = new { companyName = employer.CompanyName };
                        }
                    }

                    result.Add(new
                    {
                        project._id,
                        project.title,
                        project.location,
                        project.salary,
                        project.workType,
                        project.account,
                        profile
                    });
                }

                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error retrieving projects", error = ex.Message });
            }
        }

        [Authorize(Roles = "student")]
        [HttpGet("applied")]
        public async Task<IActionResult> GetProjectsApplied()
        {
            try
            {
                var accountId = User.FindFirst("AccountId")?.Value;
                if (accountId == null)
                    return Unauthorized(new { message = "AccountId not found in token" });

                var student = await _context.Students
                    .AsNoTracking()
                    .FirstOrDefaultAsync(s => s.AccountId == accountId);

                if (student == null)
                    return NotFound(new { message = "Student not found" });

                var projectsApplied = await _context.Projects
                    .AsNoTracking()
                    .Include(p => p.Account)
                    .Include(p => p.ProjectLocation)
                    .Include(p => p.ProjectApplicants)
                        .ThenInclude(a => a.Student)
                            .ThenInclude(a => a.Account)
                    .Where(p => p.ProjectApplicants.Any(a => a.StudentId == student.StudentId))
                    .OrderByDescending(p => p.CreatedAt)
                    .ToListAsync();

                var result = new List<object>();

                foreach (var project in projectsApplied)
                {
                    object? profile = null;
                    if (project.Account?.AccountRole == "student")
                    {
                        var projectStudent = await _context.Students
                            .AsNoTracking()
                            .FirstOrDefaultAsync(s => s.AccountId == project.Account.AccountId);
                        if (projectStudent != null)
                            profile = new { name = projectStudent.Name };
                    }
                    else if (project.Account?.AccountRole == "employer")
                    {
                        var employer = await _context.Employers
                            .AsNoTracking()
                            .FirstOrDefaultAsync(e => e.AccountId == project.Account.AccountId);
                        if (employer != null)
                            profile = new { companyName = employer.CompanyName };
                    }

                    result.Add(new
                    {
                        _id = project.ProjectId,
                        title = project.Title,
                        location = project.ProjectLocation == null ? null : new
                        {
                            project.ProjectLocation.Province,
                            project.ProjectLocation.District,
                            project.ProjectLocation.Ward
                        },
                        salary = project.Salary,
                        workType = project.WorkType,
                        applicants = project.ProjectApplicants
                        .Where(a => a.StudentId == student.StudentId)
                        .Select(a => new
                        {
                            a.Status,
                            a.Cv,
                            a.CvType,
                            a.CoverLetter,
                            a.AppliedAt,
                            student = a.Student.StudentId
                        }).ToList(),
                        account = project.Account == null ? null : new
                        {
                            _id = project.Account.AccountId,
                            role = project.Account.AccountRole,
                            avatar = project.Account.Avatar == null ? null : new
                            {
                                data = Convert.ToBase64String(project.Account.Avatar),
                                contentType = project.Account.AvatarType
                            }
                        },
                        profile
                    });
                }

                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Server error: " + ex.Message, error = ex.Message });
            }
        }

        [Authorize(Roles = "student")]
        [HttpGet("invitations")]
        public async Task<IActionResult> GetProjectInvitations()
        {
            try
            {
                var accountId = User.FindFirst("AccountId")?.Value;
                if (accountId == null)
                    return Unauthorized(new { message = "AccountId not found in token" });

                var student = await _context.Students
                    .AsNoTracking()
                    .FirstOrDefaultAsync(s => s.AccountId == accountId);

                if (student == null)
                    return NotFound(new { message = "Student not found" });

                var studentId = student.StudentId;

                var projects = await _context.Projects
                    .AsNoTracking()
                    .Include(p => p.Account)
                    .Include(p => p.ProjectLocation)
                    .Include(p => p.ProjectApplicants)
                    .Where(p => p.ProjectApplicants.Any(a => a.StudentId == studentId && a.Status == "invited"))
                    .OrderByDescending(p => p.CreatedAt)
                    .ToListAsync();

                var result = new List<object>();

                foreach (var project in projects)
                {
                    // Filter applicants for this student and status "invited"
                    var applicants = project.ProjectApplicants
                        .Where(a => a.StudentId == studentId && a.Status == "invited")
                        .Select(a => new
                        {
                            a.StudentId,
                            a.Status,
                            a.AppliedAt
                        })
                        .ToList();

                    // Get profile info
                    object? profile = null;
                    if (project.Account?.AccountRole == "student")
                    {
                        var stu = await _context.Students
                            .AsNoTracking()
                            .FirstOrDefaultAsync(s => s.AccountId == project.Account.AccountId);
                        profile = stu != null ? new { name = stu.Name } : null;
                    }
                    else if (project.Account?.AccountRole == "employer")
                    {
                        var emp = await _context.Employers
                            .AsNoTracking()
                            .FirstOrDefaultAsync(e => e.AccountId == project.Account.AccountId);
                        profile = emp != null ? new { companyName = emp.CompanyName } : null;
                    }

                    result.Add(new
                    {
                        _id = project.ProjectId,
                        title = project.Title,
                        location = project.ProjectLocation == null ? null : new
                        {
                            project.ProjectLocation.Province,
                            project.ProjectLocation.District,
                            project.ProjectLocation.Ward
                        },
                        salary = project.Salary,
                        workType = project.WorkType,
                        account = project.Account == null ? null : new
                        {
                            _id = project.Account.AccountId,
                            role = project.Account.AccountRole,
                            avatar = project.Account.Avatar == null ? null : new
                            {
                                data = Convert.ToBase64String(project.Account.Avatar),
                                contentType = project.Account.AvatarType
                            }
                        },
                        applicants,
                        profile
                    });
                }

                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Lỗi khi lấy danh sách lời mời", error = ex.Message });
            }
        }

        [HttpGet("rcm/student/{id}")]
        public async Task<IActionResult> RcmStudentByProject(string id)
        {
            try
            {
                // Find the project
                var project = await _context.Projects
                    .Include(p => p.ProjectMajors)
                    .Include(p => p.ProjectSpecializations)
                    .FirstOrDefaultAsync(p => p.ProjectId == id);

                if (project == null)
                    return NotFound(new { message = "Không tồn tại project" });

                // Get major and specialization IDs
                var majorIds = project.ProjectMajors?.Select(m => m.MajorId).ToList() ?? new List<string>();
                var specializationIds = project.ProjectSpecializations?.Select(s => s.SpecializationId).ToList() ?? new List<string>();

                // Find students with matching major or specialization
                var students = await _context.Students
                    .Include(s => s.Account)
                    .Include(s => s.Major)
                    .Include(s => s.Specialization)
                    .Include(s => s.Cvs)
                    .Where(s =>
                        (s.MajorId != null && majorIds.Count > 0 && majorIds.Contains(s.MajorId)) ||
                        (s.SpecializationId != null && specializationIds.Count > 0 && specializationIds.Contains(s.SpecializationId))
                    )
                    .ToListAsync();

                // Calculate score and filter out students without account
                var scoredStudents = students
                    .Where(s => s.Account != null && s.AccountId != project.AccountId)
                    .Select(s => new
                    {
                        student = s,
                        matchingMajors = majorIds.Contains(s.MajorId) ? 1 : 0,
                        matchingSpecializations = specializationIds.Contains(s.SpecializationId) ? 1 : 0
                    })
                    .Select(x => new
                    {
                        x.student,
                        score = x.matchingMajors * 2 + x.matchingSpecializations
                    })
                    .OrderByDescending(x => x.score)
                    .ToList();

                // Prepare result with populated info
                var result = scoredStudents.Select(x => new
                {
                    _id = x.student.StudentId,
                    x.student.Name,
                    x.student.University,
                    major = x.student.Major == null ? null : new { x.student.Major.MajorId, x.student.Major.Name },
                    specialization = x.student.Specialization == null ? null : new { x.student.Specialization.SpecializationId, x.student.Specialization.Name },
                    account = x.student.Account == null ? null : new
                    {
                        x.student.Account.AccountId,
                        x.student.Account.Email,
                        x.student.Account.AccountRole,
                        x.student.Account.Avatar
                    },
                    defaultCV = new
                    {
                        cv = x.student.DefaultCvId,
                        type = x.student.DefaultCvType,
                    },
                    score = x.score
                }).ToList();

                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Lỗi server", error = ex.Message });
            }
        }

        [HttpGet("rcm/{id}")]
        public async Task<IActionResult> RcmProjectByProject(string id)
        {
            try
            {
                // Find the reference project
                var project = await _context.Projects
                    .Include(p => p.ProjectMajors)
                    .Include(p => p.ProjectSpecializations)
                    .FirstOrDefaultAsync(p => p.ProjectId == id);

                if (project == null)
                    return NotFound(new { message = "Không tồn tại project" });

                var majorIds = project.ProjectMajors?.Select(m => m.MajorId).ToList() ?? new List<string>();
                var specializationIds = project.ProjectSpecializations?.Select(s => s.SpecializationId).ToList() ?? new List<string>();

                // Find similar projects (excluding the current one, status = open, and at least one matching major or specialization)
                var similarProjects = await _context.Projects
                    .AsNoTracking()
                    .Include(p => p.ProjectMajors)
                    .Include(p => p.ProjectSpecializations)
                    .Include(p => p.Account)
                    .Include(p => p.ProjectLocation)
                    .Where(p =>
                        p.ProjectId != project.ProjectId &&
                        p.Deleted == false &&
                        p.Status == "open" &&
                        (
                            (p.ProjectMajors.Any(m => majorIds.Contains(m.MajorId))) ||
                            (p.ProjectSpecializations.Any(s => specializationIds.Contains(s.SpecializationId)))
                        )
                    )
                    .ToListAsync();

                // Calculate score for each project
                var scoredProjects = similarProjects
                    .Where(p => p.Account != null && p.Account.Deleted == false)
                    .Select(p => new
                    {
                        project = p,
                        matchingMajors = p.ProjectMajors.Count(m => majorIds.Contains(m.MajorId)),
                        matchingSpecializations = p.ProjectSpecializations.Count(s => specializationIds.Contains(s.SpecializationId))
                    })
                    .Select(x => new
                    {
                        x.project,
                        score = x.matchingMajors * 2 + x.matchingSpecializations
                    })
                    .OrderByDescending(x => x.score)
                    .ToList();

                // Prepare result with populated info
                var result = scoredProjects.Select(x => new
                {
                    _id = x.project.ProjectId,
                    x.project.Title,
                    x.project.Salary,
                    x.project.Status,
                    x.project.WorkType,
                    location = x.project.ProjectLocation == null ? null : new
                    {
                        x.project.ProjectLocation.Province,
                        x.project.ProjectLocation.District,
                        x.project.ProjectLocation.Ward
                    },
                    account = x.project.Account == null ? null : new
                    {
                        _id = x.project.Account.AccountId,
                        role = x.project.Account.AccountRole,
                        avatar = x.project.Account.Avatar == null ? null : new
                        {
                            data = Convert.ToBase64String(x.project.Account.Avatar),
                            contentType = x.project.Account.AvatarType
                        },
                        deleted = x.project.Account.Deleted
                    },
                    score = x.score
                }).ToList();

                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Lỗi server", error = ex.Message });
            }
        }


        // The student respone employer's request 
        [Authorize]
        [HttpPost("invitations/{projectId}/{response}")]
        public async Task<IActionResult> studentResponeInvitations(string projectId, string response)
        {
            try
            {
                var accountId = User.FindFirst("AccountId")?.Value;
                if (string.IsNullOrEmpty(accountId)) return Unauthorized("Chưa đăng nhập");

                var student = await _context.Students.FirstOrDefaultAsync(t => t.AccountId == accountId);
                if (student == null) return NotFound("Student not found");

                var project = await _context.Projects.SingleOrDefaultAsync(t => t.ProjectId == projectId);
                if (project == null) return NotFound("Project not found");

                var applicant = await _context.ProjectApplicants
                    .SingleOrDefaultAsync(t => t.StudentId == student.StudentId && t.ProjectId == projectId);
                if (applicant == null) return NotFound("You have not been invited to this project");

                if (applicant.Status != "invited")
                    return BadRequest("you have no invitation!");

                var action = response.ToLower();

                switch (action)
                {
                    case "accept":
                        applicant.Status = "accepted";
                        break;
                    case "reject":
                        applicant.Status = "declinedInvitation";
                        break;
                    default:
                        return BadRequest("Invalid action. Must be accept or reject");
                }

                await _context.SaveChangesAsync();

                var newNofi = new Notification
                {
                    AccountId = project.AccountId,
                    Content = $"Ứng viên {student.Name ?? "Sinh viên"} đã {(action == "accept" ? "chấp nhận" : "từ chối")} lời mời vào dự án {project.Title ?? "dự án"}."
                };

                _context.Notifications.Add(newNofi);
                await _context.SaveChangesAsync();

                return Ok(new
                {
                    message = $"You have {(action == "accept" ? "accepted" : "rejected")} the invitation successfully"
                });
            }
            catch
            {
                return StatusCode(500, "Server error");
            }
        }


        //The Employer send request for the students
        [HttpPost("{projectId}/invite/{studentId}")]
        public async Task<IActionResult> InviteStudentToProject(string projectId, string studentId)
        {
            try
            {
                var accountId = User.FindFirst("AccountId")?.Value;
                var project = await _context.Projects.SingleOrDefaultAsync(t => t.ProjectId.Equals(projectId));
                if (project == null) { return NotFound("Project not found"); }

                if (project.Status != "open") { return BadRequest("Project is not open for applicants"); }

                if (project.AccountId != accountId) { return Forbid("You are not authorized to respond to this project"); }

                var student = await _context.Students.SingleOrDefaultAsync(t => t.StudentId.Equals(studentId));
                if (student == null) return BadRequest("Student not found");

                if (student.DefaultCvId == null)
                    return BadRequest("Student's default CV not found");

                var applicant = await _context.ProjectApplicants
            .SingleOrDefaultAsync(t => t.StudentId == student.StudentId && t.ProjectId == project.ProjectId);
                if (applicant != null)
                {
                    if (applicant.Status == "declinedInvitation")
                    {
                        applicant.Status = "invited";
                        applicant.Cv = student.DefaultCvId;
                        applicant.CvType = student.DefaultCvType;
                    }
                    else
                    {
                        return BadRequest("Student has already applied or been invited to this project");
                    }
                }
                else
                {
                    var newAppli = new ProjectApplicant
                    {
                        StudentId = studentId,
                        ProjectId = project.ProjectId,
                        Status = "invited",
                        Cv = student.DefaultCvId,
                        CvType = student.DefaultCvType
                    };

                    _context.ProjectApplicants.Add(newAppli);
                }

                await _context.SaveChangesAsync();

                var account = await _context.Accounts.SingleOrDefaultAsync(t => t.AccountId.Equals(accountId));
                string displayName = "Hệ thống";
                if (account == null)
                    return Forbid("Tài khoản không tồn tại.");

                if (account.AccountRole == "student")
                {
                    var studentProfile = await _context.Students.SingleOrDefaultAsync(t => t.AccountId.Equals(account.AccountId));
                    displayName = studentProfile?.Name ?? "Sinh viên";

                }
                if (account.AccountRole == "employer")
                {
                    var employerProfile = await _context.Employers.SingleOrDefaultAsync(t => t.AccountId.Equals(account.AccountId));
                    displayName = employerProfile?.CompanyName ?? "Nhà tuyển dụng";
                }

                if (string.IsNullOrEmpty(student.AccountId))
                    return BadRequest("Student does not have an associated account.");

                var newNofi = new Notification
                {
                    AccountId = student.AccountId,
                    Content = $"Bạn đã được {displayName} mời vào dự án {project.Title}"
                };

                _context.Notifications.Add(newNofi);
                await _context.SaveChangesAsync();

                return Ok("Student invited successfully");
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Đã xảy ra lỗi nội bộ server." });
            }
        }

        //the student apply the project
        [HttpPost("{projectId}/apply")]
        public async Task<IActionResult> applyToProject(string projectId, [FromBody] ApplyProjectDto request)
        {
            Cv cv = null;
            CvUpload cvUploads = null;
            try
            {
                var accountId = User.FindFirst("AccountId")?.Value;
                if (string.IsNullOrEmpty(accountId)) return Unauthorized("Chưa đăng nhập");

                var project = await _context.Projects.SingleOrDefaultAsync(t => t.ProjectId.Equals(projectId));
                if (project == null) { return NotFound("Project not found"); }

                if (project.Status != "open") { return BadRequest("Project is not open for applicants"); }

                var student = await _context.Students.SingleOrDefaultAsync(t => t.AccountId.Equals(accountId));
                if (student == null) { return NotFound("Student not found"); }

                cv = await _context.Cvs.FirstOrDefaultAsync(t => t.Cvid.Equals(request.cvId) && t.StudentId.Equals(student.StudentId));

                var cvType = "CV";
                if (cv == null)
                {
                    cvUploads = await _context.CvUploads.FirstOrDefaultAsync(t => t.FileId.Equals(request.cvId) && t.StudentId.Equals(student.StudentId));
                    if (cvUploads == null) { return NotFound("CV not found"); }
                    cvType = "CVUpload";
                }

                var applicant = await _context.ProjectApplicants.SingleOrDefaultAsync(t => t.StudentId == student.StudentId && t.ProjectId == project.ProjectId);
                if (applicant != null)
                {
                    if (applicant.Status == "rejected")
                    {
                        applicant.Status = "pending";
                        applicant.Cv = request.cvId;
                        applicant.CvType = cvType;
                        applicant.CoverLetter = request.coverLetter;
                    }
                    else
                    {
                        return BadRequest("Bạn đã ứng tuyển dự án này rồi");
                    }
                }
                else
                {
                    var newAppli = new ProjectApplicant
                    {
                        StudentId = student.StudentId,
                        ProjectId = project.ProjectId,
                        Status = "pending",
                        Cv = cv?.Cvid ?? cvUploads?.FileId,
                        CvType = cvType,
                        CoverLetter = request.coverLetter
                    };
                    _context.ProjectApplicants.Add(newAppli);
                }

                var newNofi = new Notification
                {
                    AccountId = project.AccountId,
                    Content = $"Ứng viên {student.Name} đã ứng tuyển vào dự án {project.Title} của bạn"
                };

                _context.Notifications.Add(newNofi);
                await _context.SaveChangesAsync();

                return Ok("Application submitted successfully");
            }

            catch { return StatusCode(500, "'Server error'"); }
        }
        
        //employer respond student's request 
        [HttpPost("{projectId}/respond/{studentId}")]
        public async Task<IActionResult> RespondToApplication(string projectId, string studentId, [FromBody] ActionDto request)
        {
            try
            {
                var accountId = User.FindFirst("AccountId")?.Value;
                if (string.IsNullOrEmpty(accountId)) return Unauthorized("Chưa đăng nhập");

                var project = await _context.Projects.SingleOrDefaultAsync(t => t.ProjectId == projectId);
                if (project == null) return NotFound("Project not found");

                if (project.AccountId != accountId)
                    return Forbid("You are not authorized to respond to this project");

                var student = await _context.Students.SingleOrDefaultAsync(t => t.StudentId == studentId);
                if (student == null) return NotFound("Student not found");

                var applicant = await _context.ProjectApplicants
                    .SingleOrDefaultAsync(t => t.StudentId == student.StudentId && t.ProjectId == project.ProjectId);
                if (applicant == null)
                    return NotFound("Student did not apply for this project");

                switch (request.Action)
                {
                    case "accept":
                        applicant.Status = "accepted";
                        break;
                    case "reject":
                        applicant.Status = "rejected";
                        break;
                    default:
                        return BadRequest("Invalid action. Must be 'accept' or 'reject'");

                }

                var content = $"Bạn đã {(request.Action == "accept" ? "được chấp nhận" : "bị từ chối")} vào dự án {project.Title ?? "Không tên"}";

                var newNofi = new Notification
                {
                    AccountId = student.AccountId,
                    Content = content
                };

                _context.Notifications.Add(newNofi);
                await _context.SaveChangesAsync();

                return Ok($"Student has been {request.Action}ed successfully");
            }
            catch
            {

                return StatusCode(500, "Server error");
            }
        }

        //student cancel apply in a project

        [HttpDelete("applied/{projectId}")]
        public async Task<IActionResult> deleteAppliedProject(string projectId)
        {
            try
            {
                var accountId = User.FindFirst("AccountId")?.Value;
                if (string.IsNullOrEmpty(accountId)) return Unauthorized("Chưa đăng nhập");

                var student = await _context.Students.SingleOrDefaultAsync(t => t.AccountId.Equals(accountId));
                if (student == null) { return NotFound("Student not found"); }

                var project = await _context.Projects.SingleOrDefaultAsync(t => t.ProjectId == projectId);
                if (project == null) return NotFound("Project not found");

                var studentRemove = await _context.ProjectApplicants
    .SingleOrDefaultAsync(t => t.StudentId.Equals(student.StudentId) && t.ProjectId == project.ProjectId);
                if (studentRemove == null) { return BadRequest("Application not found"); }

                _context.ProjectApplicants.Remove(studentRemove);

                var newNofi = new Notification
                {
                    AccountId = project.AccountId,
                    Content = $"Ứng viên {student.Name} đã rút đơn ứng tuyển khỏi dự án {project.Title} "
                };

                _context.Notifications.Add(newNofi);
                await _context.SaveChangesAsync();

                return Ok("Application deleted successfully");
            }
            catch { return StatusCode(500, "Server error"); }
        }

        //Employer cancel invitation  

        [HttpDelete("invited/{projectId}/{studentId}")]
        public async Task<IActionResult> deleteStudentInvited(string projectId, string studentId)
        {
            try
            {
                var displayName = "";
                var accountId = User.FindFirst("AccountId")?.Value;
                if (string.IsNullOrEmpty(accountId)) return Unauthorized("Chưa đăng nhập");

                var student = await _context.Students.SingleOrDefaultAsync(t => t.StudentId == studentId);
                if (student == null) { return NotFound("Student not found"); }

                var project = await _context.Projects.SingleOrDefaultAsync(t => t.ProjectId == projectId);
                if (project == null) return NotFound("Project not found");

                var applicant = await _context.ProjectApplicants
                    .SingleOrDefaultAsync(p => p.StudentId == student.StudentId && p.ProjectId == project.ProjectId && p.Status == "invited");
                if (applicant == null) return BadRequest("Invitation not found");

                _context.ProjectApplicants.Remove(applicant);

                var account = await _context.Accounts.SingleOrDefaultAsync(t => t.AccountId.Equals(project.AccountId));
                if (account == null) { return BadRequest("Account not found"); }

                if (account.AccountRole == "student")
                {
                    var studentProfile = await _context.Students.SingleOrDefaultAsync(t => t.AccountId.Equals(account.AccountId));
                    displayName = studentProfile?.Name ?? "Sinh viên";

                }
                if (account.AccountRole == "employer")
                {
                    var employerProfile = await _context.Employers.SingleOrDefaultAsync(t => t.AccountId.Equals(account.AccountId));
                    displayName = employerProfile?.CompanyName ?? "Nhà tuyển dụng";
                }

                if (string.IsNullOrEmpty(student.AccountId))
                    return BadRequest("Student does not have an associated account.");

                var newNofi = new Notification
                {
                    AccountId = student.AccountId,
                    Content = $"{displayName} hủy lời mời vào dự án {project.Title}"
                };

                _context.Notifications.Add(newNofi);
                await _context.SaveChangesAsync();

                return Ok("Application deleted successfully");
            }
            catch { return StatusCode(500, "Server error"); }
        }
    }
}
