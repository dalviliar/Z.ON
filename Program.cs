using Microsoft.AspNetCore.Localization;
using System.Globalization;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddRazorPages();
builder.Services.AddLocalization(o => o.ResourcesPath = "Resources");

var supportedCultures = new[] { "ru", "kk", "en" };
var locOptions = new RequestLocalizationOptions()
    .SetDefaultCulture("ru")
    .AddSupportedCultures(supportedCultures)
    .AddSupportedUICultures(supportedCultures);
locOptions.RequestCultureProviders.Insert(0, new CookieRequestCultureProvider());

var app = builder.Build();

if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Error");
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseRequestLocalization(locOptions);
app.UseRouting();
app.UseAuthorization();

// Culture switch endpoint
app.MapGet("/set-culture/{culture}", (string culture, string? returnUrl, HttpContext ctx) =>
{
    var allowed = new[] { "ru", "kk", "en" };
    if (!allowed.Contains(culture)) culture = "ru";
    ctx.Response.Cookies.Append(
        CookieRequestCultureProvider.DefaultCookieName,
        CookieRequestCultureProvider.MakeCookieValue(new RequestCulture(culture)),
        new CookieOptions { Expires = DateTimeOffset.UtcNow.AddYears(1), IsEssential = true }
    );
    return Results.Redirect(returnUrl ?? "/");
});

app.MapStaticAssets();
app.MapRazorPages().WithStaticAssets();

app.Run();
