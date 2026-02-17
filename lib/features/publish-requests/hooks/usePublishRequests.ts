"use client";

import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { QUERY_CONFIG } from "@/lib/shared/config/query.config";
import { publishRequestService } from "../services/publish-request.service";
import { useDebounce } from "@/lib/hooks/useDebounce";

import { useApiError } from "@/lib/shared/hooks/useApiError";

export function usePublishRequests(org_id?: string) {
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const { error: apiError, setError: setApiError, clearError } = useApiError();

  // Debounce search
  const debouncedSearch = useDebounce(searchQuery, 300);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["publish-requests", { org_id, status: statusFilter, search: debouncedSearch }],
    queryFn: async () => {
      if (!org_id) return [];

      try {
        return await publishRequestService.getPublishRequests({
          org_id,
          status: statusFilter === "all" ? undefined : statusFilter,
          offset: 0,
          limit: 50,
        });
      } catch (err) {
        setApiError(err);
        throw err;
      }
    },
    enabled: !!org_id,
    staleTime: QUERY_CONFIG.STALE_TIME_FAST,
  });

  // Client-side filtering for instant feedback
  const filteredRequests = useMemo(() => {
    const requests = data || [];
    if (!searchQuery.trim()) return requests;

    const searchLower = searchQuery.toLowerCase();
    return requests.filter(
      (req) =>
        req.did.toLowerCase().includes(searchLower) ||
        req.requested_by.toLowerCase().includes(searchLower)
    );
  }, [data, searchQuery]);

  return {
    requests: filteredRequests,
    isLoading,
    error: apiError,
    clearError,
    statusFilter,
    setStatusFilter,
    searchQuery,
    setSearchQuery,
    refresh: refetch,
  };
}
