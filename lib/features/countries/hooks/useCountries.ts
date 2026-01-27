"use client";

import { useQuery } from "@tanstack/react-query";
import { countryService } from "../services/country.service";

/**
 * Hook to fetch countries list
 * Migrated to React Query with infinite cache (data rarely changes)
 */
export function useCountries() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["countries"],
    queryFn: () => countryService.getAllCountries(),
    staleTime: Infinity, // Countries list rarely changes
    gcTime: Infinity, // Keep in cache forever
  });

  return {
    countries: data || [],
    isLoading,
    error: error ? (error as Error).message : null,
  };
}
