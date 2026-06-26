import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";
import { SiteNav } from "@/components/site/site-nav";
import { SiteFooter } from "@/components/site/site-footer";

const display = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-display",
  display: "swap",
});

const body = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  ),
  title: {
    default: "Uriel Maforikan Productions — Virtual Cinema",
    template: "%s · Uriel Maforikan Productions",
  },
  description:
    "A Christian filmmaking ministry. Evangelists who carry cameras. Watch our films, attend premieres, and respond.",
  openGraph: {
    title: "Uriel Maforikan Productions",
    description: "Evangelists who carry cameras.",
    type: "website",
    images: [
      {
        url: "/api/og",
        width: 1200,
        height: 630,
        alt: "Uriel Maforikan Productions — Light into dark.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Uriel Maforikan Productions",
    description: "Evangelists who carry cameras.",
    images: ["/api/og"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable} dark`}>
      <body className="min-h-screen bg-navy-deep text-cream">
        <SiteNav />
        <main className="relative">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
