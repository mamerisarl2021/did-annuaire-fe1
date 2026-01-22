import { useState, useCallback, useEffect, useMemo } from "react";
import { usersApiClient } from "../api/usersApiClient";
import {
  User,
  GetUsersParams,
  CreateUserPayload,
  UpdateUserPayload,
  UserStatus,
} from "../types/users.types";
import { logger } from "@/lib/shared/services/logger.service";

/**
 * Hook for User Management logic
 * Orchestrates API calls and manages state according to SRP
 */
export function useUsers(initialParams: GetUsersParams = {}) {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [clientSearch, setClientSearch] = useState("");
  const [pagination, setPagination] = useState<{
    page: number;
    page_size: number;
    total: number;
    total_pages: number;
    has_next: boolean;
    has_previous: boolean;
  }>({
    page: 1,
    page_size: 10,
    total: 0,
    total_pages: 1,
    has_next: false,
    has_previous: false,
  });

  const [params, setParams] = useState<GetUsersParams>({
    page: 1,
    page_size: 10,
    ...initialParams,
  });

  const filteredUsers = useMemo(() => {
    if (!clientSearch.trim()) return users;

    const searchLower = clientSearch.toLowerCase();
    return users.filter(
      (user) =>
        user.full_name?.toLowerCase().includes(searchLower) ||
        user.email?.toLowerCase().includes(searchLower) ||
        user.organization?.toLowerCase().includes(searchLower)
    );
  }, [users, clientSearch]);

  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await usersApiClient.getUsers(params);
      setUsers(response.data?.items || []);
      setPagination(response.data?.pagination || {});
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to fetch users";
      setError(msg);
      logger.error("[useUsers] Fetch error:", err);
    } finally {
      setIsLoading(false);
    }
  }, [params]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const createUser = async (
    payload: CreateUserPayload,
    options: { autoRefresh?: boolean } = {}
  ) => {
    const { autoRefresh = true } = options;
    try {
      const newUser = await usersApiClient.createUser(payload);
      if (autoRefresh) await fetchUsers();
      return newUser;
    } catch (err) {
      logger.error("[useUsers] Create error:", err);
      throw err;
    }
  };

  const inviteUser = async (userId: string, options: { autoRefresh?: boolean } = {}) => {
    const { autoRefresh = true } = options;
    try {
      await usersApiClient.inviteUser(userId);
      if (autoRefresh) await fetchUsers();
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
      const updatedUser = await usersApiClient.updateUser(userId, payload);
      if (autoRefresh) await fetchUsers();
      return updatedUser;
    } catch (err) {
      logger.error("[useUsers] Update error:", err);
      throw err;
    }
  };

  const deactivateUser = async (userId: string, options: { autoRefresh?: boolean } = {}) => {
    const { autoRefresh = true } = options;
    try {
      await usersApiClient.updateUser(userId, { status: "DEACTIVATED" as UserStatus });
      if (autoRefresh) await fetchUsers();
    } catch (err) {
      logger.error("[useUsers] Deactivate error:", err);
      throw err;
    }
  };

  const setPage = (page: number) => setParams((prev) => ({ ...prev, page }));
  const setSearch = (search: string) => setParams((prev) => ({ ...prev, search, page: 1 }));
  const updateClientSearch = (search: string) => setClientSearch(search);

  return {
    users,
    filteredUsers,
    isLoading,
    error,
    pagination,
    params,
    setPage,
    setSearch,
    setClientSearch: updateClientSearch,
    refresh: fetchUsers,
    createUser,
    inviteUser,
    updateUser,
    deactivateUser,
  };
}
