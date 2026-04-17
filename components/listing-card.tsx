import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Eye,
  Heart,
  MapPin,
  MessageSquare,
  Truck,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SerialTrustBadge, SellerTrustBadge } from "@/components/trust-badge";
import { currency, labelize } from "@/lib/format";
import type { BikeListing } from "@/lib/types";

export function ListingCard({
  listing,
  compact = false,
  priority = false,
}: {
  listing: BikeListing;
  compact?: boolean;
  priority?: boolean;
}) {
  const altText = `${listing.model.modelYear} ${listing.model.brand} ${listing.model.modelName}${
    listing.frameSize ? ` in ${listing.frameSize}` : ""
  } — ${listing.location}`;

  return (
    <Card className="group relative overflow-hidden rounded-2xl border-border/70 bg-card shadow-card transition duration-300 hover:-translate-y-1 hover:shadow-lift">
      <Link
        href={`/listing/${listing.id}`}
        className="block"
        aria-label={`View ${listing.title}`}
      >
        <div className="relative aspect-[4/3] overflow-hidden bg-muted">
          <Image
            src={listing.heroImage}
            alt={altText}
            fill
            sizes="(min-width: 1280px) 28vw, (min-width: 768px) 45vw, 100vw"
            priority={priority}
            className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/35 via-transparent to-transparent opacity-60 transition-opacity duration-300 group-hover:opacity-80" />
          <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
            <Badge
              variant={listing.dealScore === "below-market" ? "trust" : "outline"}
              className="bg-background/90 backdrop-blur"
            >
              {labelize(listing.dealScore)}
            </Badge>
          </div>
          <span
            className="absolute right-3 top-3 inline-flex h-9 w-9 items-center justify-center rounded-full bg-background/90 text-ink shadow-sm backdrop-blur transition hover:bg-background hover:scale-105"
            aria-hidden
          >
            <Heart className="h-4 w-4" />
          </span>
          <div className="absolute bottom-3 left-3 rounded-full bg-background/92 px-3 py-1 text-sm font-semibold text-ink shadow-sm backdrop-blur tabular-nums">
            {currency(listing.price)}
          </div>
        </div>
      </Link>
      <div className="space-y-4 p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <Link href={`/listing/${listing.id}`}>
              <h3 className="line-clamp-2 text-base font-semibold leading-tight text-ink transition-colors group-hover:text-primary">
                {listing.title}
              </h3>
            </Link>
            <p className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
              <MapPin className="h-3.5 w-3.5" aria-hidden />
              <span>{listing.location}</span>
            </p>
          </div>
          <p className="text-xs font-semibold uppercase tracking-wide text-trust">
            {labelize(listing.model.discipline)}
          </p>
        </div>

        <div className="grid grid-cols-3 gap-2 text-xs">
          <Spec label="Size" value={listing.frameSize ?? listing.wheelSize ?? "Any"} />
          <Spec label="Year" value={String(listing.model.modelYear)} />
          <Spec label="Cond." value={labelize(listing.condition.overallGrade)} />
        </div>

        {!compact && (
          <div className="flex flex-wrap gap-2">
            <SerialTrustBadge serial={listing.serial} />
            <SellerTrustBadge verified={listing.seller.verifiedIdentity} />
            {listing.transactionModes.includes("managed-shipping") && (
              <Badge variant="outline" className="gap-1.5">
                <Truck className="h-3.5 w-3.5" aria-hidden />
                Ships
              </Badge>
            )}
          </div>
        )}

        <div className="flex items-center justify-between border-t border-border pt-3 text-xs text-muted-foreground">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1" title={`${listing.views} views`}>
              <Eye className="h-3.5 w-3.5" aria-hidden />
              <span className="tabular-nums">{listing.views}</span>
            </span>
            <span className="inline-flex items-center gap-1" title={`${listing.saves} saves`}>
              <Heart className="h-3.5 w-3.5" aria-hidden />
              <span className="tabular-nums">{listing.saves}</span>
            </span>
            <span
              className="inline-flex items-center gap-1"
              title={`${listing.inquiries} inquiries`}
            >
              <MessageSquare className="h-3.5 w-3.5" aria-hidden />
              <span className="tabular-nums">{listing.inquiries}</span>
            </span>
          </div>
          <Button variant="ghost" size="sm" asChild>
            <Link href={`/listing/${listing.id}`}>
              Details <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </Button>
        </div>
      </div>
    </Card>
  );
}

function Spec({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-border/70 bg-muted/40 px-2 py-2">
      <p className="text-[10px] font-medium uppercase tracking-[0.08em] text-muted-foreground">
        {label}
      </p>
      <p className="mt-0.5 truncate text-sm font-semibold text-ink">{value}</p>
    </div>
  );
}
