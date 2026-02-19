"use client";

import { useQuery } from "@tanstack/react-query";
import { useState, useMemo, useEffect } from "react";
import { QUERY_CONFIG } from "@/lib/shared/config/query.config";
import { usersService } from "../services/users.service";
import { superAdminService } from "../../super-admin/services/superadmin.service";
import { useAuth } from "@/lib/features/auth/hooks/useAuth";
import {
  User,
  GetUsersParams,
  CreateUserPayload,
  UpdateUserPayload,
} from "../types/users.types";
import { useDebounce } from "@/lib/hooks/useDebounce";
import { UserRole } from "@/lib/types/roles";

import { useErrorToast } from "@/lib/shared/hooks/useErrorToast";
import { useApiError } from "@/lib/shared/hooks/useApiError";

/**
 * Hook for User Management logic
 * Migrated to React Query for better performance and caching
 */
export function useUsers(initialParams: GetUsersParams = {}) {
  const { user } = useAuth();
  const isSuperAdmin = useMemo(
    () => user?.roles?.includes(UserRole.SUPER_USER) || user?.role === UserRole.SUPER_USER,
    [user]
  );

  const [clientSearch, setClientSearch] = useState("");
  const [page, setPage] = useState(initialParams.page || 1);
  const [pageSize, setPageSize] = useState(initialParams.page_size || 10);
  const [serverSearch, setServerSearch] = useState(initialParams.search || "");
  const [status, setStatus] = useState<string | undefined>(initialParams.status);

  const { showError, showSuccess } = useErrorToast();
  const { error: apiError, setError: setApiError, clearError } = useApiError();

  // Debounce server search
  const debouncedServerSearch = useDebounce(serverSearch, 300);

  const params: GetUsersParams = {
    page,
    page_size: pageSize,
    search: debouncedServerSearch.trim() || undefined,
    status: status === "all" ? undefined : status,
    org_id: initialParams.org_id,
  };

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["users", params, { isSuperAdmin }],
    queryFn: async () => {
      try {
        if (isSuperAdmin) {
          return await superAdminService.getUsers({
            page,
            page_size: pageSize,
            search: params.search,
            status: params.status,
          });
        }
        return await usersService.getUsers(params);
      } catch (err) {
        setApiError(err);
        throw err;
      }
    },
    staleTime: QUERY_CONFIG.STALE_TIME_FAST,
  });

  // Clear error on successful data fetch
  useEffect(() => {
    if (data && apiError) {
      clearError();
    }
  }, [data, apiError, clearError]);

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
      (user: User) =>
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
      showSuccess("L'utilisateur a été créé avec succès.");
      if (autoRefresh) await refetch();
      return newUser;
    } catch (err) {
      showError(err, "Échec de la création");
      throw err;
    }
  };

  const inviteUser = async (userId: string, options: { autoRefresh?: boolean } = {}) => {
    const { autoRefresh = true } = options;
    try {
      await usersService.inviteUser(userId);
      showSuccess("L'invitation a été envoyée avec succès.");
      if (autoRefresh) await refetch();
    } catch (err) {
      showError(err, "Échec de l'invitation");
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
      showSuccess("L'utilisateur a été mis à jour avec succès.");
      if (autoRefresh) await refetch();
      return updatedUser;
    } catch (err) {
      showError(err, "Échec de la mise à jour");
      throw err;
    }
  };

  const toggleUserStatus = async (userId: string, options: { autoRefresh?: boolean } = {}) => {
    const { autoRefresh = true } = options;
    try {
      await usersService.toggleUserStatus(userId);
      showSuccess("Le statut de l'utilisateur a été modifié.");
      if (autoRefresh) await refetch();
    } catch (err) {
      showError(err, "Échec de la modification du statut");
      throw err;
    }
  };

  const deleteUser = async (userId: string, options: { autoRefresh?: boolean } = {}) => {
    const { autoRefresh = true } = options;
    try {
      await usersService.deleteUser(userId);
      showSuccess("L'utilisateur a été supprimé.");
      if (autoRefresh) await refetch();
    } catch (err) {
      showError(err, "Échec de la suppression");
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
    error: apiError,
    clearError,
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
    deleteUser,
  };
}
