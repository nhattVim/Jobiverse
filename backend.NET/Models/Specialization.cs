﻿using System;
using System.Collections.Generic;

namespace api.Models;

public partial class Specialization
{
    public string SpecializationId { get; set; } = null!;

    public string? MajorId { get; set; }

    public string Name { get; set; } = null!;

    public string Description { get; set; } = null!;

    public virtual Major? Major { get; set; }

    public virtual ICollection<Student> Students { get; set; } = new List<Student>();

    public virtual ICollection<Project> Projects { get; set; } = new List<Project>();
}
