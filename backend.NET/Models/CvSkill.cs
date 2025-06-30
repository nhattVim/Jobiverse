using System;
using System.Collections.Generic;

namespace api.Models;

public partial class CvSkill
{
    public string SkillId { get; set; } = null!;

    public string? Cvid { get; set; }

    public string? SkillName { get; set; }

    public virtual Cv? Cv { get; set; }
}
