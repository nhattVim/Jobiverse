using System;
using System.Collections.Generic;

namespace api.Models;

public partial class CvExperience
{
    public string ExperienceId { get; set; } = null!;

    public string? Cvid { get; set; }

    public string? Position { get; set; }

    public string? Company { get; set; }

    public DateTime? StartDate { get; set; }

    public DateTime? EndDate { get; set; }

    public string? Description { get; set; }

    public virtual Cv? Cv { get; set; }
}
