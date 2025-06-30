using System.IdentityModel.Tokens.Jwt;
using System.Text;
using System.Text.Json;
using System.Text.Json.Serialization;
using api.Models;
using api.Settings;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

var builder = WebApplication.CreateBuilder(args);
var jwtSettings = builder.Configuration.GetSection("Jwt").Get<JwtSettings>() ?? new JwtSettings();

builder.Services.Configure<JwtSettings>(builder.Configuration.GetSection("Jwt"));
builder.Services.AddControllers().AddJsonOptions(opt =>
    opt.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles
);
builder.Services.AddHttpClient();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddOpenApi();
builder.Logging.ClearProviders();
builder.Logging.AddConsole();
builder.Logging.SetMinimumLevel(LogLevel.Information);
builder.Services.AddDbContext<JobiverseContext>(options =>
    options.UseMySQL(builder.Configuration.GetConnectionString("AivenConnection") ?? "")
);

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend",
        policy =>
        {
            policy.WithOrigins("https://localhost:5173", "http://localhost:5173")
                .AllowAnyHeader()
                .AllowAnyMethod()
                .AllowCredentials();
        });
});

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
}).AddJwtBearer(options =>
{
    options.SaveToken = true;
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,

        ValidIssuer = jwtSettings.Issuer,
        ValidAudience = jwtSettings.Audience,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSettings.Key)),
        ClockSkew = TimeSpan.Zero
    };

    options.Events = new JwtBearerEvents
    {
        OnAuthenticationFailed = context =>
        {
            context.Response.StatusCode = 498;
            context.Response.ContentType = "application/json";
            context.Response.Headers.Append("Set-Cookie", "tokenNET=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0");

            string message = context.Exception is SecurityTokenExpiredException
                ? "Token đã hết hạn"
                : "Token không hợp lệ";

            var result = JsonSerializer.Serialize(new { message });
            return context.Response.WriteAsync(result);
        },

        OnMessageReceived = context =>
        {
            var accessToken = context.Request.Cookies["tokenNET"];
            if (!string.IsNullOrEmpty(accessToken))
            {
                context.Token = accessToken;
            }
            return Task.CompletedTask;
        },

        OnChallenge = context =>
        {
            context.HandleResponse();

            if (!context.Response.HasStarted)
            {
                context.Response.StatusCode = 498;
                context.Response.ContentType = "application/json";
                context.Response.Headers.Append("Set-Cookie", "tokenNET=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0");

                var result = JsonSerializer.Serialize(new { message = "Không có token hoặc chưa đăng nhập" });
                return context.Response.WriteAsync(result);
            }

            return Task.CompletedTask;
        }
    };
})
.AddGoogle(options =>
{
    options.ClientId = "635002964281-ot6df7tfd9c9uut42a2s39oaq31u5q5j.apps.googleusercontent.com";
    options.ClientSecret = "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";
})
.AddFacebook(options =>
{
    options.AppId = "1206494790558399";
    options.AppSecret = "e34a93b706235678678c627d27eeb17d";
    options.Events.OnCreatingTicket = ctx =>
    {
        // Lấy thông tin user từ Facebook, xử lý tương tự
        return Task.CompletedTask;
    };
});

var app = builder.Build();
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("AllowFrontend");

app.UseAuthentication();

app.UseAuthorization();

app.UseExceptionHandler(new ExceptionHandlerOptions
{
    ExceptionHandlingPath = "/error",
    AllowStatusCode404Response = true
});

app.MapControllers();

app.MapGet("/health-check", () => Results.Ok(new { status = "ok" }));

app.Run();
