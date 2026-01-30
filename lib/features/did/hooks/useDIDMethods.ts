"use client";

import { useQuery } from "@tanstack/react-query";
import { didApiClient } from "../api/didApiClient";
import { QUERY_CONFIG } from "@/lib/shared/config/query.config";

export function useDIDMethods() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["did-methods"],
    queryFn: () => didApiClient.getDIDMethods(),
    staleTime: QUERY_CONFIG.STALE_TIME_INFINITE,
    gcTime: QUERY_CONFIG.GC_TIME_INFINITE,
  });

  return {
    methods: data || [],
    isLoading,
    error: error ? (error as Error).message : null,
  };
}
