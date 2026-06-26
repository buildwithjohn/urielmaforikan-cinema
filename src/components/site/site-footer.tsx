import Link from "next/link";
import { Wordmark } from "@/components/brand/wordmark";

export function SiteFooter() {
  return (
    <footer className="relative mt-24 border-t border-gold/10 bg-navy-deep">
      <div className="container grid gap-10 py-14 md:grid-cols-3">
        <div>
          <Wordmark />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-cream-muted">
            A Christian filmmaking ministry. We tell true stories and hold the
            doors open for whoever the lights reach.
          </p>
        </div>

        <div className="flex flex-col gap-2 text-sm">
          <span className="mb-2 text-xs uppercase tracking-wider text-gold">
            The Cinema
          </span>
          <Link href="/films" className="text-cream/70 hover:text-cream">
            All Films
          </Link>
          <Link href="/premieres" className="text-cream/70 hover:text-cream">
            Premieres
          </Link>
          <Link href="/about" className="text-cream/70 hover:text-cream">
            About the ministry
          </Link>
          <Link href="/giving" className="text-cream/70 hover:text-cream">
            Partner with us
          </Link>
        </div>

        <div className="flex flex-col gap-2 text-sm">
          <span className="mb-2 text-xs uppercase tracking-wider text-gold">
            The Audience
          </span>
          <Link href="/auth/sign-in" className="text-cream/70 hover:text-cream">
            Sign in
          </Link>
          <Link href="/#join" className="text-cream/70 hover:text-cream">
            Join the audience
          </Link>
        </div>
      </div>
      <div className="border-t border-gold/5">
        <div className="container flex flex-col items-center justify-between gap-2 py-6 text-xs text-cream-muted sm:flex-row">
          <span>
            © {new Date().getFullYear()} Uriel Maforikan Productions. All rights
            reserved.
          </span>
          <span className="italic">Light into dark.</span>
        </div>
      </div>
    </footer>
  );
}
