using System;
using System.Collections.Generic;

namespace api.Models;

public partial class Specialization
{
    public string SpecializationId { get; set; } = null!;

    public string? MajorId { get; set; }

    public string Name { get; set; } = null!;

    public string? Description { get; set; }

    public virtual Major? Major { get; set; }

    public virtual ICollection<Student> Students { get; set; } = new List<Student>();
}
