import type { Metadata } from "next";
import { Suspense } from "react";
import { LightShafts } from "@/components/brand/light-shafts";
import { SignInForm } from "@/components/auth/sign-in-form";

export const metadata: Metadata = {
  title: "Sign in",
  description: "Enter the cinema with a magic link.",
};

export default function SignInPage() {
  return (
    <section className="relative isolate flex min-h-[80vh] items-center overflow-hidden">
      <LightShafts density={3} />
      <div className="container relative">
        <div className="mx-auto max-w-md rounded-2xl border border-gold/20 bg-navy p-8 sm:p-10">
          <div className="mb-2 text-xs uppercase tracking-[0.25em] text-gold">
            The Audience
          </div>
          <h1 className="font-serif text-3xl text-cream">Enter the cinema</h1>
          <p className="mt-2 text-sm text-cream-dim">
            We&apos;ll email you a magic link — no password to remember.
          </p>
          <div className="mt-8">
            <Suspense>
              <SignInForm />
            </Suspense>
          </div>
        </div>
      </div>
    </section>
  );
}
