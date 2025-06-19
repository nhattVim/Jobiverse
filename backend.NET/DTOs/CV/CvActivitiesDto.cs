using System;

namespace api.DTOs.CV;

public class CvActivitiesDto
{
    public string? Title { get; set; }

    public string? Organization { get; set; }

    public DateTime? Start { get; set; }

    public DateTime? End { get; set; }

    public string? Description { get; set; }
}
