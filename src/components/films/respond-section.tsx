"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import { submitResponse, type ResponseState } from "@/app/actions/responses";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import type { ResponseType } from "@/types/db";
import { HandHeart, Cross, MessagesSquare, Loader2, CheckCircle2 } from "lucide-react";

const initial: ResponseState = { ok: false, message: "" };

const OPTIONS: { value: ResponseType; label: string; icon: typeof Cross }[] = [
  { value: "prayer", label: "I'd like prayer", icon: HandHeart },
  { value: "decision", label: "I want to follow Jesus", icon: Cross },
  { value: "contact_request", label: "I'd like to talk to someone", icon: MessagesSquare },
];

function Submit() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? (
        <>
          <Loader2 className="animate-spin" /> Sending…
        </>
      ) : (
        "Send to the team"
      )}
    </Button>
  );
}

export function RespondSection({
  filmId,
  responseContent,
}: {
  filmId: string;
  responseContent?: string | null;
}) {
  const [state, formAction] = useActionState(submitResponse, initial);
  const [type, setType] = useState<ResponseType | null>(null);

  return (
    <div className="relative overflow-hidden rounded-2xl border border-gold/20 bg-navy p-6 sm:p-9">
      <div className="mb-6 flex items-center gap-3 text-xs uppercase tracking-[0.25em] text-gold">
        <span className="h-px w-8 bg-gold/50" />
        When the lights come up
      </div>

      {responseContent && (
        <p className="mb-8 max-w-2xl text-pretty text-lg leading-relaxed text-cream-dim">
          {responseContent}
        </p>
      )}

      {state.ok ? (
        <div className="flex items-start gap-3 rounded-lg border border-gold/30 bg-gold/5 p-5">
          <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-gold" />
          <p className="leading-relaxed text-cream">{state.message}</p>
        </div>
      ) : (
        <form action={formAction} className="space-y-6">
          <input type="hidden" name="filmId" value={filmId} />
          <input type="hidden" name="type" value={type ?? ""} />

          <div className="grid gap-3 sm:grid-cols-3">
            {OPTIONS.map(({ value, label, icon: Icon }) => (
              <button
                type="button"
                key={value}
                onClick={() => setType(value)}
                aria-pressed={type === value}
                className={`flex flex-col items-start gap-3 rounded-xl border p-4 text-left transition-all ${
                  type === value
                    ? "border-gold bg-gold/10 shadow-glow"
                    : "border-border bg-navy-deep/40 hover:border-gold/40"
                }`}
              >
                <Icon
                  className={type === value ? "text-gold" : "text-cream-dim"}
                  strokeWidth={1.5}
                />
                <span className="text-sm text-cream">{label}</span>
              </button>
            ))}
          </div>

          {type && (
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="resp-name">Name</Label>
                <Input id="resp-name" name="name" placeholder="Your name" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="resp-email">Email</Label>
                <Input
                  id="resp-email"
                  name="email"
                  type="email"
                  placeholder="So we can reach you"
                />
              </div>
              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="resp-msg">Anything you'd like to share</Label>
                <Textarea
                  id="resp-msg"
                  name="message"
                  placeholder="Optional — tell us what's on your heart."
                />
              </div>
            </div>
          )}

          {state.message && !state.ok && (
            <p className="text-sm text-red-400">{state.message}</p>
          )}

          <div className="flex items-center gap-3">
            <Submit />
            <span className="text-xs text-cream-muted">
              A real person responds. You can stay anonymous if you prefer.
            </span>
          </div>
        </form>
      )}
    </div>
  );
}
