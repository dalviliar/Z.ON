using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;

namespace Z.ONLanding.Pages;

public class ContactsModel : PageModel
{
    public void OnGet() { }

    public IActionResult OnPostSend(string name, string email, string? phone, string? company, string message)
    {
        if (string.IsNullOrWhiteSpace(name) || string.IsNullOrWhiteSpace(email) || string.IsNullOrWhiteSpace(message))
            return BadRequest();

        // TODO: подключить email/Telegram-уведомление
        return new OkResult();
    }
}
