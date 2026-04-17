import Link from "next/link";
import { Compass } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main
      id="main-content"
      tabIndex={-1}
      className="mx-auto flex min-h-[60vh] max-w-2xl flex-col items-center justify-center px-4 py-16 text-center"
    >
      <span className="mb-5 inline-flex h-14 w-14 items-center justify-center rounded-full bg-trust-soft text-trust">
        <Compass className="h-7 w-7" aria-hidden />
      </span>
      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-trust">
        404
      </p>
      <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
        That listing rolled off the map.
      </h1>
      <p className="mt-3 max-w-md text-muted-foreground">
        The page or listing you are looking for might have sold, been taken
        down, or never existed. Start from search.
      </p>
      <div className="mt-6 flex gap-3">
        <Button asChild>
          <Link href="/search">Browse bikes</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/">Back to home</Link>
        </Button>
      </div>
    </main>
  );
}
