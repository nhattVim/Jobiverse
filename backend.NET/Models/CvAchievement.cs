using System;
using System.Collections.Generic;

namespace api.Models;

public partial class CvAchievement
{
    public string AchievementId { get; set; } = null!;

    public string? Cvid { get; set; }

    public string? Title { get; set; }

    public string? Description { get; set; }

    public virtual Cv? Cv { get; set; }
}
