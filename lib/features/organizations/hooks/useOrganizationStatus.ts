import { useState, useEffect, useCallback } from "react";
import { organizationService } from "../services/organization.service";
import { type OrganizationStatusType } from "@/lib/types/organization-status";
import { logger } from "@/lib/shared/services/logger.service";

interface UseOrganizationStatusOptions {
  organizationId?: string;
  pollingInterval?: number;
  enabled?: boolean;
}

export function useOrganizationStatus({
  organizationId,
  pollingInterval = 30000,
  enabled = true,
}: UseOrganizationStatusOptions) {
  const [status, setStatus] = useState<OrganizationStatusType | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStatus = useCallback(async () => {
    if (!organizationId || !enabled) return;

    setIsLoading(true);
    setError(null);
    try {
      const data = await organizationService.getOrganizationStatus(organizationId);
      setStatus(data.status as OrganizationStatusType);
      logger.info("Organization status fetched", { status: data.status });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to fetch status";
      setError(message);
      logger.error("Failed to fetch organization status", err);
    } finally {
      setIsLoading(false);
    }
  }, [organizationId, enabled]);

  useEffect(() => {
    if (!enabled || !organizationId) return;

    fetchStatus();

    const shouldPoll = status === "PENDING";
    if (!shouldPoll) return;

    const interval = setInterval(fetchStatus, pollingInterval);
    return () => clearInterval(interval);
  }, [fetchStatus, pollingInterval, status, enabled, organizationId]);

  return {
    status,
    isLoading,
    error,
    refetch: fetchStatus,
  };
}
