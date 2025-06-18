using System;
using System.Collections.Generic;

namespace api.Models;

public partial class Favorite
{
    public string AccountId { get; set; } = null!;

    public string ProjectId { get; set; } = null!;

    public DateTime? CreatedAt { get; set; }

    public virtual Account Account { get; set; } = null!;

    public virtual Project Project { get; set; } = null!;
}
