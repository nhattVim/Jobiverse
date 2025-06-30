using System;
using System.Collections.Generic;

namespace api.Models;

public partial class ProjectLocation
{
    public string ProjectId { get; set; } = null!;

    public string? Province { get; set; }

    public string? District { get; set; }

    public string? Ward { get; set; }

    public virtual Project Project { get; set; } = null!;
}
