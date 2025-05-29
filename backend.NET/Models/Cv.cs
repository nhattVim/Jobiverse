using System;
using System.Collections.Generic;

namespace api.Models;

public partial class Cv
{
    public string Cvid { get; set; } = null!;

    public string StudentId { get; set; } = null!;

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

    public DateTime? LastUpdated { get; set; }

    public bool? Deleted { get; set; }

    public virtual ICollection<CvAchievement> CvAchievements { get; set; } = new List<CvAchievement>();

    public virtual ICollection<CvActivity> CvActivities { get; set; } = new List<CvActivity>();

    public virtual ICollection<CvEducation> CvEducations { get; set; } = new List<CvEducation>();

    public virtual ICollection<CvExperience> CvExperiences { get; set; } = new List<CvExperience>();

    public virtual ICollection<CvLanguage> CvLanguages { get; set; } = new List<CvLanguage>();

    public virtual ICollection<CvSkill> CvSkills { get; set; } = new List<CvSkill>();

    public virtual ICollection<CvSocial> CvSocials { get; set; } = new List<CvSocial>();

    public virtual Student Student { get; set; } = null!;
}
