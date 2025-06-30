using System;
using System.Collections.Generic;

namespace api.Models;

public partial class ProjectApplicant
{
    public string ProjectId { get; set; } = null!;

    public string StudentId { get; set; } = null!;

    public string? Cv { get; set; }

    public string? CvType { get; set; }

    public string? CoverLetter { get; set; }

    public string? Status { get; set; }

    public DateTime? AppliedAt { get; set; }

    public virtual Project Project { get; set; } = null!;

    public virtual Student Student { get; set; } = null!;
}
