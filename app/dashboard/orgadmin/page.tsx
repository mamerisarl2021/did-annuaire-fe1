"use client";

import { useState, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCcw } from "lucide-react";
import { useOrganizations } from "@/lib/features/organizations/hooks/useOrganizations";

import { StatsCardsRow } from "@/lib/features/super-admin/components/StatsCardsRow";
import { OrganizationsTable } from "@/lib/features/super-admin/components/OrganizationsTable";
import { OrganizationDetailsDialog } from "@/lib/features/super-admin/components/OrganizationDetailsDialog";
import { OrganizationFilters } from "@/lib/features/super-admin/components/OrganizationFilters";
import { OrganizationsPagination } from "@/lib/features/super-admin/components/OrganizationsPagination";

import { type OrganizationListItem } from "@/lib/features/organizations/types/organization.types";
import { cn } from "@/lib/utils";

export default function OrgAdminDashboard() {
  const {
    organizations,
    isLoading,
    error,
    stats,
    totalCount,
    pagination,
    filters,
    setPage,
    setPageSize,
    setStatusFilter,
    setSearch,
    refresh,
  } = useOrganizations();

  const [selectedOrg, setSelectedOrg] = useState<any>(null);
  const [showDetails, setShowDetails] = useState(false);

  const openDetailsDialog = useCallback((org: any) => {
    setSelectedOrg(org);
    setShowDetails(true);
  }, []);

  const handleStatusChange = useCallback((val: string | undefined) => {
    setStatusFilter((val || "all") as any);
    setPage(1);
  }, [setStatusFilter, setPage]);

  // Map stats to the format expected by StatsCardsRow
  const mappedStats = stats ? {
    all: stats.all,
    active: stats.active,
    suspended: stats.suspended,
    pending: 0,
    refused: 0
  } : null;

  const totalPages = pagination ? Math.ceil(totalCount / pagination.pageSize) : 1;

  return (
    <div className="space-y-6">
      {/* Header - EXACT SAME STYLE */}
      <div className="flex justify-between items-center px-8 pt-6">
        <h1 className="text-3xl font-bold tracking-tight">Overview</h1>
        <Button onClick={() => refresh()} variant="outline" size="sm" disabled={isLoading}>
          <RefreshCcw className={cn("mr-2 h-4 w-4", isLoading && "animate-spin")} />
          Refresh
        </Button>
      </div>

      <div className="px-8 space-y-6 pb-8">
        {/* Stats Row - SAME COMPONENT with filtered visibility */}
        <StatsCardsRow
          stats={mappedStats as any}
          activeStatus={filters.status}
          onStatusClick={handleStatusChange}
          visibleStatuses={["all", "ACTIVE", "SUSPENDED"]}
        />

        {/* Content Card - SAME COMPONENT REUSE */}
        <Card>
          <CardContent className="pt-6">
            <OrganizationFilters
              search={filters.search}
              onSearchChange={setSearch}
              status={filters.status as any}
              onStatusChange={handleStatusChange}
              totalCount={totalCount}
            />

            {isLoading ? (
              <div className="text-center py-10 text-muted-foreground">Loading...</div>
            ) : error ? (
              <div className="text-center py-10 text-destructive">{error}</div>
            ) : (
              <>
                <OrganizationsTable
                  organizations={organizations as any}
                  onRowClick={openDetailsDialog}
                  onView={openDetailsDialog}
                  // Org Admins don't have these powers, pass no-ops
                  onValidate={() => { }}
                  onRefuse={() => { }}
                  onToggle={() => { }}
                  onDelete={() => { }}
                  isActionsDisabled={true}
                />

                <OrganizationsPagination
                  currentPage={pagination.page}
                  totalPages={totalPages}
                  onPageChange={setPage}
                />
              </>
            )}
          </CardContent>
        </Card>
      </div>

      <OrganizationDetailsDialog
        organization={selectedOrg}
        open={showDetails}
        onOpenChange={setShowDetails}
        onValidate={() => { }}
        onRefuse={() => { }}
        isActionsDisabled={true}
      />
    </div>
  );
}
