import Link from "next/link";
import { Wordmark } from "@/components/brand/wordmark";
import { Button } from "@/components/ui/button";
import { getViewer, isAdmin } from "@/lib/auth";
import { Film, Clapperboard, Heart, ShieldCheck, Sparkles } from "lucide-react";

const links = [
  { href: "/films", label: "Films", icon: Film },
  { href: "/premieres", label: "Premieres", icon: Clapperboard },
  { href: "/about", label: "About", icon: Sparkles },
  { href: "/giving", label: "Give", icon: Heart },
];

export async function SiteNav() {
  const [viewer, admin] = await Promise.all([getViewer(), isAdmin()]);

  return (
    <header className="sticky top-0 z-50 border-b border-gold/10 bg-navy-deep/80 backdrop-blur-md">
      <nav className="container flex h-16 items-center justify-between gap-4">
        <Wordmark compact />

        <div className="hidden items-center gap-1 md:flex">
          {links.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-cream/75 transition-colors hover:bg-cream/5 hover:text-cream"
            >
              <Icon className="size-4 text-gold/70" />
              {label}
            </Link>
          ))}
          {admin && (
            <Link
              href="/admin"
              className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-gold transition-colors hover:bg-gold/10"
            >
              <ShieldCheck className="size-4" />
              Admin
            </Link>
          )}
        </div>

        <div className="flex items-center gap-2">
          {viewer ? (
            <div className="flex items-center gap-3">
              <span className="hidden text-xs text-cream-muted sm:inline">
                {viewer.name ?? viewer.email}
              </span>
              <form action="/auth/sign-out" method="post">
                <Button variant="ghost" size="sm" type="submit">
                  Sign out
                </Button>
              </form>
            </div>
          ) : (
            <Button asChild size="sm" variant="outline">
              <Link href="/auth/sign-in">Sign in</Link>
            </Button>
          )}
        </div>
      </nav>
    </header>
  );
}
