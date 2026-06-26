"use client";

import { useState } from "react";
import { useFormStatus } from "react-dom";
import { createGiftCheckout } from "@/app/actions/giving";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Heart, Loader2 } from "lucide-react";

const PRESETS = [25, 50, 100, 250];

function Submit() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="lg" className="w-full" disabled={pending}>
      {pending ? (
        <>
          <Loader2 className="animate-spin" /> Redirecting…
        </>
      ) : (
        <>
          <Heart /> Give securely
        </>
      )}
    </Button>
  );
}

export function GiftForm({
  films,
  defaultFilmId,
}: {
  films: { id: string; title: string }[];
  defaultFilmId?: string;
}) {
  const [amount, setAmount] = useState(50);
  const [recurrence, setRecurrence] = useState<"one_time" | "monthly">(
    "one_time",
  );

  return (
    <form action={createGiftCheckout} className="space-y-6">
      {/* Recurrence */}
      <div className="grid grid-cols-2 gap-2 rounded-lg border border-border bg-navy-deep/50 p-1">
        {(["one_time", "monthly"] as const).map((r) => (
          <button
            key={r}
            type="button"
            onClick={() => setRecurrence(r)}
            className={cn(
              "rounded-md py-2.5 text-sm font-medium transition-colors",
              recurrence === r
                ? "bg-gold text-navy-deep"
                : "text-cream-dim hover:text-cream",
            )}
          >
            {r === "one_time" ? "One-time" : "Monthly partner"}
          </button>
        ))}
      </div>
      <input type="hidden" name="recurrence" value={recurrence} />

      {/* Amount */}
      <div className="space-y-2">
        <Label>Amount (USD)</Label>
        <div className="grid grid-cols-4 gap-2">
          {PRESETS.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setAmount(p)}
              className={cn(
                "rounded-lg border py-3 font-serif text-lg transition-all",
                amount === p
                  ? "border-gold bg-gold/10 text-gold shadow-glow"
                  : "border-border text-cream-dim hover:border-gold/40",
              )}
            >
              ${p}
            </button>
          ))}
        </div>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-cream-muted">
            $
          </span>
          <Input
            name="amount"
            type="number"
            min={1}
            step="1"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            className="pl-8"
            aria-label="Custom amount"
          />
        </div>
      </div>

      {/* Designation */}
      <div className="space-y-2">
        <Label htmlFor="film">Designate to</Label>
        <select
          id="film"
          name="designatedFilmId"
          defaultValue={defaultFilmId ?? ""}
          className="flex h-11 w-full rounded-md border border-border bg-navy-deep/60 px-4 text-sm text-cream focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
        >
          <option value="">Wherever it&apos;s needed most</option>
          {films.map((f) => (
            <option key={f.id} value={f.id}>
              Fund the next production — {f.title}
            </option>
          ))}
        </select>
      </div>

      <Submit />
      <p className="text-center text-xs text-cream-muted">
        Secure checkout. You can give as a guest or signed in.
      </p>
    </form>
  );
}
