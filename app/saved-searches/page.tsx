"use client";

import Link from "next/link";
import { Bell, BellOff, Heart, Pencil, Search } from "lucide-react";
import { useMemo, useState } from "react";

import { ListingCard } from "@/components/listing-card";
import { useBuyerActions } from "@/components/buyer-actions-provider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { labelize } from "@/lib/format";
import { listings, savedSearches } from "@/lib/data";
import type { BikeListing } from "@/lib/types";

type SavedView = "listings" | "searches";

export default function SavedSearchesPage() {
  const [view, setView] = useState<SavedView>("listings");
  const { savedIds } = useBuyerActions();
  const savedListings = useMemo(
    () =>
      savedIds
        .map((id) => listings.find((listing) => listing.id === id))
        .filter((listing): listing is BikeListing => Boolean(listing)),
    [savedIds],
  );

  return (
    <main
      id="main-content"
      tabIndex={-1}
      className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8"
    >
      <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-black uppercase tracking-wide text-trust">
            Saved
          </p>
          <h1 className="mt-1 text-4xl font-black tracking-tight text-ink">
            Keep your shortlist and watches together.
          </h1>
        </div>
        <Button asChild>
          <Link href="/search">
            <Search className="h-4 w-4" aria-hidden />
            Browse listings
          </Link>
        </Button>
      </div>

      <div className="mb-6 inline-flex rounded-lg border border-border bg-card p-1 shadow-sm">
        <TabButton
          active={view === "listings"}
          label={`Saved listings (${savedListings.length})`}
          onClick={() => setView("listings")}
        />
        <TabButton
          active={view === "searches"}
          label={`Saved searches (${savedSearches.length})`}
          onClick={() => setView("searches")}
        />
      </div>

      {view === "listings" ? (
        <SavedListings listings={savedListings} />
      ) : (
        <SavedSearches />
      )}
    </main>
  );
}

function TabButton({
  active,
  label,
  onClick,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-md px-4 py-2 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
        active
          ? "bg-primary text-primary-foreground"
          : "text-muted-foreground hover:bg-muted hover:text-foreground"
      }`}
    >
      {label}
    </button>
  );
}

function SavedListings({ listings }: { listings: BikeListing[] }) {
  if (listings.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-border bg-card p-10 text-center">
        <Heart className="mx-auto h-10 w-10 text-muted-foreground" aria-hidden />
        <h2 className="mt-4 text-2xl font-black text-ink">
          No saved listings yet
        </h2>
        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">
          Save listings from search or detail pages to build a shortlist that
          stays in this browser.
        </p>
        <Button className="mt-5" asChild>
          <Link href="/search">Browse marketplace</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
      {listings.map((listing) => (
        <ListingCard key={listing.id} listing={listing} />
      ))}
    </div>
  );
}

function SavedSearches() {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {savedSearches.map((search) => (
        <Card key={search.id}>
          <CardHeader className="flex flex-row items-start justify-between gap-4 space-y-0">
            <div>
              <CardTitle>{search.name}</CardTitle>
              <p className="mt-2 text-sm text-muted-foreground">
                {search.resultCount} current matches
              </p>
            </div>
            <Badge variant="trust">{labelize(search.alertFrequency)} alerts</Badge>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {Object.entries(search.filters).map(([key, value]) => (
                <Badge key={key} variant="outline">
                  {labelize(key)}: {String(value)}
                </Badge>
              ))}
            </div>
            <div className="mt-5 flex flex-wrap gap-2">
              <Button asChild>
                <Link href="/search">
                  <Search className="h-4 w-4" aria-hidden />
                  Open
                </Link>
              </Button>
              <Button variant="outline" type="button">
                <Pencil className="h-4 w-4" aria-hidden />
                Edit
              </Button>
              <Button variant="ghost" type="button">
                {search.alertFrequency === "weekly" ? (
                  <Bell className="h-4 w-4" aria-hidden />
                ) : (
                  <BellOff className="h-4 w-4" aria-hidden />
                )}
                {search.alertFrequency === "weekly" ? "Resume" : "Pause"}
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
