using System;
using System.Collections.Generic;

namespace api.Models;

public partial class Employer
{
    public string EmployerId { get; set; } = null!;

    public string AccountId { get; set; } = null!;

    public string BusinessScale { get; set; } = null!;

    public string? CompanyName { get; set; }

    public string? RepresentativeName { get; set; }

    public string? Position { get; set; }

    public string? Industry { get; set; }

    public string? CompanyInfo { get; set; }

    public string? Prove { get; set; }

    public string? Address { get; set; }

    public virtual Account Account { get; set; } = null!;
}
