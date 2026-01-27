"use client";

import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { publishRequestService } from "../services/publish-request.service";
import { useDebounce } from "@/lib/hooks/useDebounce";

export function usePublishRequests(org_id?: string) {
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Debounce search
  const debouncedSearch = useDebounce(searchQuery, 300);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["publish-requests", { org_id, status: statusFilter, search: debouncedSearch }],
    queryFn: async () => {
      if (!org_id) return [];

      return publishRequestService.getPublishRequests({
        org_id,
        status: statusFilter === "all" ? undefined : statusFilter,
        offset: 0,
        limit: 50,
      });
    },
    enabled: !!org_id,
    staleTime: 60 * 1000, // 1 minute
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
    error: error ? (error as Error).message : null,
    statusFilter,
    setStatusFilter,
    searchQuery,
    setSearchQuery,
    refresh: refetch,
  };
}
