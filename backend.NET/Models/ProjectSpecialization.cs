using System;
using System.Collections.Generic;

namespace api.Models;

public partial class ProjectSpecialization
{
    public string ProjectId { get; set; } = null!;

    public string SpecializationId { get; set; } = null!;

    public virtual Project Project { get; set; } = null!;
}
