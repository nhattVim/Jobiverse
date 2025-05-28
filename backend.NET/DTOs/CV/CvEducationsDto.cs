using System;

namespace api.DTOs.CV;

public class CvEducationsDto
{
    public string? Degree { get; set; }

    public string? School { get; set; }

    public DateTime? StartDate { get; set; }

    public DateTime? EndDate { get; set; }
}
