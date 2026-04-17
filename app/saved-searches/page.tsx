import Link from "next/link";
import { Bell, BellOff, Pencil, Search } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { labelize } from "@/lib/format";
import { savedSearches } from "@/lib/data";

export default function SavedSearchesPage() {
  return (
    <main
      id="main-content"
      tabIndex={-1}
      className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8"
    >
      <div className="mb-7">
        <p className="text-sm font-black uppercase tracking-wide text-trust">
          Saved searches
        </p>
        <h1 className="mt-1 text-4xl font-black tracking-tight text-ink">
          Watch the market without refreshing.
        </h1>
      </div>

      <div className="space-y-4">
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
                    <Search className="h-4 w-4" />
                    Open
                  </Link>
                </Button>
                <Button variant="outline">
                  <Pencil className="h-4 w-4" />
                  Edit
                </Button>
                <Button variant="ghost">
                  {search.alertFrequency === "weekly" ? (
                    <Bell className="h-4 w-4" />
                  ) : (
                    <BellOff className="h-4 w-4" />
                  )}
                  {search.alertFrequency === "weekly" ? "Resume" : "Pause"}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </main>
  );
}
