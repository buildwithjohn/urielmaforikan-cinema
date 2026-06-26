# Email setup — Resend + Supabase

There are **two separate email systems** in this platform. Don't confuse them:

| System | Sends | Configured where |
|--------|-------|------------------|
| **Supabase Auth** | Sign-in magic links, "confirm your email" | Supabase dashboard (SMTP) |
| **Resend (app)** | Audience welcome, premiere invites | `RESEND_*` env vars (already coded) |

The ugly default email you saw — *"Supabase Auth · Confirm your email address · powered by Supabase"* — is **Supabase Auth using its built-in shared mailer**. To make those emails come from *your* domain and look like the ministry, point Supabase Auth at **Resend over SMTP** and customize the templates. Steps below.

---

## Part A — Domain verification in Resend (do this first)

1. In **Resend → Domains → Add Domain**, add `urielmaforikan.org` (or a subdomain like `mail.urielmaforikan.org`).
2. Resend shows DNS records (SPF, DKIM, and a return-path). Add them at your domain registrar / DNS host.
3. Wait for Resend to show the domain as **Verified** (minutes to a few hours).

Until the domain is verified, emails either don't send or land in spam. This one step fixes most "my emails go to junk" problems.

> No domain yet? Resend gives you `onboarding@resend.dev` for testing — fine for development, not for launch.

---

## Part B — Point Supabase Auth at Resend (custom SMTP)

This makes magic-link / confirmation emails send through Resend from your address.

1. In **Resend → API Keys**, create a key (you'll use it as the SMTP password).
2. In **Supabase → Project Settings → Authentication → SMTP Settings**, turn on **Custom SMTP** and enter:

   | Field | Value |
   |-------|-------|
   | Host | `smtp.resend.com` |
   | Port | `465` (SSL) or `587` (TLS) |
   | Username | `resend` |
   | Password | *your Resend API key* (`re_...`) |
   | Sender email | `hello@urielmaforikan.org` (must be on a **verified** Resend domain) |
   | Sender name | `Uriel Maforikan Productions` |

3. Save. Supabase now relays all auth emails through Resend.

> **Rate limits:** Supabase's built-in mailer is throttled (a few/hour). Custom SMTP via Resend removes that limit — important for premiere nights.

---

## Part C — Make the auth emails on-brand

By default Supabase sends a plain "Confirm your email address." Replace the copy and styling.

### 1. Turn the flow into a clean magic link
In **Supabase → Authentication → Providers → Email**, you can disable *"Confirm email"* if you want first sign-in to be a one-click magic link rather than a confirm-then-link two-step. (Leaving confirmation on is also fine — just brand the template below.)

### 2. Brand the templates
In **Supabase → Authentication → Email Templates**, edit **Magic Link** (and **Confirm signup**). Paste this branded HTML. Keep the `{{ .ConfirmationURL }}` variable exactly as-is — Supabase fills it in.

```html
<table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0f1d;padding:40px 0;font-family:Georgia,'Times New Roman',serif;">
  <tr><td align="center">
    <table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;">
      <tr><td style="padding:0 32px 24px;border-bottom:1px solid rgba(199,154,75,.25);">
        <div style="font-size:13px;letter-spacing:3px;text-transform:uppercase;color:#c79a4b;">Uriel Maforikan Productions</div>
        <div style="font-size:12px;color:#9b9484;font-style:italic;margin-top:4px;">Evangelists who carry cameras</div>
      </td></tr>
      <tr><td style="padding:32px;">
        <h1 style="font-size:26px;margin:0 0 16px;color:#f4efe4;font-weight:normal;">Enter the cinema</h1>
        <p style="font-size:16px;line-height:1.7;color:#cfc8b8;">
          Click below to sign in. No password to remember — the lights are on and the doors are open.
        </p>
        <p style="margin:28px 0 8px;">
          <a href="{{ .ConfirmationURL }}" style="display:inline-block;background:#c79a4b;color:#0a0f1d;text-decoration:none;padding:13px 28px;border-radius:6px;font-family:Arial,sans-serif;font-size:14px;font-weight:bold;letter-spacing:.5px;">
            Sign in to the cinema
          </a>
        </p>
        <p style="font-size:13px;line-height:1.6;color:#6f6a5e;margin-top:24px;">
          If you didn't request this, you can safely ignore it. This link expires shortly.
        </p>
      </td></tr>
      <tr><td style="padding:24px 32px;border-top:1px solid rgba(199,154,75,.25);font-family:Arial,sans-serif;font-size:12px;color:#6f6a5e;">
        Uriel Maforikan Productions — light into dark.
      </td></tr>
    </table>
  </td></tr>
</table>
```

---

## Part D — Redirect URLs (so the link actually signs people in)

In **Supabase → Authentication → URL Configuration**:
- **Site URL:** `https://urielmaforikan-cinema.vercel.app` (your production URL)
- **Redirect URLs:** add both
  - `https://urielmaforikan-cinema.vercel.app/auth/callback`
  - `http://localhost:3000/auth/callback`

Without the production callback whitelisted, the magic link verifies but can't complete sign-in on the live site.

---

## Part E — The app's own emails (Resend) — already coded

The welcome + premiere-invite emails use Resend directly via `src/lib/email`. Set these env vars (Vercel + `.env.local`):

```
RESEND_API_KEY=re_...
RESEND_FROM="Uriel Maforikan Productions <hello@urielmaforikan.org>"
RESEND_AUDIENCE_ID=...   # optional — Resend → Audiences, to build a mailing list
```

These send from the same verified domain. If `RESEND_API_KEY` is unset, the app skips them silently (no crash) — so you can launch and add email later.

---

## Quick checklist
- [ ] Resend domain verified (DNS records added)
- [ ] Supabase Custom SMTP → Resend
- [ ] Auth email templates branded
- [ ] Site URL + redirect URLs set
- [ ] `RESEND_*` env vars in Vercel
