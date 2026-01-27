import { useQuery } from "@tanstack/react-query";
import { QUERY_CONFIG } from "@/lib/shared/config/query.config";
import { usersService } from "../services/users.service";

/**
 * Hook to fetch user statistics
 * Migrated to React Query
 */
export function useUsersStats() {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["users", "stats"],
    queryFn: () => usersService.getUsersStats(),
    staleTime: QUERY_CONFIG.STALE_TIME_STANDARD,
  });

  return {
    stats: data || null,
    isLoading,
    error: error ? (error as Error).message : null,
    refresh: refetch,
  };
}
