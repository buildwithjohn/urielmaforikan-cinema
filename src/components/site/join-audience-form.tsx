"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { joinAudience, type AudienceState } from "@/app/actions/audience";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CheckCircle2, Loader2, Mail } from "lucide-react";

const initial: AudienceState = { ok: false, message: "" };

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="sm:w-auto">
      {pending ? (
        <>
          <Loader2 className="animate-spin" /> Joining…
        </>
      ) : (
        <>
          <Mail /> Join the audience
        </>
      )}
    </Button>
  );
}

export function JoinAudienceForm() {
  const [state, formAction] = useActionState(joinAudience, initial);

  if (state.ok) {
    return (
      <div className="flex items-start gap-3 rounded-lg border border-gold/30 bg-gold/5 p-5 text-cream">
        <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-gold" />
        <p className="text-sm leading-relaxed">{state.message}</p>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-3">
      <div className="flex flex-col gap-3 sm:flex-row">
        <Input
          name="name"
          type="text"
          placeholder="Your name (optional)"
          autoComplete="name"
          className="sm:max-w-[40%]"
        />
        <Input
          name="email"
          type="email"
          required
          placeholder="you@email.com"
          autoComplete="email"
          aria-label="Email address"
        />
        <SubmitButton />
      </div>
      <label className="flex items-start gap-2 text-xs text-cream-muted">
        <input
          type="checkbox"
          name="consent"
          defaultChecked
          className="mt-0.5 accent-gold"
        />
        Send me premiere invites and news. I can unsubscribe anytime.
      </label>
      {state.message && !state.ok && (
        <p className="text-sm text-red-400">{state.message}</p>
      )}
    </form>
  );
}
