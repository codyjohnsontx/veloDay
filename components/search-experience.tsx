"use client";

import { useMemo, useState } from "react";
import { Filter, RotateCcw, Search, SlidersHorizontal } from "lucide-react";

import { ListingCard } from "@/components/listing-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { currency, labelize } from "@/lib/format";
import type {
  BikeListing,
  ConditionGrade,
  Discipline,
  ListingCategory,
  SellerType,
  TransactionMode,
} from "@/lib/types";

type SortKey = "recommended" | "newest" | "price-low" | "deal-score" | "days";

interface Filters {
  query: string;
  category: "all" | ListingCategory;
  discipline: "all" | Discipline;
  condition: "all" | ConditionGrade;
  sellerType: "all" | SellerType;
  transactionMode: "all" | TransactionMode;
  verifiedSerial: boolean;
  proofOfPurchase: boolean;
  maxPrice: number;
  sort: SortKey;
}

const initialFilters: Filters = {
  query: "",
  category: "all",
  discipline: "all",
  condition: "all",
  sellerType: "all",
  transactionMode: "all",
  verifiedSerial: false,
  proofOfPurchase: false,
  maxPrice: 8000,
  sort: "recommended",
};

const categoryOptions: Array<"all" | ListingCategory> = [
  "all",
  "complete-bike",
  "frame",
  "wheelset",
];
const disciplineOptions: Array<"all" | Discipline> = [
  "all",
  "road",
  "gravel",
  "mountain",
  "e-bike",
];
const conditionOptions: Array<"all" | ConditionGrade> = [
  "all",
  "excellent",
  "very-good",
  "good",
  "fair",
];
const sellerOptions: Array<"all" | SellerType> = [
  "all",
  "private",
  "shop",
  "consignment",
  "certified-partner",
];
const transactionOptions: Array<"all" | TransactionMode> = [
  "all",
  "local-pickup",
  "managed-shipping",
  "inspection-partner",
];

export function SearchExperience({ listings }: { listings: BikeListing[] }) {
  const [filters, setFilters] = useState<Filters>(initialFilters);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const filtered = useMemo(() => {
    const matches = listings.filter((listing) => {
      const query = filters.query.trim().toLowerCase();
      const queryMatch =
        query.length === 0 ||
        [
          listing.title,
          listing.model.brand,
          listing.model.modelFamily,
          listing.location,
          listing.seller.name,
        ]
          .join(" ")
          .toLowerCase()
          .includes(query);

      return (
        queryMatch &&
        (filters.category === "all" || listing.category === filters.category) &&
        (filters.discipline === "all" ||
          listing.model.discipline === filters.discipline) &&
        (filters.condition === "all" ||
          listing.condition.overallGrade === filters.condition) &&
        (filters.sellerType === "all" ||
          listing.seller.sellerType === filters.sellerType) &&
        (filters.transactionMode === "all" ||
          listing.transactionModes.includes(filters.transactionMode)) &&
        (!filters.verifiedSerial || listing.serial.state === "verified") &&
        (!filters.proofOfPurchase ||
          listing.provenance.proofOfPurchase === "verified") &&
        listing.price <= filters.maxPrice
      );
    });

    return [...matches].sort((a, b) => {
      if (filters.sort === "newest") return a.daysOnMarket - b.daysOnMarket;
      if (filters.sort === "price-low") return a.price - b.price;
      if (filters.sort === "days") return b.daysOnMarket - a.daysOnMarket;
      if (filters.sort === "deal-score") {
        const rank = { "below-market": 0, fair: 1, premium: 2 };
        return rank[a.dealScore] - rank[b.dealScore];
      }
      return b.saves + b.inquiries * 4 - (a.saves + a.inquiries * 4);
    });
  }, [filters, listings]);

  const activeLabels = [
    filters.category !== "all" && labelize(filters.category),
    filters.discipline !== "all" && labelize(filters.discipline),
    filters.condition !== "all" && labelize(filters.condition),
    filters.sellerType !== "all" && labelize(filters.sellerType),
    filters.transactionMode !== "all" && labelize(filters.transactionMode),
    filters.verifiedSerial && "Verified serial",
    filters.proofOfPurchase && "Proof of purchase",
    filters.maxPrice < 8000 && `Under ${currency(filters.maxPrice)}`,
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
              sort: event.target.value as SortKey,
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
            onClick={() => setFilters(initialFilters)}
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
              <Button className="mt-5" onClick={() => setFilters(initialFilters)}>
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
  filters: Filters;
  setFilters: React.Dispatch<React.SetStateAction<Filters>>;
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
        options={categoryOptions}
        onChange={(value) =>
          setFilters((current) => ({
            ...current,
            category: value as Filters["category"],
          }))
        }
      />
      <SelectFilter
        label="Discipline"
        value={filters.discipline}
        options={disciplineOptions}
        onChange={(value) =>
          setFilters((current) => ({
            ...current,
            discipline: value as Filters["discipline"],
          }))
        }
      />
      <SelectFilter
        label="Condition"
        value={filters.condition}
        options={conditionOptions}
        onChange={(value) =>
          setFilters((current) => ({
            ...current,
            condition: value as Filters["condition"],
          }))
        }
      />
      <SelectFilter
        label="Seller type"
        value={filters.sellerType}
        options={sellerOptions}
        onChange={(value) =>
          setFilters((current) => ({
            ...current,
            sellerType: value as Filters["sellerType"],
          }))
        }
      />
      <SelectFilter
        label="Transaction mode"
        value={filters.transactionMode}
        options={transactionOptions}
        onChange={(value) =>
          setFilters((current) => ({
            ...current,
            transactionMode: value as Filters["transactionMode"],
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
  options: string[];
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
