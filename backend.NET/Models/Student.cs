using System;
using System.Collections.Generic;

namespace api.Models;

public partial class Student
{
    public string StudentId { get; set; } = null!;

    public string AccountId { get; set; } = null!;

    public string? Mssv { get; set; }

    public string? Name { get; set; }

    public string? MajorId { get; set; }

    public string? SpecializationId { get; set; }

    public string? University { get; set; }

    public string? DefaultCvId { get; set; }

    public string? DefaultCvType { get; set; }

    public virtual Account Account { get; set; } = null!;

    public virtual ICollection<CvUpload> CvUploads { get; set; } = new List<CvUpload>();

    public virtual ICollection<Cv> Cvs { get; set; } = new List<Cv>();

    public virtual Major? Major { get; set; }

    public virtual ICollection<ProjectApplicant> ProjectApplicants { get; set; } = new List<ProjectApplicant>();

    public virtual Specialization? Specialization { get; set; }

    public virtual ICollection<StudentsInterest> StudentsInterests { get; set; } = new List<StudentsInterest>();
}
