"use client";

import { useQuery } from "@tanstack/react-query";
import { didApiClient } from "../api/didApiClient";

export function useDIDMethods() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["did-methods"],
    queryFn: () => didApiClient.getDIDMethods(),
    staleTime: Infinity, // DID methods rarely change
    gcTime: Infinity, // Keep in cache forever
  });

  return {
    methods: data || [],
    isLoading,
    error: error ? (error as Error).message : null,
  };
}
