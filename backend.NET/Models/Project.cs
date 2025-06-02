using System;
using System.Collections.Generic;

namespace api.Models;

public partial class Project
{
    public string ProjectId { get; set; } = null!;

    public string AccountId { get; set; } = null!;

    public string? Title { get; set; }

    public string? Description { get; set; }

    public string? Location { get; set; }

    public string? Content { get; set; }

    public string? WorkingTime { get; set; }

    public string? Status { get; set; }

    public decimal? Salary { get; set; }

    public int? ExpRequired { get; set; }

    public DateTime? Deadline { get; set; }

    public int? HiringCount { get; set; }

    public string? WorkType { get; set; }

    public DateTime? CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public bool? Deleted { get; set; }

    public virtual Account Account { get; set; } = null!;

    public virtual ICollection<Favorite> Favorites { get; set; } = new List<Favorite>();

    public virtual ProjectLocation? ProjectLocation { get; set; }

    public virtual ICollection<Student> ApplicantStudents { get; set; } = new List<Student>();

    public virtual ICollection<Student> AssignedStudents { get; set; } = new List<Student>();

    public virtual ICollection<Major> Majors { get; set; } = new List<Major>();

    public virtual ICollection<Specialization> Specializations { get; set; } = new List<Specialization>();
}
