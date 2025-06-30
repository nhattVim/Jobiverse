using System;

namespace api.DTOs.CV;

public class CvEducationsDto
{
    public string? Degree { get; set; }

    public string? School { get; set; }

    public DateTime? Start{ get; set; }

    public DateTime? End{ get; set; }
}
