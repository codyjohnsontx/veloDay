"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronDown, ChevronUp, Scale, Trash2, X } from "lucide-react";
import { useMemo, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useBuyerActions } from "@/components/buyer-actions-provider";
import { listings } from "@/lib/data";
import { currency, labelize } from "@/lib/format";
import type { BikeListing } from "@/lib/types";

const compareRows: {
  label: string;
  value: (listing: BikeListing) => string;
}[] = [
  { label: "Price", value: (listing) => currency(listing.price) },
  { label: "Category", value: (listing) => labelize(listing.category) },
  { label: "Discipline", value: (listing) => labelize(listing.model.discipline) },
  { label: "Size", value: (listing) => listing.frameSize ?? listing.wheelSize ?? "N/A" },
  { label: "Fit", value: (listing) => listing.riderHeightRange ?? "N/A" },
  { label: "Material", value: (listing) => listing.frameMaterial ?? "N/A" },
  { label: "Drivetrain", value: (listing) => listing.drivetrain ?? "N/A" },
  { label: "Brakes", value: (listing) => listing.brakes ?? "N/A" },
  { label: "Condition", value: (listing) => labelize(listing.condition.overallGrade) },
  { label: "Serial", value: (listing) => labelize(listing.serial.state) },
  {
    label: "Proof",
    value: (listing) => labelize(listing.provenance.proofOfPurchase),
  },
  {
    label: "Transaction",
    value: (listing) => listing.transactionModes.map(labelize).join(", "),
  },
  { label: "Location", value: (listing) => listing.location },
  { label: "Days listed", value: (listing) => String(listing.daysOnMarket) },
];

export function CompareTray() {
  const {
    compareIds,
    compareLimit,
    removeCompare,
    clearCompare,
  } = useBuyerActions();
  const [expanded, setExpanded] = useState(false);

  const selectedListings = useMemo(
    () =>
      compareIds
        .map((id) => listings.find((listing) => listing.id === id))
        .filter((listing): listing is BikeListing => Boolean(listing)),
    [compareIds],
  );

  if (selectedListings.length === 0) return null;

  return (
    <aside
      className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-background/95 shadow-lift backdrop-blur"
      aria-label="Compare listings"
    >
      {expanded ? (
        <div className="max-h-[74vh] overflow-y-auto border-b border-border">
          <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.08em] text-trust">
                  Compare
                </p>
                <h2 className="font-display text-2xl font-semibold text-ink">
                  Buyer-side spec check
                </h2>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setExpanded(false)}
              >
                <ChevronDown className="h-4 w-4" aria-hidden />
                Collapse
              </Button>
            </div>

            <div className="overflow-x-auto">
              <div
                className="grid min-w-[720px] gap-px overflow-hidden rounded-lg border border-border bg-border text-sm"
                style={{
                  gridTemplateColumns: `150px repeat(${selectedListings.length}, minmax(170px, 1fr))`,
                }}
              >
                <div className="bg-muted p-3 font-semibold text-muted-foreground">
                  Listing
                </div>
                {selectedListings.map((listing) => (
                  <div key={listing.id} className="bg-card p-3">
                    <div className="relative mb-3 aspect-[4/3] overflow-hidden rounded-md bg-muted">
                      <Image
                        src={listing.heroImage}
                        alt={`${listing.title} compare photo`}
                        fill
                        sizes="220px"
                        className="object-cover"
                      />
                    </div>
                    <Link
                      href={`/listing/${listing.id}`}
                      className="line-clamp-2 font-semibold text-ink hover:underline"
                    >
                      {listing.title}
                    </Link>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="mt-2 h-8 px-2 text-muted-foreground"
                      onClick={() => removeCompare(listing.id)}
                    >
                      <X className="h-4 w-4" aria-hidden />
                      Remove
                    </Button>
                  </div>
                ))}

                {compareRows.map((row) => (
                  <CompareRow
                    key={row.label}
                    label={row.label}
                    listings={selectedListings}
                    value={row.value}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : null}

      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-trust-soft text-trust">
            <Scale className="h-5 w-5" aria-hidden />
          </span>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-ink">
              {selectedListings.length} of {compareLimit} selected
            </p>
            <p className="truncate text-xs text-muted-foreground">
              {selectedListings.map((listing) => listing.model.modelName).join(" / ")}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="hidden gap-2 sm:flex">
            {selectedListings.map((listing) => (
              <Badge key={listing.id} variant="outline" className="gap-1.5 bg-card">
                {listing.model.modelYear} {listing.model.brand}
                <button
                  type="button"
                  onClick={() => removeCompare(listing.id)}
                  className="rounded-sm text-muted-foreground hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  aria-label={`Remove ${listing.title} from compare`}
                >
                  <X className="h-3.5 w-3.5" aria-hidden />
                </button>
              </Badge>
            ))}
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setExpanded((open) => !open)}
          >
            {expanded ? (
              <ChevronDown className="h-4 w-4" aria-hidden />
            ) : (
              <ChevronUp className="h-4 w-4" aria-hidden />
            )}
            {expanded ? "Hide compare" : "Compare"}
          </Button>
          <Button type="button" variant="ghost" size="sm" onClick={clearCompare}>
            <Trash2 className="h-4 w-4" aria-hidden />
            Clear
          </Button>
        </div>
      </div>
    </aside>
  );
}

function CompareRow({
  label,
  listings,
  value,
}: {
  label: string;
  listings: BikeListing[];
  value: (listing: BikeListing) => string;
}) {
  return (
    <>
      <div className="bg-muted p-3 font-semibold text-muted-foreground">
        {label}
      </div>
      {listings.map((listing) => (
        <div key={`${listing.id}-${label}`} className="bg-card p-3 font-medium text-ink">
          {value(listing)}
        </div>
      ))}
    </>
  );
}
