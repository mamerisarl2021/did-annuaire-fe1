"use client";

import { useQuery } from "@tanstack/react-query";
import { usersService } from "../services/users.service";

/**
 * Hook to fetch user statistics
 * Migrated to React Query
 */
export function useUsersStats() {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["users", "stats"],
    queryFn: () => usersService.getUsersStats(),
    staleTime: 5 * 60 * 1000, // 5 minutes - stats don't change frequently
  });

  return {
    stats: data || null,
    isLoading,
    error: error ? (error as Error).message : null,
    refresh: refetch,
  };
}
