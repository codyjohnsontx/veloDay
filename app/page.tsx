import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  Bike,
  ChartNoAxesCombined,
  Search,
  ShieldCheck,
} from "lucide-react";

import { ListingCard } from "@/components/listing-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { featuredListings, listings, newestListings } from "@/lib/data";
import { currency } from "@/lib/format";

const categoryStats = [
  {
    label: "Complete bikes",
    href: "/search",
    count: listings.filter((listing) => listing.category === "complete-bike")
      .length,
  },
  {
    label: "Frames",
    href: "/search",
    count: listings.filter((listing) => listing.category === "frame").length,
  },
  {
    label: "Wheelsets",
    href: "/search",
    count: listings.filter((listing) => listing.category === "wheelset").length,
  },
];

export default function HomePage() {
  const verifiedCount = listings.filter(
    (listing) => listing.serial.state === "verified",
  ).length;
  const medianPrice = [...listings].sort((a, b) => a.price - b.price)[
    Math.floor(listings.length / 2)
  ].price;

  return (
    <main>
      <section className="border-b border-border bg-card">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[1fr_420px] lg:px-8 lg:py-14">
          <div className="flex flex-col justify-center">
            <h1 className="max-w-4xl text-5xl font-black leading-[0.95] tracking-tight text-ink sm:text-6xl lg:text-7xl">
              Buy the bike, not the mystery.
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-muted-foreground">
              Browse structured listings with verified serials, service history,
              provenance, local pickup, managed shipping, and seller analytics.
            </p>
            <div className="mt-7 grid gap-3 rounded-lg border border-border bg-background p-3 shadow-sm sm:grid-cols-[1fr_auto]">
              <label className="relative block">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  className="h-12 pl-10"
                  placeholder="Search Tarmac, Hightower, gravel, 54 cm..."
                />
              </label>
              <Button size="lg" asChild>
                <Link href="/search">
                  Search inventory <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
            <div className="mt-5 flex flex-wrap gap-2">
              {categoryStats.map((category) => (
                <Button key={category.label} variant="outline" asChild>
                  <Link href={category.href}>
                    {category.label}
                    <span className="rounded bg-muted px-1.5 py-0.5 text-xs">
                      {category.count}
                    </span>
                  </Link>
                </Button>
              ))}
            </div>
          </div>
          <div className="rounded-lg border border-border bg-background p-4 shadow-subtle">
            <div className="aspect-[4/3] overflow-hidden rounded-md bg-muted">
              <img
                src={featuredListings[0].heroImage}
                alt={featuredListings[0].title}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="mt-4 space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-muted-foreground">
                    Featured verified listing
                  </p>
                  <h2 className="mt-1 text-xl font-black text-ink">
                    {featuredListings[0].title}
                  </h2>
                </div>
                <p className="text-xl font-black text-ink">
                  {currency(featuredListings[0].price)}
                </p>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <Metric label="Verified" value={verifiedCount.toString()} />
                <Metric label="Median" value={currency(medianPrice)} />
                <Metric label="Saved" value={featuredListings[0].saves.toString()} />
              </div>
              <Button className="w-full" asChild>
                <Link href={`/listing/${featuredListings[0].id}`}>
                  Open listing
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-4 md:grid-cols-3">
          <TrustPoint
            icon={BadgeCheck}
            title="Proof over profile copy"
            text="Identity, receipt, masked serial, and theft-check state travel with the listing."
          />
          <TrustPoint
            icon={Bike}
            title="Specs as data"
            text="Size, components, material, service recency, and defects are filterable."
          />
          <TrustPoint
            icon={ChartNoAxesCombined}
            title="Seller instrumentation"
            text="Views, saves, inquiries, offers, and price position shape each sale."
          />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-14 sm:px-6 lg:px-8">
        <div className="mb-5 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-black uppercase tracking-wide text-trust">
              New trusted inventory
            </p>
            <h2 className="mt-1 text-3xl font-black text-ink">
              Listings with a paper trail
            </h2>
          </div>
          <Button variant="outline" asChild>
            <Link href="/search">View all</Link>
          </Button>
        </div>
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {newestListings.slice(0, 6).map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      </section>
    </main>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-border bg-card px-3 py-2">
      <p className="text-[10px] font-black uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
      <p className="mt-1 text-base font-black text-ink">{value}</p>
    </div>
  );
}

function TrustPoint({
  icon: Icon,
  title,
  text,
}: {
  icon: typeof ShieldCheck;
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-lg border border-border bg-card p-5 shadow-sm">
      <Icon className="h-6 w-6 text-trust" />
      <h3 className="mt-4 text-lg font-black text-ink">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">{text}</p>
    </div>
  );
}
