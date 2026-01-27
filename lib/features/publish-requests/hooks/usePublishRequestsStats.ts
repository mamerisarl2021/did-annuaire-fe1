"use client";

import { useQuery } from "@tanstack/react-query";
import { publishRequestService } from "../services/publish-request.service";

export function usePublishRequestsStats(org_id?: string) {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["publish-requests", "stats", { org_id }],
    queryFn: async () => {
      if (!org_id) return null;
      return publishRequestService.getPublishRequestsStats(org_id);
    },
    enabled: !!org_id,
    staleTime: 5 * 60 * 1000, // 5 minutes - stats don't change frequently
  });

  return {
    stats: data || null,
    isLoading,
    error: error ? (error as Error).message : null,
    refresh: refetch,
  };
}
