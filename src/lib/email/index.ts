import "server-only";
import { Resend } from "resend";
import { audienceWelcomeEmail, premiereInviteEmail } from "./templates";

function resend() {
  const key = process.env.RESEND_API_KEY;
  if (!key) return null; // soft-fail in dev when email isn't configured
  return new Resend(key);
}

const FROM =
  process.env.RESEND_FROM ??
  "Uriel Maforikan Productions <onboarding@resend.dev>";

/** Add a viewer to the Resend audience list (idempotent-ish; ignores dup errors). */
export async function addToAudience(email: string, name?: string | null) {
  const client = resend();
  const audienceId = process.env.RESEND_AUDIENCE_ID;
  if (!client || !audienceId) return;
  const [firstName, ...rest] = (name ?? "").split(" ");
  try {
    await client.contacts.create({
      audienceId,
      email,
      firstName: firstName || undefined,
      lastName: rest.join(" ") || undefined,
      unsubscribed: false,
    });
  } catch (err) {
    console.warn("[email] addToAudience failed:", err);
  }
}

export async function sendWelcomeEmail(to: string, name?: string | null) {
  const client = resend();
  if (!client) return;
  const { subject, html } = audienceWelcomeEmail(name);
  await client.emails.send({ from: FROM, to, subject, html });
}

export async function sendPremiereInvite(opts: {
  to: string;
  name?: string | null;
  filmTitle: string;
  premiereUrl: string;
  opensAt: string;
}) {
  const client = resend();
  if (!client) return;
  const { subject, html } = premiereInviteEmail(opts);
  await client.emails.send({ from: FROM, to: opts.to, subject, html });
}
