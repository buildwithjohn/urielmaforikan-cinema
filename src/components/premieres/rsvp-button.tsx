"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import Link from "next/link";
import { rsvpToPremiere, type RsvpState } from "@/app/actions/premieres";
import { Button } from "@/components/ui/button";
import { CalendarCheck, Check, Loader2 } from "lucide-react";

const initial: RsvpState = { ok: false, message: "" };

function Submit({ alreadyRsvped }: { alreadyRsvped: boolean }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending || alreadyRsvped} variant={alreadyRsvped ? "outline" : "default"}>
      {pending ? (
        <>
          <Loader2 className="animate-spin" /> Reserving…
        </>
      ) : alreadyRsvped ? (
        <>
          <Check /> Seat reserved
        </>
      ) : (
        <>
          <CalendarCheck /> Reserve my seat
        </>
      )}
    </Button>
  );
}

export function RsvpButton({
  premiereId,
  signedIn,
  alreadyRsvped,
}: {
  premiereId: string;
  signedIn: boolean;
  alreadyRsvped: boolean;
}) {
  const [state, formAction] = useActionState(rsvpToPremiere, initial);

  if (!signedIn) {
    return (
      <Button asChild variant="outline">
        <Link href="/auth/sign-in?next=/premieres">Sign in to RSVP</Link>
      </Button>
    );
  }

  return (
    <form action={formAction} className="flex flex-col items-start gap-2">
      <input type="hidden" name="premiereId" value={premiereId} />
      <Submit alreadyRsvped={alreadyRsvped || state.ok} />
      {state.message && (
        <p className={`text-xs ${state.ok ? "text-gold" : "text-red-400"}`}>
          {state.message}
        </p>
      )}
    </form>
  );
}
