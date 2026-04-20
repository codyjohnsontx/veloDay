"use client";

import { Heart, Scale } from "lucide-react";

import { useBuyerActions } from "@/components/buyer-actions-provider";
import { Button } from "@/components/ui/button";

export function ListingDetailActions({
  listingId,
  title,
}: {
  listingId: string;
  title: string;
}) {
  const {
    compareLimit,
    compareLimitReached,
    isCompared,
    isSaved,
    toggleCompare,
    toggleSaved,
  } = useBuyerActions();
  const saved = isSaved(listingId);
  const compared = isCompared(listingId);
  const compareDisabled = compareLimitReached && !compared;

  return (
    <div className="grid gap-2">
      <Button
        variant={saved ? "subtle" : "ghost"}
        size="lg"
        type="button"
        aria-pressed={saved}
        onClick={() => toggleSaved(listingId)}
      >
        <Heart className={saved ? "h-4 w-4 fill-current" : "h-4 w-4"} aria-hidden />
        {saved ? "Saved" : "Save listing"}
      </Button>
      <Button
        variant={compared ? "subtle" : "ghost"}
        size="lg"
        type="button"
        aria-pressed={compared}
        disabled={compareDisabled}
        title={compareDisabled ? `Compare is limited to ${compareLimit} listings` : undefined}
        onClick={() => toggleCompare(listingId)}
      >
        <Scale className="h-4 w-4" aria-hidden />
        {compared ? "In compare" : "Compare listing"}
      </Button>
      {compareDisabled ? (
        <p className="text-center text-xs font-medium text-muted-foreground">
          Remove a listing from compare before adding {title}.
        </p>
      ) : null}
    </div>
  );
}
