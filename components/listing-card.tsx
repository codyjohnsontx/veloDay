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
}: {
  listing: BikeListing;
  compact?: boolean;
}) {
  return (
    <Card className="group overflow-hidden border-border/80 bg-card shadow-none transition hover:-translate-y-0.5 hover:shadow-subtle">
      <Link href={`/listing/${listing.id}`} className="block">
        <div className="aspect-[4/3] overflow-hidden bg-muted">
          <img
            src={listing.heroImage}
            alt={listing.title}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        </div>
      </Link>
      <div className="space-y-4 p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <Link href={`/listing/${listing.id}`}>
              <h3 className="line-clamp-2 text-base font-black leading-tight text-ink hover:text-primary">
                {listing.title}
              </h3>
            </Link>
            <p className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
              <MapPin className="h-3.5 w-3.5" />
              {listing.location}
            </p>
          </div>
          <div className="text-right">
            <p className="text-lg font-black text-ink">{currency(listing.price)}</p>
            <p className="text-xs font-semibold text-trust">
              {labelize(listing.dealScore)}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 text-xs">
          <Spec label="Size" value={listing.frameSize ?? listing.wheelSize ?? "Any"} />
          <Spec label="Use" value={labelize(listing.model.discipline)} />
          <Spec label="Cond." value={labelize(listing.condition.overallGrade)} />
        </div>

        {!compact && (
          <div className="flex flex-wrap gap-2">
            <SerialTrustBadge serial={listing.serial} />
            <SellerTrustBadge verified={listing.seller.verifiedIdentity} />
            {listing.transactionModes.includes("managed-shipping") && (
              <Badge variant="outline" className="gap-1.5">
                <Truck className="h-3.5 w-3.5" />
                Ships
              </Badge>
            )}
          </div>
        )}

        <div className="flex items-center justify-between border-t border-border pt-3 text-xs text-muted-foreground">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1">
              <Eye className="h-3.5 w-3.5" />
              {listing.views}
            </span>
            <span className="inline-flex items-center gap-1">
              <Heart className="h-3.5 w-3.5" />
              {listing.saves}
            </span>
            <span className="inline-flex items-center gap-1">
              <MessageSquare className="h-3.5 w-3.5" />
              {listing.inquiries}
            </span>
          </div>
          <Button variant="ghost" size="sm" asChild>
            <Link href={`/listing/${listing.id}`}>
              Details <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </Card>
  );
}

function Spec({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-border bg-muted/40 px-2 py-2">
      <p className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
      <p className="truncate font-bold text-ink">{value}</p>
    </div>
  );
}
