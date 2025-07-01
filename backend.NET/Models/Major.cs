using System;
using System.Collections.Generic;

namespace api.Models;

public partial class Major
{
    public string MajorId { get; set; } = null!;

    public string Name { get; set; } = null!;

    public string? Description { get; set; }

    public virtual ICollection<Specialization> Specializations { get; set; } = new List<Specialization>();

    public virtual ICollection<Student> Students { get; set; } = new List<Student>();
}
