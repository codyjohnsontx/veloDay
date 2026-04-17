import Image from "next/image";
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
    href: "/search?category=complete-bike",
    count: listings.filter((listing) => listing.category === "complete-bike")
      .length,
  },
  {
    label: "Frames",
    href: "/search?category=frame",
    count: listings.filter((listing) => listing.category === "frame").length,
  },
  {
    label: "Wheelsets",
    href: "/search?category=wheelset",
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
  const featured = featuredListings[0];
  const heroLayout = featured
    ? "lg:grid-cols-[1fr_440px]"
    : "lg:grid-cols-1";

  return (
    <main>
      <section className="border-b border-border bg-card">
        <div
          className={`mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:px-8 lg:py-16 ${heroLayout}`}
        >
          <div className="flex flex-col justify-center animate-fade-in">
            <p className="mb-4 inline-flex w-fit items-center gap-2 rounded-full border border-trust/20 bg-trust-soft px-3 py-1 text-xs font-semibold uppercase tracking-wide text-trust">
              <ShieldCheck className="h-3.5 w-3.5" aria-hidden />
              Verified used bikes
            </p>
            <h1 className="max-w-4xl font-display text-5xl font-bold leading-[0.95] tracking-tight text-ink sm:text-6xl lg:text-[68px]">
              Buy the bike,
              <br />
              <span className="text-trust">not the mystery.</span>
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-muted-foreground">
              Browse structured listings with verified serials, service history,
              provenance, local pickup, managed shipping, and seller analytics.
            </p>
            <form
              action="/search"
              method="GET"
              role="search"
              className="mt-7 grid gap-3 rounded-xl border border-border bg-background p-3 shadow-sm sm:grid-cols-[1fr_auto]"
            >
              <label className="relative block">
                <span className="sr-only">Search listings</span>
                <Search
                  className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                  aria-hidden
                />
                <Input
                  name="q"
                  type="search"
                  className="h-12 pl-10"
                  placeholder="Search Tarmac, Hightower, gravel, 54 cm..."
                />
              </label>
              <Button size="lg" type="submit">
                Search inventory
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Button>
            </form>
            <div className="mt-5 flex flex-wrap gap-2">
              {categoryStats.map((category) => (
                <Button key={category.label} variant="outline" size="sm" asChild>
                  <Link href={category.href}>
                    {category.label}
                    <span className="rounded bg-muted px-1.5 py-0.5 text-xs tabular-nums">
                      {category.count}
                    </span>
                  </Link>
                </Button>
              ))}
            </div>
          </div>
          {featured ? (
            <div className="relative overflow-hidden rounded-2xl border border-border bg-background shadow-subtle">
              <div className="relative aspect-[5/4] overflow-hidden bg-muted">
                <Image
                  src={featured.heroImage}
                  alt={`Featured listing: ${featured.model.modelYear} ${featured.model.brand} ${featured.model.modelName}`}
                  fill
                  sizes="(min-width: 1024px) 440px, 100vw"
                  priority
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/55 via-ink/10 to-transparent" />
                <div className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-background/90 px-3 py-1 text-xs font-semibold text-trust backdrop-blur">
                  <BadgeCheck className="h-3.5 w-3.5" aria-hidden />
                  Featured & verified
                </div>
                <div className="absolute inset-x-4 bottom-4 flex items-end justify-between gap-4 text-primary-foreground">
                  <div>
                    <h2 className="font-display text-xl font-semibold leading-tight">
                      {featured.title}
                    </h2>
                    <p className="mt-1 text-xs text-primary-foreground/80">
                      {featured.location}
                    </p>
                  </div>
                  <p className="text-2xl font-semibold tabular-nums">
                    {currency(featured.price)}
                  </p>
                </div>
              </div>
              <div className="space-y-4 p-5">
                <div className="grid grid-cols-3 gap-2">
                  <Metric label="Verified" value={verifiedCount.toString()} />
                  <Metric label="Median" value={currency(medianPrice)} />
                  <Metric label="Saved" value={featured.saves.toString()} />
                </div>
                <Button className="w-full" asChild>
                  <Link href={`/listing/${featured.id}`}>Open listing</Link>
                </Button>
              </div>
            </div>
          ) : null}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
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

      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.08em] text-trust">
              New trusted inventory
            </p>
            <h2 className="mt-2 font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
              Listings with a paper trail
            </h2>
          </div>
          <Button variant="outline" asChild>
            <Link href="/search">View all</Link>
          </Button>
        </div>
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {newestListings.slice(0, 6).map((listing, idx) => (
            <ListingCard
              key={listing.id}
              listing={listing}
              priority={idx < 3}
            />
          ))}
        </div>
      </section>
    </main>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border bg-card px-3 py-2.5">
      <p className="text-[10px] font-medium uppercase tracking-[0.08em] text-muted-foreground">
        {label}
      </p>
      <p className="mt-1 text-base font-semibold tabular-nums text-ink">
        {value}
      </p>
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
    <div className="group rounded-2xl border border-border/70 bg-card p-6 shadow-card transition hover:-translate-y-0.5 hover:shadow-subtle">
      <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-trust-soft text-trust transition group-hover:bg-trust group-hover:text-primary-foreground">
        <Icon className="h-5 w-5" aria-hidden />
      </span>
      <h3 className="mt-4 font-display text-lg font-semibold text-ink">
        {title}
      </h3>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">{text}</p>
    </div>
  );
}
