import { ListingGridSkeleton } from "@/components/listing-card-skeleton";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 space-y-3">
        <Skeleton className="h-4 w-40" />
        <Skeleton className="h-12 w-2/3" />
        <Skeleton className="h-5 w-1/2" />
      </div>
      <ListingGridSkeleton count={6} />
    </main>
  );
}
