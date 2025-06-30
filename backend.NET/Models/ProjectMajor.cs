using System;
using System.Collections.Generic;

namespace api.Models;

public partial class ProjectMajor
{
    public string ProjectId { get; set; } = null!;

    public string MajorId { get; set; } = null!;

    public virtual Project Project { get; set; } = null!;
}
