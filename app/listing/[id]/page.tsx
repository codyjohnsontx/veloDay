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
import { getListing, listings } from "@/lib/data";
import { currency, labelize, percent } from "@/lib/format";

export function generateStaticParams() {
  return listings.map((listing) => ({ id: listing.id }));
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

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Button variant="ghost" asChild className="mb-5">
        <Link href="/search">
          <ArrowLeft className="h-4 w-4" />
          Back to search
        </Link>
      </Button>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_380px]">
        <section className="space-y-6">
          <div className="overflow-hidden rounded-lg border border-border bg-card">
            <div className="aspect-[16/10] bg-muted">
              <img
                src={listing.heroImage}
                alt={listing.title}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="grid grid-cols-3 gap-2 p-3">
              {listing.gallery.map((image) => (
                <div
                  key={image}
                  className="aspect-[4/3] overflow-hidden rounded-md bg-muted"
                >
                  <img
                    src={image}
                    alt={`${listing.title} gallery`}
                    className="h-full w-full object-cover"
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
                  <h3 className="flex items-center gap-2 text-sm font-black uppercase tracking-wide text-ink">
                    <Wrench className="h-4 w-4 text-trust" />
                    Service notes
                  </h3>
                  <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                    {listing.condition.serviceNotes.map((note) => (
                      <li key={note} className="rounded-md bg-muted/60 px-3 py-2">
                        {note}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="text-sm font-black uppercase tracking-wide text-ink">
                    Disclosed defects
                  </h3>
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
              <div className="rounded-lg border border-border bg-background p-4">
                <h3 className="flex items-center gap-2 font-black text-ink">
                  <CalendarCheck className="h-5 w-5 text-trust" />
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
              <div className="rounded-lg border border-border bg-background p-4">
                <h3 className="flex items-center gap-2 font-black text-ink">
                  <ShieldCheck className="h-5 w-5 text-trust" />
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
              <div>
                <div className="flex flex-wrap gap-2">
                  <VerificationBadge label="Serial" state={listing.serial.state} />
                  <VerificationBadge
                    label="Proof"
                    state={listing.provenance.proofOfPurchase}
                  />
                </div>
                <h1 className="mt-4 text-3xl font-black leading-tight text-ink">
                  {listing.title}
                </h1>
                <p className="mt-2 flex items-center gap-1 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  {listing.location}
                </p>
              </div>

              <div className="flex items-end justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-muted-foreground">
                    Asking price
                  </p>
                  <p className="text-4xl font-black text-ink">
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
                <Button size="lg" asChild>
                  <Link href="/messages/thread-001">
                    <BadgeDollarSign className="h-4 w-4" />
                    Make offer
                  </Link>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <Link href="/messages/thread-001">
                    <MessageSquare className="h-4 w-4" />
                    Message seller
                  </Link>
                </Button>
                <Button variant="ghost" size="lg">
                  <Heart className="h-4 w-4" />
                  Save listing
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
                <h2 className="text-xl font-black text-ink">{listing.seller.name}</h2>
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
                    <Truck className="h-4 w-4 text-trust" />
                  ) : (
                    <Bike className="h-4 w-4 text-trust" />
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

function Spec({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-border bg-background px-3 py-3">
      <p className="text-[10px] font-black uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
      <p className="mt-1 truncate text-sm font-bold text-ink">{value}</p>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="text-right font-bold text-ink">{value}</dd>
    </div>
  );
}

function MiniMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-border bg-background px-3 py-2 text-center">
      <p className="text-[10px] font-black uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
      <p className="mt-1 text-sm font-black text-ink">{value}</p>
    </div>
  );
}
