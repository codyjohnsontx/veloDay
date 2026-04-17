"use client";

import Link from "next/link";
import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main
      id="main-content"
      tabIndex={-1}
      className="mx-auto flex min-h-[60vh] max-w-2xl flex-col items-center justify-center px-4 py-16 text-center"
    >
      <span className="mb-5 inline-flex h-14 w-14 items-center justify-center rounded-full bg-trust-soft text-trust">
        <AlertTriangle className="h-7 w-7" aria-hidden />
      </span>
      <h1 className="font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
        Something threw a chain.
      </h1>
      <p className="mt-3 max-w-md text-muted-foreground">
        We hit an unexpected error loading this page. Try again, and if it keeps
        happening, head back to the home page.
      </p>
      <div className="mt-6 flex gap-3">
        <Button onClick={() => reset()}>Try again</Button>
        <Button variant="outline" asChild>
          <Link href="/">Back to home</Link>
        </Button>
      </div>
    </main>
  );
}
