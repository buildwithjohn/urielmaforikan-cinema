import type { Metadata } from "next";
import Link from "next/link";
import { LightShafts } from "@/components/brand/light-shafts";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";

export const metadata: Metadata = { title: "Thank you", robots: { index: false } };

export default function ThankYouPage() {
  return (
    <section className="relative isolate flex min-h-[70vh] items-center overflow-hidden">
      <LightShafts density={4} />
      <div className="container relative text-center">
        <div className="mx-auto flex size-16 items-center justify-center rounded-full border border-gold/30 bg-gold/10">
          <Heart className="size-7 text-gold" fill="currentColor" />
        </div>
        <h1 className="mt-8 font-serif text-4xl text-cream sm:text-5xl">
          Thank you for partnering with us.
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-pretty text-cream-dim">
          Your gift helps carry the next story into rooms a sermon may never
          reach. A receipt is on its way to your inbox. The lights stay on
          because of people like you.
        </p>
        <div className="mt-10 flex justify-center gap-3">
          <Button asChild>
            <Link href="/films">Back to the cinema</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/premieres">See upcoming premieres</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
