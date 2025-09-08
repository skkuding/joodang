"use client";

import { FilterVariables } from "@/app/type";
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

type Ctx = {
  filterValue: FilterVariables;
  setFilterValue: React.Dispatch<React.SetStateAction<FilterVariables>>;
  isFilterSet: boolean;
  setIsFilterSet: React.Dispatch<React.SetStateAction<boolean>>;
};

const FilterContext = createContext<Ctx | null>(null);

const STORAGE_KEY = "joodang:filters:v1";

const defaultFilter: FilterVariables = {
  days: "0000-00-00",
  maxFee: 15000,
  startTime: "00:00",
  endTime: "00:00",
};

export function FilterProvider({ children }: { children: React.ReactNode }) {
  // 1) 클라에서만 복원 (SSR/Hydration 안전)
  const [filterValue, setFilterValue] =
    useState<FilterVariables>(defaultFilter);
  const [isFilterSet, setIsFilterSet] = useState(false);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as {
          filterValue: FilterVariables;
          isFilterSet: boolean;
        };
        setFilterValue(parsed.filterValue ?? defaultFilter);
        setIsFilterSet(parsed.isFilterSet ?? false);
      }
    } catch {}
  }, []);

  // 2) 변경 시 저장
  useEffect(() => {
    try {
      sessionStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ filterValue, isFilterSet })
      );
    } catch {}
  }, [filterValue, isFilterSet]);

  const value = useMemo(
    () => ({ filterValue, setFilterValue, isFilterSet, setIsFilterSet }),
    [filterValue, isFilterSet]
  );

  return (
    <FilterContext.Provider value={value}>{children}</FilterContext.Provider>
  );
}

export function useFilter() {
  const ctx = useContext(FilterContext);
  if (!ctx) throw new Error("useFilter must be used within <FilterProvider>");
  return ctx;
}
