"use client";

import { useQuery } from "@tanstack/react-query";
import { QUERY_CONFIG } from "@/lib/shared/config/query.config";
import { publishRequestService } from "../services/publish-request.service";

export function usePublishRequestsStats(org_id?: string) {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["publish-requests", "stats", { org_id }],
    queryFn: async () => {
      if (!org_id) return null;
      return publishRequestService.getPublishRequestsStats(org_id);
    },
    enabled: !!org_id,
    staleTime: QUERY_CONFIG.STALE_TIME_STANDARD,
  });

  return {
    stats: data || null,
    isLoading,
    error: error ? (error as Error).message : null,
    refresh: refetch,
  };
}
