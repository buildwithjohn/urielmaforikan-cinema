// Plain, dependency-free HTML email templates in the brand palette.
// Kept inline (no React Email) so the email layer has zero render deps.

const NAVY = "#000000";
const GOLD = "#c79a4b";
const CREAM = "#f4efe4";

function shell(title: string, body: string) {
  return `<!doctype html><html><body style="margin:0;background:${NAVY};font-family:Georgia,'Times New Roman',serif;color:${CREAM};">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:${NAVY};padding:40px 0;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;">
        <tr><td style="padding:0 32px 24px;border-bottom:1px solid rgba(199,154,75,.25);">
          <div style="font-size:13px;letter-spacing:3px;text-transform:uppercase;color:${GOLD};">Uriel Maforikan Productions</div>
          <div style="font-size:12px;color:#9b9484;font-style:italic;margin-top:4px;">Evangelists who carry cameras</div>
        </td></tr>
        <tr><td style="padding:32px;">
          <h1 style="font-size:26px;margin:0 0 16px;color:${CREAM};font-weight:normal;">${title}</h1>
          ${body}
        </td></tr>
        <tr><td style="padding:24px 32px;border-top:1px solid rgba(199,154,75,.25);font-family:Arial,sans-serif;font-size:12px;color:#6f6a5e;">
          You're receiving this because you joined the audience at Uriel Maforikan Productions.
        </td></tr>
      </table>
    </td></tr>
  </table></body></html>`;
}

function button(href: string, label: string) {
  return `<a href="${href}" style="display:inline-block;background:${GOLD};color:${NAVY};text-decoration:none;padding:13px 28px;border-radius:6px;font-family:Arial,sans-serif;font-size:14px;font-weight:bold;letter-spacing:.5px;">${label}</a>`;
}

export function audienceWelcomeEmail(name?: string | null) {
  const greeting = name ? `Welcome, ${name}.` : "Welcome to the audience.";
  return {
    subject: "You've joined the audience — Uriel Maforikan Productions",
    html: shell(
      greeting,
      `<p style="font-size:16px;line-height:1.7;color:#cfc8b8;">
        Thank you for joining us. We make films the way evangelists carry cameras —
        every story is an invitation. You'll be the first to know when a new film opens
        and when we hold a premiere you can attend from anywhere.
      </p>
      <p style="font-size:16px;line-height:1.7;color:#cfc8b8;">
        When the lights come up, there's always a next step waiting.
      </p>
      <p style="margin:28px 0 8px;">${button(
        process.env.NEXT_PUBLIC_SITE_URL ?? "https://urielmaforikan.org",
        "Enter the cinema",
      )}</p>`,
    ),
  };
}

export function premiereInviteEmail(opts: {
  name?: string | null;
  filmTitle: string;
  premiereUrl: string;
  opensAt: string;
}) {
  return {
    subject: `You're invited: the premiere of "${opts.filmTitle}"`,
    html: shell(
      `The premiere of "${opts.filmTitle}"`,
      `<p style="font-size:16px;line-height:1.7;color:#cfc8b8;">
        ${opts.name ? `${opts.name}, you're` : "You're"} invited to watch together with the
        whole audience. The film opens on <strong style="color:${CREAM};">${opts.opensAt}</strong>.
      </p>
      <p style="font-size:16px;line-height:1.7;color:#cfc8b8;">
        Reserve your seat and we'll hold the doors.
      </p>
      <p style="margin:28px 0 8px;">${button(opts.premiereUrl, "Reserve my seat")}</p>`,
    ),
  };
}
