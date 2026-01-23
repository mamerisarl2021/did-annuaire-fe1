import { useState, useEffect, useCallback } from "react";
import { organizationService } from "../services/organization.service";
import { type OrganizationListItem } from "../types/organization.types";
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
  const [organization, setOrganization] = useState<OrganizationListItem | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStatus = useCallback(async () => {
    if (!organizationId || !enabled) return;

    setIsLoading(true);
    setError(null);
    try {
      const data = await organizationService.getOrganizationDetails(organizationId);
      setOrganization(data);
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

    const shouldPoll = organization?.status === "PENDING";
    if (!shouldPoll) return;

    const interval = setInterval(fetchStatus, pollingInterval);
    return () => clearInterval(interval);
  }, [fetchStatus, pollingInterval, organization?.status, enabled, organizationId]);

  return {
    organization,
    isLoading,
    error,
    refetch: fetchStatus,
  };
}
