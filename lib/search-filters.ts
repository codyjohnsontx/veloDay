import type {
  BikeListing,
  ConditionGrade,
  Discipline,
  ListingCategory,
  SellerType,
  TransactionMode,
} from "@/lib/types";

export type SortKey = "recommended" | "newest" | "price-low" | "deal-score" | "days";

export interface SearchFilters {
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

export const defaultSearchFilters: SearchFilters = {
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

/** Ordered options for category filter UI and URL validation (single source of truth). */
export const filterCategoryOptions: ReadonlyArray<"all" | ListingCategory> = [
  "all",
  "complete-bike",
  "frame",
  "wheelset",
];

/** Ordered options for discipline filter UI and URL validation (matches `Discipline` + all). */
export const filterDisciplineOptions: ReadonlyArray<"all" | Discipline> = [
  "all",
  "road",
  "gravel",
  "mountain",
  "triathlon",
  "commuter",
  "e-bike",
];

export const filterConditionOptions: ReadonlyArray<"all" | ConditionGrade> = [
  "all",
  "excellent",
  "very-good",
  "good",
  "fair",
];

export const filterSellerOptions: ReadonlyArray<"all" | SellerType> = [
  "all",
  "private",
  "shop",
  "consignment",
  "certified-partner",
];

export const filterTransactionOptions: ReadonlyArray<"all" | TransactionMode> = [
  "all",
  "local-pickup",
  "managed-shipping",
  "inspection-partner",
];

const CATEGORIES = new Set(filterCategoryOptions);
const DISCIPLINES = new Set(filterDisciplineOptions);
const CONDITIONS = new Set(filterConditionOptions);
const SELLERS = new Set(filterSellerOptions);
const TXNS = new Set(filterTransactionOptions);
const SORTS = new Set<SortKey>([
  "recommended",
  "newest",
  "price-low",
  "deal-score",
  "days",
]);

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

export type SearchParamSource = Pick<URLSearchParams, "get">;

export function parseSearchFilters(params: SearchParamSource): SearchFilters {
  const rawQ = params.get("q") ?? "";
  const q = rawQ.trim().slice(0, 200);
  const category = params.get("category");
  const discipline = params.get("discipline");
  const condition = params.get("condition");
  const sellerType = params.get("seller");
  const transactionMode = params.get("txn");
  const maxRaw = params.get("max");
  const sort = params.get("sort");

  let maxPrice = defaultSearchFilters.maxPrice;
  if (maxRaw !== null && maxRaw !== "") {
    const n = Number(maxRaw);
    if (!Number.isNaN(n)) {
      maxPrice = clamp(Math.round(n), 1000, 8000);
    }
  }

  return {
    query: q,
    category:
      category && CATEGORIES.has(category as "all" | ListingCategory)
        ? (category as SearchFilters["category"])
        : "all",
    discipline:
      discipline && DISCIPLINES.has(discipline as "all" | Discipline)
        ? (discipline as SearchFilters["discipline"])
        : "all",
    condition:
      condition && CONDITIONS.has(condition as "all" | ConditionGrade)
        ? (condition as SearchFilters["condition"])
        : "all",
    sellerType:
      sellerType && SELLERS.has(sellerType as "all" | SellerType)
        ? (sellerType as SearchFilters["sellerType"])
        : "all",
    transactionMode:
      transactionMode && TXNS.has(transactionMode as "all" | TransactionMode)
        ? (transactionMode as SearchFilters["transactionMode"])
        : "all",
    verifiedSerial: params.get("verified") === "1",
    proofOfPurchase: params.get("proof") === "1",
    maxPrice,
    sort: sort && SORTS.has(sort as SortKey) ? (sort as SortKey) : "recommended",
  };
}

export function serializeSearchFilters(filters: SearchFilters): string {
  const p = new URLSearchParams();
  if (filters.query.trim()) p.set("q", filters.query.trim());
  if (filters.category !== "all") p.set("category", filters.category);
  if (filters.discipline !== "all") p.set("discipline", filters.discipline);
  if (filters.condition !== "all") p.set("condition", filters.condition);
  if (filters.sellerType !== "all") p.set("seller", filters.sellerType);
  if (filters.transactionMode !== "all") p.set("txn", filters.transactionMode);
  if (filters.verifiedSerial) p.set("verified", "1");
  if (filters.proofOfPurchase) p.set("proof", "1");
  if (filters.maxPrice !== defaultSearchFilters.maxPrice) {
    p.set("max", String(filters.maxPrice));
  }
  if (filters.sort !== defaultSearchFilters.sort) p.set("sort", filters.sort);
  return p.toString();
}

export function filterAndSortListings(
  listings: BikeListing[],
  filters: SearchFilters,
): BikeListing[] {
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
}
