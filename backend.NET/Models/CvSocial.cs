using System;
using System.Collections.Generic;

namespace api.Models;

public partial class CvSocial
{
    public string SocialId { get; set; } = null!;

    public string? Cvid { get; set; }

    public string? Platform { get; set; }

    public string? Link { get; set; }

    public virtual Cv? Cv { get; set; }
}
