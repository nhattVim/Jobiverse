using System;
using System.Collections.Generic;

namespace api.Models;

public partial class CvUpload
{
    public string FileId { get; set; } = null!;

    public string StudentId { get; set; } = null!;

    public string? Title { get; set; }

    public string? FileName { get; set; }

    public byte[]? File { get; set; }

    public string? FileType { get; set; }

    public DateTime? UploadedAt { get; set; }

    public virtual Student Student { get; set; } = null!;
}
