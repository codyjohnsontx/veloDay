import { Suspense } from "react";

import { SearchExperience } from "@/components/search-experience";
import { ListingGridSkeleton } from "@/components/listing-card-skeleton";
import { Skeleton } from "@/components/ui/skeleton";
import { listings } from "@/lib/data";

function SearchFiltersFallback() {
  return (
    <div className="space-y-6">
      <div className="grid gap-3 rounded-lg border border-border bg-card p-3 shadow-sm md:grid-cols-[1fr_auto_auto]">
        <Skeleton className="h-11 w-full" />
        <Skeleton className="h-11 w-full md:w-40" />
        <Skeleton
          className="h-11 w-full md:hidden"
          aria-hidden
        />
      </div>
      <div className="flex flex-wrap gap-2">
        <Skeleton className="h-6 w-24" />
      </div>
      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        <div className="hidden space-y-3 lg:block">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-40 w-full" />
        </div>
        <ListingGridSkeleton count={6} />
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <main
      id="main-content"
      tabIndex={-1}
      className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8"
    >
      <div className="mb-7 flex flex-col gap-2">
        <p className="text-sm font-black uppercase tracking-wide text-trust">
          Marketplace search
        </p>
        <h1 className="text-4xl font-black tracking-tight text-ink">
          Find a verified bike by fit, build, and trust state.
        </h1>
      </div>
      <Suspense fallback={<SearchFiltersFallback />}>
        <SearchExperience listings={listings} />
      </Suspense>
    </main>
  );
}
