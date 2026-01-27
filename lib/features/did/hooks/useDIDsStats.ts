"use client";

import { useQuery } from "@tanstack/react-query";
import { didService } from "../services/did.service";

export function useDIDsStats() {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["dids", "stats"],
    queryFn: () => didService.getDIDsStats(),
    staleTime: 5 * 60 * 1000, // 5 minutes - stats don't change frequently
  });

  return {
    stats: data || null,
    isLoading,
    error: error ? (error as Error).message : null,
    refresh: refetch,
  };
}
