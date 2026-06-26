# Uriel Maforikan Productions — Virtual Cinema

A production-ready branded virtual cinema for a Christian filmmaking ministry.
**Evangelists who carry cameras.** The ministry hosts its films, runs premiere
events, and every film hands off to a ministry response.

> Light into dark is the brand: gold light-shafts drifting through deep navy.

## Stack

| Concern   | Choice |
| --------- | ------ |
| Framework | Next.js 15 (App Router, TypeScript, Server Components + Server Actions) |
| Styling   | Tailwind CSS + shadcn/ui primitives |
| Motion    | Framer Motion (respects `prefers-reduced-motion`) |
| Icons     | lucide-react |
| Data/Auth | Supabase (Postgres + RLS, email magic-link auth, storage) |
| Video     | Mux signed playback — abstracted behind `src/lib/video` so Vimeo OTT / Bunny Stream can swap in |
| Email     | Resend (audience list + premiere invites) |
| Payments  | Stripe — abstracted behind `src/lib/payments` so Paystack / Flutterwave (NGN) can be added |
| Deploy    | Vercel |

## Quick start

```bash
# 1. Install
npm install

# 2. Configure
cp .env.example .env.local   # fill in Supabase, Mux, Resend, Stripe keys

# 3. Database — apply migrations + seed
#    Option A: Supabase CLI (local or linked project)
supabase db reset            # runs migrations + supabase/seed.sql
#    Option B: paste supabase/migrations/*.sql then supabase/seed.sql
#              into the Supabase SQL editor, in order.

# 4. Run
npm run dev                  # http://localhost:3000
```

### Required environment

See [`.env.example`](.env.example) for the full list. The app **runs without
external keys** for layout/design work — video playback, email, and giving
degrade gracefully (e.g. the watch page shows a "playback not configured"
notice instead of crashing).

To make a user an admin: add their email to `ADMIN_EMAILS` **and** insert it
into the `admin_emails` table (the RLS `is_admin()` check reads that table).
The seed adds `hello@urielmaforikan.org`.

## Architecture

```
src/
  app/
    page.tsx                 Home — hero, Now Showing, mission, join-audience
    films/                   List + /films/[slug] detail (gated Watch + Respond)
    watch/[slug]/            Signed playback + post-roll response prompt
    premieres/               Countdown + RSVP (watch-together)
    giving/                  Stripe checkout + thank-you
    auth/                    Magic-link sign-in, callback, sign-out
    admin/                   Protected: films, premieres, responses inbox
    actions/                 Server actions (audience, responses, premieres, giving, admin)
    api/webhooks/stripe/     Reconciles gifts from Stripe events
  components/
    brand/                   LightShafts (the signature), Wordmark
    ui/                      shadcn primitives (button, card, input, …)
    films/ premieres/ …      Feature components
  lib/
    supabase/                client (browser) · server (RLS) · admin (service role)
    video/                   VideoProvider interface + Mux impl + registry
    payments/                PaymentsProvider interface + Stripe impl + registry
    email/                   Resend + branded HTML templates
    auth.ts                  getViewer, isAdmin, tier checks
    data/                    Typed query helpers
  types/db.ts                Domain types mirroring the schema
supabase/
  migrations/0001_schema.sql Tables, enums, is_admin()
  migrations/0002_rls.sql    Row Level Security policies
  seed.sql                   The Witness (featured) + sample films & premieres
```

### Swapping the video host

`src/lib/video` exposes `getPlaybackToken()` / `getUploadUrl()`. To move off
Mux, implement the `VideoProvider` interface in a new file and register it in
`src/lib/video/index.ts`, then set `VIDEO_PROVIDER`. Nothing else changes.

### Swapping the payment processor

Same pattern in `src/lib/payments`: implement `PaymentsProvider`, register it,
set `PAYMENTS_PROVIDER=paystack` (or `flutterwave`) for Nigerian rails.

### Access tiers & gated playback

Films declare a `required_tier` (`free` | `registered` | `supporter`). The
catalog is public, but the **Watch** button and the `/watch` route check the
viewer's tier, and the signed Mux token is only minted server-side once cleared
— a leaked playback id is useless without the JWT.

## Data model

`films` · `credits` · `viewers` · `premieres` · `premiere_rsvps` ·
`responses` · `gifts` — see `supabase/migrations/0001_schema.sql`. All tables
have RLS enabled; trusted writes go through server actions using the
service-role client.

## Deploy (Vercel)

1. Push to a Git repo and import into Vercel.
2. Add all `.env.example` variables in Project Settings → Environment Variables
   (set `NEXT_PUBLIC_SITE_URL` to your production URL).
3. Point a Stripe webhook at `https://<your-domain>/api/webhooks/stripe`
   (events: `checkout.session.completed`, `checkout.session.expired`,
   `charge.refunded`) and set `STRIPE_WEBHOOK_SECRET`.
4. In Supabase Auth → URL Configuration, add `https://<your-domain>/auth/callback`
   as a redirect URL.

## Scripts

```bash
npm run dev        # local dev
npm run build      # production build
npm run typecheck  # tsc --noEmit
npm run lint       # next lint
```
