"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { publishRequestService } from "../services/publish-request.service";
import { ApprovePayload, RejectPayload } from "../types/publish-request.types";
import { logger } from "@/lib/shared/services/logger.service";

/**
 * Hook for Publish Request mutations (approve/reject)
 * Uses React Query mutations with automatic cache invalidation
 */
export function usePublishRequestActions(org_id?: string) {
  const queryClient = useQueryClient();

  const approveMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload?: ApprovePayload }) =>
      publishRequestService.approveRequest(id, payload || {}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["publish-requests", { org_id }] });
      queryClient.invalidateQueries({ queryKey: ["publish-requests", "stats", { org_id }] });
    },
    onError: (err) => {
      logger.error("[usePublishRequestActions] Approve error:", err);
    },
  });

  const rejectMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload?: RejectPayload }) =>
      publishRequestService.rejectRequest(id, payload || {}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["publish-requests", { org_id }] });
      queryClient.invalidateQueries({ queryKey: ["publish-requests", "stats", { org_id }] });
    },
    onError: (err) => {
      logger.error("[usePublishRequestActions] Reject error:", err);
    },
  });

  return {
    approveRequest: approveMutation.mutateAsync,
    rejectRequest: rejectMutation.mutateAsync,
    isApproving: approveMutation.isPending,
    isRejecting: rejectMutation.isPending,
  };
}
