import { getFilms } from "@/lib/data/films";
import { getPremieres } from "@/lib/data/premieres";
import { upsertPremiere } from "@/app/actions/admin";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";

const fieldCls =
  "flex h-11 w-full rounded-md border border-border bg-navy-deep/60 px-4 text-sm text-cream focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold";

export default async function AdminPremieresPage() {
  const [films, premieres] = await Promise.all([getFilms(), getPremieres()]);

  return (
    <div className="space-y-10">
      <div>
        <h1 className="mb-6 font-serif text-3xl text-cream">Premieres</h1>
        <div className="space-y-3">
          {premieres.map((p) => (
            <div
              key={p.id}
              className="flex items-center justify-between gap-4 rounded-lg border border-border bg-navy p-4"
            >
              <div>
                <p className="font-medium text-cream">
                  {p.title ?? p.film?.title}
                </p>
                <p className="text-xs text-cream-muted">
                  {formatDate(p.scheduled_open_at)} ·{" "}
                  {new Date(p.scheduled_open_at).toLocaleTimeString()}
                </p>
              </div>
              <Badge variant="muted">{p.status}</Badge>
            </div>
          ))}
          {premieres.length === 0 && (
            <p className="text-sm text-cream-muted">No premieres yet.</p>
          )}
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Schedule a premiere</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={upsertPremiere} className="space-y-5">
            <div className="space-y-1.5">
              <Label htmlFor="film_id">Film</Label>
              <select id="film_id" name="film_id" required className={fieldCls}>
                {films.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.title}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="title">Title (optional)</Label>
                <Input id="title" name="title" placeholder="World Premiere" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="scheduled_open_at">Opens at</Label>
                <Input
                  id="scheduled_open_at"
                  name="scheduled_open_at"
                  type="datetime-local"
                  required
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="status">Status</Label>
              <select id="status" name="status" defaultValue="scheduled" className={fieldCls}>
                <option value="scheduled">Scheduled</option>
                <option value="live">Live</option>
                <option value="ended">Ended</option>
                <option value="canceled">Canceled</option>
              </select>
            </div>
            <Button type="submit">Schedule premiere</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
