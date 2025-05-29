using System;

namespace api.DTOs.CV;

public class CvActivitiesDto
{
    public string? Title { get; set; }

    public string? Organization { get; set; }

    public DateTime? StartDate { get; set; }

    public DateTime? EndDate { get; set; }

    public string? Description { get; set; }
}
