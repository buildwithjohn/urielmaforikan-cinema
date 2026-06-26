import { redirect } from "next/navigation";
import Link from "next/link";
import { isAdmin } from "@/lib/auth";
import { Film, Clapperboard, Inbox, LayoutDashboard } from "lucide-react";

const nav = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/films", label: "Films", icon: Film },
  { href: "/admin/premieres", label: "Premieres", icon: Clapperboard },
  { href: "/admin/responses", label: "Responses", icon: Inbox },
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (!(await isAdmin())) redirect("/");

  return (
    <div className="container py-10">
      <div className="grid gap-8 lg:grid-cols-[220px_1fr]">
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="mb-4 text-xs uppercase tracking-[0.25em] text-gold">
            Admin
          </div>
          <nav className="flex gap-1 overflow-x-auto lg:flex-col">
            {nav.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className="flex items-center gap-3 whitespace-nowrap rounded-md px-3 py-2 text-sm text-cream/75 transition-colors hover:bg-cream/5 hover:text-cream"
              >
                <Icon className="size-4 text-gold/70" />
                {label}
              </Link>
            ))}
          </nav>
        </aside>
        <div className="min-w-0">{children}</div>
      </div>
    </div>
  );
}
