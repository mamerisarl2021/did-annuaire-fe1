"use client";

import { useQuery } from "@tanstack/react-query";
import { didService } from "../services/did.service";
import { QUERY_CONFIG } from "@/lib/shared/config/query.config";

/**
 * Hook to fetch random DIDs for testing/suggestions
 * @param limit - Number of random DIDs to fetch (default: 10)
 */
export function useRandomDIDs(limit: number = 10) {
    return useQuery({
        queryKey: ["random-dids", limit],
        queryFn: () => didService.getRandomDIDs(limit),
        staleTime: QUERY_CONFIG.STALE_TIME_STANDARD,
        gcTime: QUERY_CONFIG.GC_TIME_STANDARD,
        retry: QUERY_CONFIG.RETRY_COUNT_STANDARD,
    });
}
