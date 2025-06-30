using System;
using System.Collections.Generic;

namespace api.Models;

public partial class CvActivity
{
    public string ActivityId { get; set; } = null!;

    public string? Cvid { get; set; }

    public string? Title { get; set; }

    public string? Organization { get; set; }

    public DateTime? StartDate { get; set; }

    public DateTime? EndDate { get; set; }

    public string? Description { get; set; }

    public virtual Cv? Cv { get; set; }
}
