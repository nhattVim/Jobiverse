﻿using System;
using System.Collections.Generic;

namespace api.Models;

public partial class Major
{
    public string MajorId { get; set; } = null!;

    public string Name { get; set; } = null!;

    public string Description { get; set; } = null!;

    public virtual ICollection<Specialization> Specializations { get; set; } = new List<Specialization>();

    public virtual ICollection<Student> Students { get; set; } = new List<Student>();

    public virtual ICollection<Project> Projects { get; set; } = new List<Project>();
}
