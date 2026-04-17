import { Skeleton } from "@/components/ui/skeleton";

export default function ListingLoading() {
  return (
    <main
      id="main-content"
      tabIndex={-1}
      role="status"
      aria-busy="true"
      aria-live="polite"
      className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8"
    >
      <span className="sr-only">Loading listing…</span>
      <Skeleton className="mb-4 h-4 w-32" />
      <Skeleton className="mb-3 h-10 w-3/4" />
      <Skeleton className="mb-6 h-5 w-48" />
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_380px]">
        <div className="space-y-6">
          <Skeleton className="aspect-[16/10] w-full rounded-2xl" />
          <Skeleton className="h-56 w-full rounded-xl" />
          <Skeleton className="h-72 w-full rounded-xl" />
        </div>
        <div className="space-y-5">
          <Skeleton className="h-72 w-full rounded-xl" />
          <Skeleton className="h-48 w-full rounded-xl" />
        </div>
      </div>
    </main>
  );
}
