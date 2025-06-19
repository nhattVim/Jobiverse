using System;
using System.Collections.Generic;

namespace api.Models;

public partial class StudentsInterest
{
    public string StudentId { get; set; } = null!;

    public string Interest { get; set; } = null!;

    public virtual Student Student { get; set; } = null!;
}
