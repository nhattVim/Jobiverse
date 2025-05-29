using System;
using System.Collections.Generic;

namespace api.Models;

public partial class Account
{
    public string AccountId { get; set; } = null!;

    public string AccountRole { get; set; } = null!;

    public string AuthProvider { get; set; } = null!;

    public string? Email { get; set; }

    public byte[]? Avatar { get; set; }

    public string? AvatarType { get; set; }

    public string? PhoneNumber { get; set; }

    public string? Password { get; set; }

    public bool? Profile { get; set; }

    public bool? Deleted { get; set; }

    public virtual Employer? Employer { get; set; }

    public virtual ICollection<Favorite> Favorites { get; set; } = new List<Favorite>();

    public virtual ICollection<Notification> Notifications { get; set; } = new List<Notification>();

    public virtual ICollection<Project> Projects { get; set; } = new List<Project>();

    public virtual Student? Student { get; set; }
}
