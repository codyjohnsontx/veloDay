import Link from "next/link";
import {
  ArrowRight,
  BadgeDollarSign,
  Eye,
  Heart,
  MessageSquare,
  ShieldAlert,
  TrendingDown,
  Truck,
} from "lucide-react";

import { ListingCard } from "@/components/listing-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { listings, offers } from "@/lib/data";
import { currency, labelize } from "@/lib/format";

const sellerListings = listings.filter(
  (listing) => listing.seller.id === "seller-velohouse",
);

export default function DashboardPage() {
  const views = sellerListings.reduce((sum, listing) => sum + listing.views, 0);
  const saves = sellerListings.reduce((sum, listing) => sum + listing.saves, 0);
  const inquiries = sellerListings.reduce(
    (sum, listing) => sum + listing.inquiries,
    0,
  );
  const activeOffers = offers.filter((offer) =>
    sellerListings.some((listing) => listing.id === offer.listingId),
  );

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-black uppercase tracking-wide text-trust">
            Seller dashboard
          </p>
          <h1 className="mt-1 text-4xl font-black tracking-tight text-ink">
            Velo House Austin inventory
          </h1>
        </div>
        <Button asChild>
          <Link href="/sell">Add listing</Link>
        </Button>
      </div>

      <section className="grid gap-4 md:grid-cols-4">
        <MetricCard icon={Eye} label="Views" value={String(views)} />
        <MetricCard icon={Heart} label="Saves" value={String(saves)} />
        <MetricCard icon={MessageSquare} label="Inquiries" value={String(inquiries)} />
        <MetricCard
          icon={BadgeDollarSign}
          label="Open offers"
          value={String(activeOffers.length)}
        />
      </section>

      <section className="mt-8 grid gap-6 lg:grid-cols-[1fr_360px]">
        <div>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-2xl font-black text-ink">Active listings</h2>
            <Button variant="outline" asChild>
              <Link href="/search">View marketplace</Link>
            </Button>
          </div>
          <div className="grid gap-5 md:grid-cols-2">
            {sellerListings.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        </div>

        <aside className="space-y-5">
          <Card>
            <CardHeader>
              <CardTitle>Suggested actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Action
                icon={TrendingDown}
                title="Counter the Tarmac offer"
                text="One open buyer is within 5 percent of asking price."
              />
              <Action
                icon={Truck}
                title="Add inspection pickup window"
                text="Listings with inspection-partner mode are saving faster."
              />
              <Action
                icon={ShieldAlert}
                title="Keep trust proof fresh"
                text="Receipt-match evidence is driving below-market deal score."
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent offers</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {activeOffers.map((offer) => {
                const listing = listings.find((item) => item.id === offer.listingId);
                return (
                  <Link
                    key={offer.id}
                    href="/messages/thread-001"
                    className="block rounded-md border border-border bg-background p-3 transition hover:bg-muted"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <p className="font-black text-ink">{offer.buyerName}</p>
                      <Badge variant="outline">{labelize(offer.status)}</Badge>
                    </div>
                    <p className="mt-1 text-sm font-semibold text-trust">
                      {currency(offer.amount)}
                    </p>
                    <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                      {listing?.title}
                    </p>
                  </Link>
                );
              })}
            </CardContent>
          </Card>
        </aside>
      </section>
    </main>
  );
}

function MetricCard({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Eye;
  label: string;
  value: string;
}) {
  return (
    <Card>
      <CardContent className="p-5">
        <Icon className="h-5 w-5 text-trust" />
        <p className="mt-4 text-sm font-semibold text-muted-foreground">{label}</p>
        <p className="mt-1 text-3xl font-black text-ink">{value}</p>
      </CardContent>
    </Card>
  );
}

function Action({
  icon: Icon,
  title,
  text,
}: {
  icon: typeof ArrowRight;
  title: string;
  text: string;
}) {
  return (
    <div className="flex gap-3 rounded-md border border-border bg-background p-3">
      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-trust" />
      <div>
        <h3 className="font-black text-ink">{title}</h3>
        <p className="mt-1 text-sm leading-5 text-muted-foreground">{text}</p>
      </div>
    </div>
  );
}
