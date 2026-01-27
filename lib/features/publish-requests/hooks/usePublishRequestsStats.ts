"use client";

import { useState, useEffect, useCallback } from "react";
import { publishRequestService } from "../services/publish-request.service";
import { PublishRequestStats } from "../types/publish-request.types";

export function usePublishRequestsStats(org_id?: string) {
  const [stats, setStats] = useState<PublishRequestStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    if (!org_id) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const data = await publishRequestService.getPublishRequestsStats(org_id);
      console.log("[usePublishRequestsStats] Stats loaded:", data);
      setStats(data);
    } catch (err) {
      console.error("[usePublishRequestsStats] Error:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch stats");
    } finally {
      setIsLoading(false);
    }
  }, [org_id]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return { stats, isLoading, error, refresh: fetchStats };
}
