"use client";

import { useState } from "react";
import { RoleGuard } from "@/lib/guards";
import { UserRole } from "@/lib/types/roles";
import { useAuth } from "@/lib/features/auth/hooks/useAuth";
import { usePublishRequests } from "@/lib/features/publish-requests/hooks/usePublishRequests";
import { usePublishRequestsStats } from "@/lib/features/publish-requests/hooks/usePublishRequestsStats";
import { usePublishRequestActions } from "@/lib/features/publish-requests/hooks/usePublishRequestActions";
import { PublishRequestStatsCards } from "@/lib/features/publish-requests/components/PublishRequestStatsCards";
import { PublishRequestFilters } from "@/lib/features/publish-requests/components/PublishRequestFilters";
import { PublishRequestsTable } from "@/lib/features/publish-requests/components/PublishRequestsTable";
import { ApproveModal } from "@/lib/features/publish-requests/components/ApproveModal";
import { RejectModal } from "@/lib/features/publish-requests/components/RejectModal";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCcw } from "lucide-react";
import { PublishRequest } from "@/lib/features/publish-requests/types/publish-request.types";
import { cn } from "@/lib/utils";

export default function PublishRequestsPage() {
  const { user } = useAuth();
  const org_id = user?.organization_id;

  const {
    stats,
    isLoading: isStatsLoading,
    error: statsError,
    refresh: refreshStats,
  } = usePublishRequestsStats(org_id);

  const {
    requests,
    isLoading,
    error,
    statusFilter,
    setStatusFilter,
    searchQuery,
    setSearchQuery,
    refresh,
  } = usePublishRequests(org_id);

  const { approveRequest, rejectRequest } = usePublishRequestActions(org_id);

  const [selectedRequest, setSelectedRequest] = useState<PublishRequest | null>(null);
  const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);

  /* ---------- Actions ---------- */

  const handleApprove = (request: PublishRequest) => {
    setSelectedRequest(request);
    setIsApproveModalOpen(true);
  };

  const handleReject = (request: PublishRequest) => {
    setSelectedRequest(request);
    setIsRejectModalOpen(true);
  };

  const handleConfirmApprove = async (note?: string) => {
    if (!selectedRequest) return;

    try {
      await approveRequest({
        id: selectedRequest.id,
        payload: { note },
      });

      refresh();
      refreshStats();
    } catch (error) {
      throw error;
    }
  };

  const handleConfirmReject = async (note?: string) => {
    if (!selectedRequest) return;

    try {
      await rejectRequest({
        id: selectedRequest.id,
        payload: { note },
      });

      refresh();
      refreshStats();
    } catch (error) {
      // Idem : feedback géré dans RejectModal
      throw error;
    }
  };

  const handleRefresh = () => {
    refresh();
    refreshStats();
  };

  /* ---------- Render ---------- */

  return (
    <RoleGuard allowedRoles={[UserRole.SUPER_USER, UserRole.ORG_ADMIN]}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center px-8 pt-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Publish Requests</h1>
            <p className="text-muted-foreground mt-1">
              Review and approve DID publication requests.
            </p>
          </div>

          <Button
            onClick={handleRefresh}
            variant="outline"
            size="sm"
            disabled={isLoading}
          >
            <RefreshCcw
              className={cn("mr-2 h-4 w-4", isLoading && "animate-spin")}
            />
            Refresh
          </Button>
        </div>

        <div className="px-8 space-y-6 pb-8">
          {/* Stats */}
          {!isStatsLoading && stats && (
            <PublishRequestStatsCards stats={stats} />
          )}

          {statsError && (
            <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-lg text-sm">
              Unable to load statistics: {statsError}
            </div>
          )}

          {/* Table */}
          <Card>
            <CardContent className="pt-6">
              <PublishRequestFilters
                search={searchQuery}
                onSearchChange={setSearchQuery}
                status={statusFilter}
                onStatusChange={setStatusFilter}
              />

              {error && (
                <div className="bg-destructive/10 text-destructive p-4 rounded-md mb-6 border border-destructive/20 text-sm">
                  Error: {error}
                </div>
              )}

              <PublishRequestsTable
                requests={requests}
                isLoading={isLoading}
                onApprove={handleApprove}
                onReject={handleReject}
              />
            </CardContent>
          </Card>
        </div>

        {/* Modals */}
        <ApproveModal
          key={selectedRequest?.id}
          isOpen={isApproveModalOpen}
          request={selectedRequest}
          onConfirm={handleConfirmApprove}
          onClose={() => {
            setIsApproveModalOpen(false);
            setSelectedRequest(null);
          }}
        />

        <RejectModal
          key={selectedRequest?.id}
          isOpen={isRejectModalOpen}
          request={selectedRequest}
          onConfirm={handleConfirmReject}
          onClose={() => {
            setIsRejectModalOpen(false);
            setSelectedRequest(null);
          }}
        />
      </div>
    </RoleGuard>
  );
}
