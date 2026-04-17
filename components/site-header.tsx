import Link from "next/link";
import { Bike, Search, Store, UserRound } from "lucide-react";

import { Button } from "@/components/ui/button";

const navItems = [
  { href: "/search", label: "Browse", icon: Search },
  { href: "/sell", label: "Sell", icon: Bike },
  { href: "/dashboard", label: "Dashboard", icon: Store },
  { href: "/saved-searches", label: "Saved", icon: UserRound },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/92 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex min-w-0 items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <Bike className="h-5 w-5" />
          </span>
          <span className="truncate text-lg font-black tracking-tight text-ink">
            VeloDay
          </span>
        </Link>
        <nav className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => (
            <Button key={item.href} variant="ghost" asChild>
              <Link href={item.href}>
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            </Button>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <Button variant="outline" asChild className="hidden sm:inline-flex">
            <Link href="/messages/thread-001">Offers</Link>
          </Button>
          <Button asChild>
            <Link href="/sell">List a bike</Link>
          </Button>
        </div>
      </div>
      <nav
        aria-label="Primary"
        className="flex overflow-x-auto border-t border-border px-3 py-2 md:hidden"
      >
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="mr-2 inline-flex min-h-[44px] items-center gap-1.5 whitespace-nowrap rounded-md px-3 py-2.5 text-sm font-semibold text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            <item.icon className="h-4 w-4" aria-hidden />
            {item.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
