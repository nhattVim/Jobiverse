using System;
using System.Collections.Generic;

namespace api.Models;

public partial class CvEducation
{
    public string EducationId { get; set; } = null!;

    public string? Cvid { get; set; }

    public string? Degree { get; set; }

    public string? School { get; set; }

    public DateTime? StartDate { get; set; }

    public DateTime? EndDate { get; set; }

    public virtual Cv? Cv { get; set; }
}
