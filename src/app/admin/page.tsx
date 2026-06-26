import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Film, Clapperboard, Inbox, Users } from "lucide-react";

async function count(table: string, filter?: (q: any) => any) {
  const supabase = await createClient();
  let q = supabase.from(table).select("*", { count: "exact", head: true });
  if (filter) q = filter(q);
  const { count } = await q;
  return count ?? 0;
}

export default async function AdminDashboard() {
  const [films, premieres, viewers, openResponses] = await Promise.all([
    count("films"),
    count("premieres"),
    count("viewers"),
    count("responses", (q) => q.eq("handled", false)),
  ]);

  const stats = [
    { label: "Films", value: films, href: "/admin/films", icon: Film },
    { label: "Premieres", value: premieres, href: "/admin/premieres", icon: Clapperboard },
    { label: "Audience", value: viewers, href: "#", icon: Users },
    { label: "Open responses", value: openResponses, href: "/admin/responses", icon: Inbox },
  ];

  return (
    <div>
      <h1 className="mb-1 font-serif text-3xl text-cream">Dashboard</h1>
      <p className="mb-8 text-sm text-cream-dim">
        The projection booth — manage the cinema from here.
      </p>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map(({ label, value, href, icon: Icon }) => (
          <Link key={label} href={href}>
            <Card className="transition-colors hover:border-gold/40">
              <CardHeader className="flex-row items-center justify-between space-y-0">
                <CardTitle className="text-sm font-normal text-cream-dim">
                  {label}
                </CardTitle>
                <Icon className="size-4 text-gold/70" />
              </CardHeader>
              <CardContent>
                <span className="font-serif text-4xl text-cream">{value}</span>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
