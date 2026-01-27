"use client";

import { useQuery } from "@tanstack/react-query";
import { QUERY_CONFIG } from "@/lib/shared/config/query.config";
import { didService } from "../services/did.service";

export function useDIDsStats() {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["dids", "stats"],
    queryFn: () => didService.getDIDsStats(),
    staleTime: QUERY_CONFIG.STALE_TIME_STANDARD, 
  });

  return {
    stats: data || null,
    isLoading,
    error: error ? (error as Error).message : null,
    refresh: refetch,
  };
}
