"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { publishRequestService } from "../services/publish-request.service";
import { PublishRequest, ApprovePayload, RejectPayload } from "../types/publish-request.types";
import { logger } from "@/lib/shared/services/logger.service";

export function usePublishRequests(org_id?: string) {
  const [requests, setRequests] = useState<PublishRequest[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [offset] = useState(0);
  const limit = 50;

  const fetchRequests = useCallback(async () => {
    if (!org_id) return;

    setIsLoading(true);
    setError(null);
    try {
      const data = await publishRequestService.getPublishRequests({
        org_id,
        status: statusFilter === "all" ? undefined : statusFilter,
        offset,
        limit,
      });
      setRequests(data);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to fetch publish requests";
      setError(msg);
      logger.error("[usePublishRequests] Fetch error:", err);
    } finally {
      setIsLoading(false);
    }
  }, [org_id, statusFilter, offset]);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  const filteredRequests = useMemo(() => {
    if (!searchQuery.trim()) return requests;

    const searchLower = searchQuery.toLowerCase();
    return requests.filter(
      (req) =>
        req.did.toLowerCase().includes(searchLower) ||
        req.requested_by.toLowerCase().includes(searchLower)
    );
  }, [requests, searchQuery]);

  const approveRequest = async (id: string, payload: ApprovePayload = {}) => {
    try {
      await publishRequestService.approveRequest(id, payload);
      await fetchRequests();
    } catch (err) {
      logger.error("[usePublishRequests] Approve error:", err);
      throw err;
    }
  };

  const rejectRequest = async (id: string, payload: RejectPayload = {}) => {
    try {
      await publishRequestService.rejectRequest(id, payload);
      await fetchRequests();
    } catch (err) {
      logger.error("[usePublishRequests] Reject error:", err);
      throw err;
    }
  };

  return {
    requests: filteredRequests,
    isLoading,
    error,
    statusFilter,
    setStatusFilter,
    searchQuery,
    setSearchQuery,
    approveRequest,
    rejectRequest,
    refresh: fetchRequests,
  };
}
