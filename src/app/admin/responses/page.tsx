import { createClient } from "@/lib/supabase/server";
import { setResponseHandled } from "@/app/actions/admin";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";
import { HandHeart, Cross, MessagesSquare, Check, RotateCcw } from "lucide-react";
import type { Response as ResponseRow } from "@/types/db";

const TYPE_META = {
  prayer: { label: "Prayer", icon: HandHeart },
  decision: { label: "Decision for Christ", icon: Cross },
  contact_request: { label: "Wants to talk", icon: MessagesSquare },
} as const;

export default async function AdminResponsesPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("responses")
    .select("*, film:films(title, slug)")
    .order("created_at", { ascending: false });

  const responses = (data ?? []) as (ResponseRow & {
    film?: { title: string; slug: string } | null;
  })[];

  return (
    <div>
      <h1 className="mb-1 font-serif text-3xl text-cream">Responses</h1>
      <p className="mb-8 text-sm text-cream-dim">
        The hand-off inbox. Each one is a person waiting to be met.
      </p>

      <div className="space-y-3">
        {responses.length === 0 && (
          <p className="text-sm text-cream-muted">No responses yet.</p>
        )}
        {responses.map((r) => {
          const meta = TYPE_META[r.type];
          const Icon = meta.icon;
          return (
            <div
              key={r.id}
              className={`rounded-lg border p-5 ${
                r.handled
                  ? "border-border bg-navy/40 opacity-70"
                  : "border-gold/25 bg-navy"
              }`}
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <Icon className="size-4 text-gold" />
                    <span className="font-medium text-cream">{meta.label}</span>
                    {r.handled && <Badge variant="muted">Handled</Badge>}
                  </div>
                  <p className="mt-1 text-xs text-cream-muted">
                    {r.contact_name || "Anonymous"}
                    {r.contact_email ? ` · ${r.contact_email}` : ""}
                    {r.film ? ` · ${r.film.title}` : ""} ·{" "}
                    {formatDate(r.created_at)}
                  </p>
                </div>
                <form action={setResponseHandled}>
                  <input type="hidden" name="id" value={r.id} />
                  <input
                    type="hidden"
                    name="handled"
                    value={(!r.handled).toString()}
                  />
                  <Button type="submit" variant="outline" size="sm">
                    {r.handled ? (
                      <>
                        <RotateCcw /> Reopen
                      </>
                    ) : (
                      <>
                        <Check /> Mark handled
                      </>
                    )}
                  </Button>
                </form>
              </div>
              {r.message && (
                <p className="mt-3 text-pretty text-sm leading-relaxed text-cream-dim">
                  “{r.message}”
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
