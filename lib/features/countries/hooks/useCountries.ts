"use client";

import { useQuery } from "@tanstack/react-query";
import { QUERY_CONFIG } from "@/lib/shared/config/query.config";
import { countryService } from "../services/country.service";

/**
 * Hook to fetch countries list
 * Migrated to React Query with infinite cache (data rarely changes)
 */
export function useCountries() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["countries"],
    queryFn: () => countryService.getAllCountries(),
    staleTime: QUERY_CONFIG.STALE_TIME_INFINITE,
    gcTime: QUERY_CONFIG.GC_TIME_INFINITE,
  });

  return {
    countries: data || [],
    isLoading,
    error: error ? (error as Error).message : null,
  };
}
