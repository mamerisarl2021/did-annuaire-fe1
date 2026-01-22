"use client";

import { useState, useCallback } from "react";
import { superAdminService } from "../services/superadmin.service";
import { type OrganizationListItem } from "../../organizations/types/organization.types";

interface UseOrganizationActionsReturn {
  isLoading: boolean;
  error: string | null;
  getOrganizationDetails: (orgId: string) => Promise<OrganizationListItem | null>;
  validateOrganization: (orgId: string) => Promise<boolean>;
  refuseOrganization: (orgId: string, reason: string) => Promise<boolean>;
  toggleOrganizationStatus: (orgId: string) => Promise<boolean>;
  deleteOrganization: (orgId: string) => Promise<boolean>;
  clearError: () => void;
}

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

  const getOrganizationDetails = useCallback(
    async (orgId: string): Promise<OrganizationListItem | null> => {
      setIsLoading(true);
      setError(null);
      try {
        return await superAdminService.getOrganizationDetails(orgId);
      } catch (err) {
        const message = err instanceof Error ? err.message : "Error fetching details";
        setError(message);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    isLoading,
    error,
    getOrganizationDetails,
    validateOrganization,
    refuseOrganization,
    toggleOrganizationStatus,
    deleteOrganization,
    clearError,
  };
}
