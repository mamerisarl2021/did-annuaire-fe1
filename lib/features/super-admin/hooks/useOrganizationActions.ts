"use client";

import { useState, useCallback } from "react";
import { superAdminService } from "../services/superadmin.service";

interface UseOrganizationActionsReturn {
  /** Whether an action is in progress */
  isLoading: boolean;
  /** Error message if any */
  error: string | null;
  /** Validate a pending organization */
  validateOrganization: (orgId: string) => Promise<boolean>;
  /** Refuse a pending organization with reason */
  refuseOrganization: (orgId: string, reason: string) => Promise<boolean>;
  /** Toggle organization status (active/suspended) */
  toggleOrganizationStatus: (orgId: string) => Promise<boolean>;
  /** Delete an organization */
  deleteOrganization: (orgId: string) => Promise<boolean>;
  /** Clear error state */
  clearError: () => void;
}

/**
 * Hook for organization management actions
 *
 * Single Responsibility: Handles CRUD operations on organizations
 * - Validate, refuse, toggle, delete
 * - Manages loading and error states
 *
 * Does NOT handle:
 * - UI state (modals, selections)
 * - Data fetching (handled by useOrganizations)
 */
export function useOrganizationActions(): UseOrganizationActionsReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateOrganization = useCallback(async (orgId: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    try {
      await superAdminService.validateOrganization(orgId);
      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Error during validation";
      setError(message);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const refuseOrganization = useCallback(
    async (orgId: string, reason: string): Promise<boolean> => {
      if (!reason.trim()) {
        setError("Refusal reason is required");
        return false;
      }
      setIsLoading(true);
      setError(null);
      try {
        await superAdminService.refuseOrganization(orgId, reason);
        return true;
      } catch (err) {
        const message = err instanceof Error ? err.message : "Error during refusal";
        setError(message);
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const toggleOrganizationStatus = useCallback(async (orgId: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    try {
      await superAdminService.toggleOrganizationStatus(orgId);
      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Error during status change";
      setError(message);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const deleteOrganization = useCallback(async (orgId: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    try {
      await superAdminService.deleteOrganization(orgId);
      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Error during deletion";
      setError(message);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    isLoading,
    error,
    validateOrganization,
    refuseOrganization,
    toggleOrganizationStatus,
    deleteOrganization,
    clearError,
  };
}
