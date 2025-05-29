using System;
using System.Collections.Generic;

namespace api.Models;

public partial class Notification
{
    public string NotificationId { get; set; } = null!;

    public string AccountId { get; set; } = null!;

    public string? Content { get; set; }

    public sbyte? IsRead { get; set; }

    public DateTime? CreatedAt { get; set; }

    public bool? Deleted { get; set; }

    public virtual Account Account { get; set; } = null!;
}
