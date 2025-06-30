using System;

namespace api.Settings;

public class JwtSettings
{
  public string Key { get; set; } = string.Empty;
  public string Issuer { get; set; } = string.Empty;
  public string Audience { get; set; } = string.Empty;
  public int ExpiresInMinutes { get; set; }
}
