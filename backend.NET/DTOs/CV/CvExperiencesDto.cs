using System;

namespace api.DTOs.CV;

public class CvExperiencesDto
{
    public string? Company { get; set; }

    public string? Position { get; set; }

    public DateTime? Start { get; set; }

    public DateTime? End { get; set; }

    public string? Description { get; set; }
}
