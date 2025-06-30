using System;
using System.Text.Json.Serialization;
using api.DTOs.CV;
using api.Models;

namespace api.DTOs.CV;

public class CvDto
{
    public string? _id { get; set; }

    public string? Student { get; set; }

    public string? Title { get; set; }

    public string? Avatar { get; set; }

    public string? Name { get; set; }

    public DateTime? Birthday { get; set; }

    public string? Gender { get; set; }

    public string? Phone { get; set; }

    public string? Email { get; set; }

    public string? Address { get; set; }

    public string? Website { get; set; }

    public string? Summary { get; set; }

    public string? DesiredPosition { get; set; }

    public List<CvAchievementsDto>? Achievements { get; set; } = new List<CvAchievementsDto>();

    public List<CvActivitiesDto>? Activities { get; set; } = new List<CvActivitiesDto>();

    public List<CvEducationsDto>? Educations { get; set; } = new List<CvEducationsDto>();

    public List<CvExperiencesDto>? Experiences { get; set; } = new List<CvExperiencesDto>();

    public List<CvLanguagesDto>? Languages { get; set; } = new List<CvLanguagesDto>();

    public List<CvSocialsDto>? Socials { get; set; } = new List<CvSocialsDto>();

    public List<string>? Skills { get; set; }

    public DateTime? LastUpdated { get; set; }

    public bool? Deleted { get; set; }
}
