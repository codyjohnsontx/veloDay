"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Filter, RotateCcw, Search, SlidersHorizontal } from "lucide-react";

import { ListingCard } from "@/components/listing-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { currency, labelize } from "@/lib/format";
import {
  defaultSearchFilters,
  filterAndSortListings,
  filterCategoryOptions,
  filterConditionOptions,
  filterDisciplineOptions,
  filterSellerOptions,
  filterTransactionOptions,
  parseSearchFilters,
  serializeSearchFilters,
  type SearchFilters,
} from "@/lib/search-filters";
import type { BikeListing } from "@/lib/types";

export function SearchExperience({ listings }: { listings: BikeListing[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [filters, setFilters] = useState<SearchFilters>(() =>
    parseSearchFilters(searchParams),
  );
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  useEffect(() => {
    const qs = serializeSearchFilters(filters);
    const url = qs ? `${pathname}?${qs}` : pathname;
    router.replace(url, { scroll: false });
  }, [filters, pathname, router]);

  useEffect(() => {
    const fromUrl = parseSearchFilters(searchParams);
    setFilters((prev) =>
      serializeSearchFilters(prev) === serializeSearchFilters(fromUrl)
        ? prev
        : fromUrl,
    );
  }, [searchParams]);

  const filtered = useMemo(
    () => filterAndSortListings(listings, filters),
    [filters, listings],
  );

  const activeLabels = [
    filters.category !== "all" && labelize(filters.category),
    filters.discipline !== "all" && labelize(filters.discipline),
    filters.condition !== "all" && labelize(filters.condition),
    filters.sellerType !== "all" && labelize(filters.sellerType),
    filters.transactionMode !== "all" && labelize(filters.transactionMode),
    filters.verifiedSerial && "Verified serial",
    filters.proofOfPurchase && "Proof of purchase",
    filters.maxPrice < defaultSearchFilters.maxPrice && `Under ${currency(filters.maxPrice)}`,
  ].filter(Boolean);

  return (
    <div className="space-y-6">
      <div className="grid gap-3 rounded-lg border border-border bg-card p-3 shadow-sm md:grid-cols-[1fr_auto_auto]">
        <label className="relative block">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={filters.query}
            onChange={(event) =>
              setFilters((current) => ({
                ...current,
                query: event.target.value,
              }))
            }
            className="h-11 pl-10"
            placeholder="Search brand, model, seller, or city"
          />
        </label>
        <select
          value={filters.sort}
          onChange={(event) =>
            setFilters((current) => ({
              ...current,
              sort: event.target.value as SearchFilters["sort"],
            }))
          }
          className="h-11 rounded-md border border-input bg-background px-3 text-sm font-semibold"
          aria-label="Sort listings"
        >
          <option value="recommended">Recommended</option>
          <option value="newest">Newest</option>
          <option value="price-low">Price low</option>
          <option value="deal-score">Deal score</option>
          <option value="days">Days on market</option>
        </select>
        <Button
          variant="outline"
          className="md:hidden"
          onClick={() => setMobileFiltersOpen((open) => !open)}
        >
          <SlidersHorizontal className="h-4 w-4" />
          Filters
        </Button>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Badge variant="outline">{filtered.length} matches</Badge>
        {activeLabels.map((label) => (
          <Badge key={String(label)} variant="trust">
            {label}
          </Badge>
        ))}
        {activeLabels.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setFilters(defaultSearchFilters)}
          >
            <RotateCcw className="h-4 w-4" />
            Reset
          </Button>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        <aside
          className={
            mobileFiltersOpen
              ? "block"
              : "hidden lg:block"
          }
        >
          <FilterPanel filters={filters} setFilters={setFilters} />
        </aside>
        <section>
          {filtered.length > 0 ? (
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {filtered.map((listing) => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>
          ) : (
            <div className="rounded-lg border border-dashed border-border bg-card p-10 text-center">
              <Filter className="mx-auto h-10 w-10 text-muted-foreground" />
              <h2 className="mt-4 text-2xl font-black text-ink">
                No listings match those filters
              </h2>
              <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
                Broaden the price, trust, or transaction filters to see more bikes.
              </p>
              <Button className="mt-5" onClick={() => setFilters(defaultSearchFilters)}>
                Reset filters
              </Button>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

function FilterPanel({
  filters,
  setFilters,
}: {
  filters: SearchFilters;
  setFilters: React.Dispatch<React.SetStateAction<SearchFilters>>;
}) {
  return (
    <div className="sticky top-24 space-y-5 rounded-lg border border-border bg-card p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-black text-ink">Bike filters</h2>
        <Filter className="h-4 w-4 text-muted-foreground" />
      </div>
      <SelectFilter
        label="Category"
        value={filters.category}
        options={filterCategoryOptions}
        onChange={(value) =>
          setFilters((current) => ({
            ...current,
            category: value as SearchFilters["category"],
          }))
        }
      />
      <SelectFilter
        label="Discipline"
        value={filters.discipline}
        options={filterDisciplineOptions}
        onChange={(value) =>
          setFilters((current) => ({
            ...current,
            discipline: value as SearchFilters["discipline"],
          }))
        }
      />
      <SelectFilter
        label="Condition"
        value={filters.condition}
        options={filterConditionOptions}
        onChange={(value) =>
          setFilters((current) => ({
            ...current,
            condition: value as SearchFilters["condition"],
          }))
        }
      />
      <SelectFilter
        label="Seller type"
        value={filters.sellerType}
        options={filterSellerOptions}
        onChange={(value) =>
          setFilters((current) => ({
            ...current,
            sellerType: value as SearchFilters["sellerType"],
          }))
        }
      />
      <SelectFilter
        label="Transaction mode"
        value={filters.transactionMode}
        options={filterTransactionOptions}
        onChange={(value) =>
          setFilters((current) => ({
            ...current,
            transactionMode: value as SearchFilters["transactionMode"],
          }))
        }
      />
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm font-semibold">
          <span>Max price</span>
          <span>{currency(filters.maxPrice)}</span>
        </div>
        <input
          type="range"
          min={1000}
          max={8000}
          step={250}
          value={filters.maxPrice}
          onChange={(event) =>
            setFilters((current) => ({
              ...current,
              maxPrice: Number(event.target.value),
            }))
          }
          className="w-full accent-primary"
        />
      </div>
      <ToggleFilter
        label="Verified serial only"
        checked={filters.verifiedSerial}
        onChange={(checked) =>
          setFilters((current) => ({ ...current, verifiedSerial: checked }))
        }
      />
      <ToggleFilter
        label="Proof of purchase"
        checked={filters.proofOfPurchase}
        onChange={(checked) =>
          setFilters((current) => ({ ...current, proofOfPurchase: checked }))
        }
      />
    </div>
  );
}

function SelectFilter({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: readonly string[];
  onChange: (value: string) => void;
}) {
  return (
    <label className="block space-y-2">
      <span className="text-sm font-semibold text-ink">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {labelize(option)}
          </option>
        ))}
      </select>
    </label>
  );
}

function ToggleFilter({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label className="flex items-center justify-between gap-3 rounded-md border border-border px-3 py-2 text-sm font-semibold">
      <span>{label}</span>
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="h-4 w-4 accent-primary"
      />
    </label>
  );
}
