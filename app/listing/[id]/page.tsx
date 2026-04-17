import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  BadgeDollarSign,
  Bike,
  CalendarCheck,
  Heart,
  MapPin,
  MessageSquare,
  ShieldCheck,
  Truck,
  Wrench,
} from "lucide-react";

import { VerificationBadge } from "@/components/trust-badge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getListing, listings, offers } from "@/lib/data";
import { currency, labelize, percent } from "@/lib/format";
import { getSiteOrigin } from "@/lib/site-url";

export function generateStaticParams() {
  return listings.map((listing) => ({ id: listing.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const listing = getListing(id);
  if (!listing) {
    return { title: "Listing not found" };
  }

  const title = `${listing.title} — ${currency(listing.price)}`;
  const description = `${labelize(listing.condition.overallGrade)} ${labelize(listing.model.discipline)} ${labelize(
    listing.category,
  )} in ${listing.location}. ${listing.frameSize ?? listing.wheelSize ?? ""} · ${labelize(
    listing.serial.state,
  )} serial · ${labelize(listing.provenance.proofOfPurchase)} proof of purchase.`.trim();

  return {
    title,
    description,
    alternates: { canonical: `/listing/${listing.id}` },
    openGraph: {
      type: "website",
      title,
      description,
      url: `/listing/${listing.id}`,
      images: [
        {
          url: listing.heroImage,
          alt: listing.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [listing.heroImage],
    },
  };
}

export default async function ListingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const listing = getListing(id);

  if (!listing) {
    notFound();
  }

  const siteUrl = getSiteOrigin();

  const offerIndex = offers.findIndex((o) => o.listingId === listing.id);
  const threadHref =
    offerIndex >= 0
      ? `/messages/thread-${String(offerIndex + 1).padStart(3, "0")}`
      : null;

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: listing.title,
    image: [listing.heroImage, ...listing.gallery].filter(Boolean),
    description: `${labelize(listing.condition.overallGrade)} condition ${labelize(
      listing.model.discipline,
    )} ${labelize(listing.category)} — ${listing.model.brand} ${listing.model.modelName} (${listing.model.modelYear})`,
    brand: { "@type": "Brand", name: listing.model.brand },
    model: listing.model.modelName,
    sku: listing.id,
    category: labelize(listing.category),
    itemCondition: "https://schema.org/UsedCondition",
    offers: {
      "@type": "Offer",
      url: `${siteUrl}/listing/${listing.id}`,
      priceCurrency: "USD",
      price: listing.price,
      availability: "https://schema.org/InStock",
      itemCondition: "https://schema.org/UsedCondition",
      seller: {
        "@type":
          listing.seller.sellerType === "private" ? "Person" : "Organization",
        name: listing.seller.name,
        ...(listing.seller.reviewCount > 0 && {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: listing.seller.reviewScore,
            reviewCount: listing.seller.reviewCount,
          },
        }),
      },
      areaServed: listing.shipsTo ?? listing.location,
    },
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: siteUrl,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Search",
        item: `${siteUrl}/search`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: labelize(listing.category),
        item: `${siteUrl}/search?category=${listing.category}`,
      },
      {
        "@type": "ListItem",
        position: 4,
        name: listing.title,
        item: `${siteUrl}/listing/${listing.id}`,
      },
    ],
  };

  return (
    <main
      id="main-content"
      tabIndex={-1}
      className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8"
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(productJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(breadcrumbJsonLd) }}
      />

      <nav aria-label="Breadcrumb" className="mb-4">
        <ol className="flex flex-wrap items-center gap-1 text-xs text-muted-foreground">
          <li>
            <Link href="/" className="hover:text-ink hover:underline">
              Home
            </Link>
          </li>
          <li aria-hidden>/</li>
          <li>
            <Link href="/search" className="hover:text-ink hover:underline">
              Search
            </Link>
          </li>
          <li aria-hidden>/</li>
          <li>
            <Link
              href={`/search?category=${listing.category}`}
              className="hover:text-ink hover:underline"
            >
              {labelize(listing.category)}
            </Link>
          </li>
        </ol>
      </nav>

      <Button variant="ghost" asChild className="mb-4">
        <Link href="/search">
          <ArrowLeft className="h-4 w-4" aria-hidden />
          Back to search
        </Link>
      </Button>

      <header className="mb-6">
        <div className="mb-3 flex flex-wrap gap-2">
          <VerificationBadge label="Serial" state={listing.serial.state} />
          <VerificationBadge
            label="Proof"
            state={listing.provenance.proofOfPurchase}
          />
          <Badge variant={listing.dealScore === "below-market" ? "trust" : "outline"}>
            {labelize(listing.dealScore)}
          </Badge>
        </div>
        <h1 className="font-display text-3xl font-semibold leading-tight tracking-tight text-ink sm:text-4xl lg:text-5xl">
          {listing.title}
        </h1>
        <p className="mt-2 flex items-center gap-1.5 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4" aria-hidden />
          {listing.location}
        </p>
      </header>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_380px]">
        <section className="space-y-6">
          <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-card">
            <div className="relative aspect-[16/10] bg-muted">
              <Image
                src={listing.heroImage}
                alt={`${listing.title} — hero photo`}
                fill
                sizes="(min-width: 1024px) 70vw, 100vw"
                priority
                className="object-cover"
              />
            </div>
            <div className="grid grid-cols-3 gap-2 p-3">
              {listing.gallery.map((image, idx) => (
                <div
                  key={`${image}-${idx}`}
                  className="relative aspect-[4/3] overflow-hidden rounded-lg bg-muted"
                >
                  <Image
                    src={image}
                    alt={`${listing.title} — detail photo ${idx + 1}`}
                    fill
                    sizes="(min-width: 1024px) 220px, 33vw"
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Bike spec snapshot</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                <Spec label="Brand" value={listing.model.brand} />
                <Spec label="Model" value={listing.model.modelName} />
                <Spec label="Year" value={String(listing.model.modelYear)} />
                <Spec label="Category" value={labelize(listing.category)} />
                <Spec label="Discipline" value={labelize(listing.model.discipline)} />
                <Spec label="Frame size" value={listing.frameSize ?? "N/A"} />
                <Spec label="Fit range" value={listing.riderHeightRange ?? "N/A"} />
                <Spec label="Wheel size" value={listing.wheelSize ?? "N/A"} />
                <Spec label="Material" value={listing.frameMaterial ?? "N/A"} />
                <Spec label="Drivetrain" value={listing.drivetrain ?? "Frameset"} />
                <Spec label="Brakes" value={listing.brakes ?? "N/A"} />
                <Spec label="Suspension" value={listing.suspension ?? "N/A"} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Condition and service record</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="flex flex-wrap gap-2">
                <Badge variant="trust">
                  {labelize(listing.condition.overallGrade)} condition
                </Badge>
                <Badge variant="outline">
                  {labelize(listing.condition.structuralFlag)}
                </Badge>
                {listing.condition.lastMajorService && (
                  <Badge variant="outline">
                    Last major service {listing.condition.lastMajorService}
                  </Badge>
                )}
              </div>
              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.08em] text-ink">
                    <Wrench className="h-4 w-4 text-trust" aria-hidden />
                    Service notes
                  </h2>
                  <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                    {listing.condition.serviceNotes.map((note) => (
                      <li key={note} className="rounded-md bg-muted/60 px-3 py-2">
                        {note}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h2 className="text-sm font-semibold uppercase tracking-[0.08em] text-ink">
                    Disclosed defects
                  </h2>
                  <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                    {listing.condition.defectTags.map((tag) => (
                      <li key={tag} className="rounded-md bg-muted/60 px-3 py-2">
                        {tag}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Provenance and serial verification</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              <div className="rounded-xl border border-border bg-background p-4">
                <h3 className="flex items-center gap-2 font-semibold text-ink">
                  <CalendarCheck className="h-5 w-5 text-trust" aria-hidden />
                  Provenance
                </h3>
                <dl className="mt-4 space-y-3 text-sm">
                  <Row label="Ownership" value={labelize(listing.provenance.ownershipType)} />
                  <Row
                    label="Proof"
                    value={labelize(listing.provenance.proofOfPurchase)}
                  />
                  <Row
                    label="Commercial use"
                    value={listing.provenance.commercialUse ? "Disclosed" : "No"}
                  />
                  <Row
                    label="Accident history"
                    value={listing.provenance.accidentDisclosed ? "Disclosed" : "None"}
                  />
                </dl>
              </div>
              <div className="rounded-xl border border-border bg-background p-4">
                <h3 className="flex items-center gap-2 font-semibold text-ink">
                  <ShieldCheck className="h-5 w-5 text-trust" aria-hidden />
                  Serial record
                </h3>
                <dl className="mt-4 space-y-3 text-sm">
                  <Row label="Serial" value={listing.serial.maskedSerial} />
                  <Row label="State" value={labelize(listing.serial.state)} />
                  <Row
                    label="Theft check"
                    value={labelize(listing.serial.theftCheckStatus)}
                  />
                  <Row
                    label="Method"
                    value={labelize(listing.serial.verificationMethod)}
                  />
                </dl>
              </div>
            </CardContent>
          </Card>
        </section>

        <aside className="space-y-5 lg:sticky lg:top-24 lg:self-start">
          <Card>
            <CardContent className="space-y-5 p-5">
              <div className="flex items-end justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground">
                    Asking price
                  </p>
                  <p className="font-display text-4xl font-semibold tabular-nums text-ink">
                    {currency(listing.price)}
                  </p>
                </div>
                <Badge variant={listing.dealScore === "below-market" ? "trust" : "outline"}>
                  {labelize(listing.dealScore)}
                </Badge>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <MiniMetric label="Views" value={String(listing.views)} />
                <MiniMetric label="Saves" value={String(listing.saves)} />
                <MiniMetric label="Days" value={String(listing.daysOnMarket)} />
              </div>

              <div className="grid gap-2">
                {threadHref ? (
                  <Button size="lg" asChild>
                    <Link href={threadHref}>
                      <BadgeDollarSign className="h-4 w-4" aria-hidden />
                      Make offer
                    </Link>
                  </Button>
                ) : (
                  <Button
                    size="lg"
                    type="button"
                    disabled
                    aria-disabled="true"
                    title="Offers are coming soon"
                  >
                    <BadgeDollarSign className="h-4 w-4" aria-hidden />
                    Make offer (coming soon)
                  </Button>
                )}
                {threadHref ? (
                  <Button variant="outline" size="lg" asChild>
                    <Link href={threadHref}>
                      <MessageSquare className="h-4 w-4" aria-hidden />
                      Message seller
                    </Link>
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    size="lg"
                    type="button"
                    disabled
                    aria-disabled="true"
                    title="Messaging is coming soon"
                  >
                    <MessageSquare className="h-4 w-4" aria-hidden />
                    Message seller (coming soon)
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="lg"
                  type="button"
                  disabled
                  aria-disabled="true"
                  title="Save is coming soon"
                >
                  <Heart className="h-4 w-4" aria-hidden />
                  Save (coming soon)
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Seller trust</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h2 className="font-display text-xl font-semibold text-ink">
                  {listing.seller.name}
                </h2>
                <p className="text-sm text-muted-foreground">
                  {labelize(listing.seller.sellerType)} in {listing.seller.location}
                </p>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <MiniMetric label="Rating" value={String(listing.seller.reviewScore)} />
                <MiniMetric label="Reviews" value={String(listing.seller.reviewCount)} />
                <MiniMetric label="Reply" value={percent(listing.seller.responseRate)} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Transaction modes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {listing.transactionModes.map((mode) => (
                <div
                  key={mode}
                  className="flex items-center gap-3 rounded-md border border-border bg-background px-3 py-3 text-sm font-semibold"
                >
                  {mode === "managed-shipping" ? (
                    <Truck className="h-4 w-4 text-trust" aria-hidden />
                  ) : (
                    <Bike className="h-4 w-4 text-trust" aria-hidden />
                  )}
                  {labelize(mode)}
                </div>
              ))}
            </CardContent>
          </Card>
        </aside>
      </div>
    </main>
  );
}

function serializeJsonLd(value: unknown): string {
  return JSON.stringify(value)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026")
    .replace(/\u2028/g, "\\u2028")
    .replace(/\u2029/g, "\\u2029");
}

function Spec({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-border bg-background px-3 py-3">
      <p className="text-[10px] font-medium uppercase tracking-[0.08em] text-muted-foreground">
        {label}
      </p>
      <p className="mt-1 truncate text-sm font-semibold text-ink">{value}</p>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="text-right font-semibold text-ink">{value}</dd>
    </div>
  );
}

function MiniMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-border bg-background px-3 py-2 text-center">
      <p className="text-[10px] font-medium uppercase tracking-[0.08em] text-muted-foreground">
        {label}
      </p>
      <p className="mt-1 text-sm font-semibold tabular-nums text-ink">{value}</p>
    </div>
  );
}
