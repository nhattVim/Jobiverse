using System;
using System.Collections.Generic;

namespace api.Models;

public partial class CvLanguage
{
    public string LanguageId { get; set; } = null!;

    public string? Cvid { get; set; }

    public string? Language { get; set; }

    public string? Level { get; set; }

    public virtual Cv? Cv { get; set; }
}
