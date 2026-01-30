"use client";

import { useQuery } from "@tanstack/react-query";
import { useState, useMemo } from "react";
import { QUERY_CONFIG } from "@/lib/shared/config/query.config";
import { usersService } from "../services/users.service";
import { GetUsersParams, CreateUserPayload, UpdateUserPayload } from "../types/users.types";
import { logger } from "@/lib/shared/services/logger.service";
import { useDebounce } from "@/lib/hooks/useDebounce";

/**
 * Hook for User Management logic
 * Migrated to React Query for better performance and caching
 */
export function useUsers(initialParams: GetUsersParams = {}) {
  const [clientSearch, setClientSearch] = useState("");
  const [page, setPage] = useState(initialParams.page || 1);
  const [pageSize, setPageSize] = useState(initialParams.page_size || 10);
  const [serverSearch, setServerSearch] = useState(initialParams.search || "");
  const [status, setStatus] = useState<string | undefined>(initialParams.status);

  // Debounce server search
  const debouncedServerSearch = useDebounce(serverSearch, 300);

  const params: GetUsersParams = {
    page,
    page_size: pageSize,
    search: debouncedServerSearch.trim() || undefined,
    status: status === "all" ? undefined : status,
    org_id: initialParams.org_id,
  };

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["users", params],
    queryFn: async () => usersService.getUsers(params),
    staleTime: QUERY_CONFIG.STALE_TIME_FAST,
  });

  const pagination = data?.data?.pagination || {
    page: 1,
    page_size: 10,
    total: 0,
    total_pages: 1,
    has_next: false,
    has_previous: false,
  };

  // Client-side filtering for instant feedback
  const filteredUsers = useMemo(() => {
    const users = data?.data?.items || [];
    if (!clientSearch.trim()) return users;

    const searchLower = clientSearch.toLowerCase();
    return users.filter(
      (user) =>
        user.full_name?.toLowerCase().includes(searchLower) ||
        user.email?.toLowerCase().includes(searchLower) ||
        user.organization?.toLowerCase().includes(searchLower)
    );
  }, [data?.data?.items, clientSearch]);

  const createUser = async (
    payload: CreateUserPayload,
    options: { autoRefresh?: boolean } = {}
  ) => {
    const { autoRefresh = true } = options;
    try {
      const newUser = await usersService.createUser(payload);
      if (autoRefresh) await refetch();
      return newUser;
    } catch (err) {
      logger.error("[useUsers] Create error:", err);
      throw err;
    }
  };

  const inviteUser = async (userId: string, options: { autoRefresh?: boolean } = {}) => {
    const { autoRefresh = true } = options;
    try {
      await usersService.inviteUser(userId);
      if (autoRefresh) await refetch();
    } catch (err) {
      logger.error("[useUsers] Invite error:", err);
      throw err;
    }
  };

  const updateUser = async (
    userId: string,
    payload: UpdateUserPayload,
    options: { autoRefresh?: boolean } = {}
  ) => {
    const { autoRefresh = true } = options;
    try {
      const updatedUser = await usersService.updateUser(userId, payload);
      if (autoRefresh) await refetch();
      return updatedUser;
    } catch (err) {
      logger.error("[useUsers] Update error:", err);
      throw err;
    }
  };

  const toggleUserStatus = async (userId: string, options: { autoRefresh?: boolean } = {}) => {
    const { autoRefresh = true } = options;
    try {
      await usersService.toggleUserStatus(userId);
      if (autoRefresh) await refetch();
    } catch (err) {
      logger.error("[useUsers] Toggle status error:", err);
      throw err;
    }
  };

  const setSearch = (search: string) => {
    setServerSearch(search);
    setPage(1);
  };

  return {
    users: data?.data?.items || [],
    filteredUsers,
    isLoading,
    error: error ? (error as Error).message : null,
    pagination,
    params,
    setPage,
    setPageSize,
    setSearch,
    setClientSearch,
    setStatus: (newStatus: string | undefined) => {
      setStatus(newStatus);
      setPage(1);
    },
    refresh: refetch,
    createUser,
    inviteUser,
    updateUser,
    toggleUserStatus,
  };
}
