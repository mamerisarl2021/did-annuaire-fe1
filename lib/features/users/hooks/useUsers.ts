import { useState, useCallback, useEffect } from "react";
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

  const createUser = async (payload: CreateUserPayload) => {
    try {
      const newUser = await usersApiClient.createUser(payload);
      await fetchUsers();
      return newUser;
    } catch (err) {
      logger.error("[useUsers] Create error:", err);
      throw err;
    }
  };

  const inviteUser = async (userId: string) => {
    try {
      await usersApiClient.inviteUser(userId);
      await fetchUsers();
    } catch (err) {
      logger.error("[useUsers] Invite error:", err);
      throw err;
    }
  };

  const updateUser = async (userId: string, payload: UpdateUserPayload) => {
    try {
      const updatedUser = await usersApiClient.updateUser(userId, payload);
      await fetchUsers();
      return updatedUser;
    } catch (err) {
      logger.error("[useUsers] Update error:", err);
      throw err;
    }
  };

  const deactivateUser = async (userId: string) => {
    try {
      await usersApiClient.updateUser(userId, { status: "DEACTIVATED" as UserStatus });
      await fetchUsers();
    } catch (err) {
      logger.error("[useUsers] Deactivate error:", err);
      throw err;
    }
  };

  const setPage = (page: number) => setParams((prev) => ({ ...prev, page }));
  const setSearch = (search: string) => setParams((prev) => ({ ...prev, search, page: 1 }));

  return {
    users,
    isLoading,
    error,
    pagination,
    params,
    setPage,
    setSearch,
    refresh: fetchUsers,
    createUser,
    inviteUser,
    updateUser,
    deactivateUser,
  };
}
