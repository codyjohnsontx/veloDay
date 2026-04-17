import { Skeleton } from "@/components/ui/skeleton";

export function ListingCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-border/70 bg-card shadow-card">
      <Skeleton className="aspect-[4/3] w-full rounded-none" />
      <div className="space-y-4 p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1 space-y-2">
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-3 w-1/2" />
          </div>
          <Skeleton className="h-4 w-16" />
        </div>
        <div className="grid grid-cols-3 gap-2">
          <Skeleton className="h-11 w-full" />
          <Skeleton className="h-11 w-full" />
          <Skeleton className="h-11 w-full" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-6 w-20" />
        </div>
      </div>
    </div>
  );
}

export function ListingGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <ListingCardSkeleton key={i} />
      ))}
    </div>
  );
}
