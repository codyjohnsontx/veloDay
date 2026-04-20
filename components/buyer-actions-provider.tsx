"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { listings } from "@/lib/data";

const SAVED_STORAGE_KEY = "veloday.savedListings.v1";
const COMPARE_STORAGE_KEY = "veloday.compareListings.v1";
const COMPARE_LIMIT = 3;

const validListingIds = new Set(listings.map((listing) => listing.id));

interface BuyerActionsContextValue {
  savedIds: string[];
  compareIds: string[];
  compareLimit: number;
  compareLimitReached: boolean;
  isSaved: (id: string) => boolean;
  toggleSaved: (id: string) => void;
  isCompared: (id: string) => boolean;
  toggleCompare: (id: string) => void;
  removeCompare: (id: string) => void;
  clearCompare: () => void;
}

const BuyerActionsContext = createContext<BuyerActionsContextValue | null>(null);

function readStoredIds(key: string): string[] {
  if (typeof window === "undefined") return [];

  try {
    const parsed = JSON.parse(window.localStorage.getItem(key) ?? "[]");
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((id): id is string => typeof id === "string")
      .filter((id, index, ids) => validListingIds.has(id) && ids.indexOf(id) === index);
  } catch {
    return [];
  }
}

function writeStoredIds(key: string, ids: string[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(key, JSON.stringify(ids));
}

export function BuyerActionsProvider({ children }: { children: ReactNode }) {
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [compareIds, setCompareIds] = useState<string[]>([]);

  useEffect(() => {
    setSavedIds(readStoredIds(SAVED_STORAGE_KEY));
    setCompareIds(readStoredIds(COMPARE_STORAGE_KEY).slice(0, COMPARE_LIMIT));
  }, []);

  useEffect(() => {
    writeStoredIds(SAVED_STORAGE_KEY, savedIds);
  }, [savedIds]);

  useEffect(() => {
    writeStoredIds(COMPARE_STORAGE_KEY, compareIds);
  }, [compareIds]);

  const toggleSaved = useCallback((id: string) => {
    if (!validListingIds.has(id)) return;
    setSavedIds((current) =>
      current.includes(id)
        ? current.filter((savedId) => savedId !== id)
        : [...current, id],
    );
  }, []);

  const removeCompare = useCallback((id: string) => {
    setCompareIds((current) => current.filter((compareId) => compareId !== id));
  }, []);

  const toggleCompare = useCallback((id: string) => {
    if (!validListingIds.has(id)) return;
    setCompareIds((current) => {
      if (current.includes(id)) {
        return current.filter((compareId) => compareId !== id);
      }
      if (current.length >= COMPARE_LIMIT) {
        return current;
      }
      return [...current, id];
    });
  }, []);

  const clearCompare = useCallback(() => {
    setCompareIds([]);
  }, []);

  const value = useMemo<BuyerActionsContextValue>(
    () => ({
      savedIds,
      compareIds,
      compareLimit: COMPARE_LIMIT,
      compareLimitReached: compareIds.length >= COMPARE_LIMIT,
      isSaved: (id) => savedIds.includes(id),
      toggleSaved,
      isCompared: (id) => compareIds.includes(id),
      toggleCompare,
      removeCompare,
      clearCompare,
    }),
    [clearCompare, compareIds, removeCompare, savedIds, toggleCompare, toggleSaved],
  );

  return (
    <BuyerActionsContext.Provider value={value}>
      {children}
    </BuyerActionsContext.Provider>
  );
}

export function useBuyerActions() {
  const context = useContext(BuyerActionsContext);
  if (!context) {
    throw new Error("useBuyerActions must be used within BuyerActionsProvider");
  }
  return context;
}
