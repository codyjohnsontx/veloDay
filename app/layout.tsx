import type { Metadata, Viewport } from "next";
import { Inter, Bricolage_Grotesque } from "next/font/google";
import "./globals.css";

import { SiteHeader } from "@/components/site-header";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
});

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-display",
});

const DEFAULT_SITE_URL = "https://veloday.com";

function resolveSiteUrl(): URL {
  const raw = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  const candidate = raw && raw.length > 0 ? raw : DEFAULT_SITE_URL;
  const withProtocol = /^https?:\/\//i.test(candidate)
    ? candidate
    : `https://${candidate}`;
  try {
    return new URL(withProtocol);
  } catch {
    return new URL(DEFAULT_SITE_URL);
  }
}

const siteUrlObject = resolveSiteUrl();
const siteUrl = siteUrlObject.origin;

export const metadata: Metadata = {
  metadataBase: siteUrlObject,
  title: {
    default: "VeloDay — Verified Used Bikes, Frames & Wheelsets",
    template: "%s | VeloDay",
  },
  description:
    "Buy and sell used bikes with verified serials, provenance, service history, local pickup, and managed shipping. Every listing carries a paper trail.",
  applicationName: "VeloDay",
  keywords: [
    "used bikes",
    "bike classifieds",
    "buy used bikes",
    "sell a bike",
    "used bike marketplace",
    "verified bike serial",
    "used road bike",
    "used gravel bike",
    "used mountain bike",
    "used bike frame",
    "used wheelset",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: siteUrl,
    siteName: "VeloDay",
    title: "VeloDay — Verified Used Bikes, Frames & Wheelsets",
    description:
      "Structured listings with verified serials, provenance, and seller analytics. Buy the bike, not the mystery.",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "VeloDay — Verified Used Bikes",
    description:
      "A trust-first marketplace for used bicycles, frames, and wheelsets.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  category: "marketplace",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f7f3ea" },
    { media: "(prefers-color-scheme: dark)", color: "#10201d" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${bricolage.variable}`}
    >
      <body className="font-sans">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground"
        >
          Skip to content
        </a>
        <SiteHeader />
        <div id="main-content" tabIndex={-1}>
          {children}
        </div>
      </body>
    </html>
  );
}
