import { ListingGridSkeleton } from "@/components/listing-card-skeleton";
import { Skeleton } from "@/components/ui/skeleton";

export default function SearchLoading() {
  return (
    <main
      role="status"
      aria-busy="true"
      aria-live="polite"
      className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8"
    >
      <span className="sr-only">Loading search results…</span>
      <div className="mb-7 space-y-2">
        <Skeleton className="h-4 w-44" />
        <Skeleton className="h-10 w-3/4" />
      </div>
      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        <div className="space-y-3">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-40 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
        <ListingGridSkeleton count={6} />
      </div>
    </main>
  );
}
