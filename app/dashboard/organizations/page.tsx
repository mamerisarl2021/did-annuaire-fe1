"use client";

import { useState, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw, Plus } from "lucide-react";
import Link from "next/link";

import { useOrganizations } from "@/lib/features/super-admin/hooks/useOrganizations";
import { useOrganizationActions } from "@/lib/features/super-admin/hooks/useOrganizationActions";
import { StatsCardsRow } from "@/lib/features/organizations/components/StatsCardsRow";
import { OrganizationFilters } from "@/lib/features/organizations/components/OrganizationFilters";
import { OrganizationsTable } from "@/lib/features/organizations/components/OrganizationsTable";
import { OrganizationsPagination } from "@/lib/features/organizations/components/OrganizationsPagination";
import { OrganizationDetailsDialog } from "@/lib/features/organizations/components/OrganizationDetailsDialog";
import { RefuseOrganizationDialog } from "@/lib/features/super-admin/components/RefuseOrganizationDialog";
import { DeleteOrganizationDialog } from "@/lib/features/super-admin/components/DeleteOrganizationDialog";
import {
  type OrganizationListItem,
  type OrganizationStatus,
} from "@/lib/features/organizations/types/organization.types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { AlertCircle } from "lucide-react";

export default function OrganizationsPage() {
  // Data fetching
  const { organizations, stats, pagination, error, isLoading, refresh, filters } =
    useOrganizations();

  // Actions
  const actions = useOrganizationActions();

  // UI State - Dialog management
  const [selectedOrg, setSelectedOrg] = useState<OrganizationListItem | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showRefuse, setShowRefuse] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [errorDetails, setErrorDetails] = useState<string | null>(null);

  // Derived state
  const currentStatus = filters.status || "all";
  const totalPages = pagination ? Math.ceil(pagination.count / pagination.pageSize) : 1;
  const currentPage = pagination?.page || 1;

  // Handlers
  const handleStatusChange = useCallback(
    (newStatus: string | undefined) => {
      filters.setStatus(newStatus as OrganizationStatus | undefined);
      filters.setSearch("");
      pagination?.setPage(1);
    },
    [filters, pagination]
  );

  const handleValidate = useCallback(
    async (orgId: string) => {
      const success = await actions.validateOrganization(orgId);
      if (success) {
        setShowDetails(false);
        refresh();
      }
    },
    [actions, refresh]
  );

  const handleRefuse = useCallback(
    async (reason: string) => {
      if (!selectedOrg) return;
      const success = await actions.refuseOrganization(selectedOrg.id, reason);
      if (success) {
        setShowRefuse(false);
        setShowDetails(false);
        setSelectedOrg(null);
        refresh();
      }
    },
    [selectedOrg, actions, refresh]
  );

  const handleToggle = useCallback(
    async (orgId: string) => {
      const success = await actions.toggleOrganizationStatus(orgId);
      if (success) {
        refresh();
      }
    },
    [actions, refresh]
  );

  const handleDelete = useCallback(async () => {
    if (!selectedOrg) return;
    const success = await actions.deleteOrganization(selectedOrg.id);
    if (success) {
      setShowDelete(false);
      setSelectedOrg(null);
      refresh();
    }
  }, [selectedOrg, actions, refresh]);

  const handlePageChange = useCallback(
    (newPage: number) => {
      if (newPage >= 1 && newPage <= totalPages) {
        pagination?.setPage(newPage);
      }
    },
    [pagination, totalPages]
  );

  const openDetailsDialog = useCallback(
    async (org: OrganizationListItem) => {
      setSelectedOrg(org);
      setShowDetails(true);
      try {
        const fullOrg = await actions.getOrganizationDetails(org.id);
        if (fullOrg) {
          setSelectedOrg(fullOrg);
        }
      } catch (error) {
        setErrorDetails(`Failed to fetch organization details: ${error}`);
      }
    },
    [actions]
  );

  const openRefuseDialog = useCallback((org: OrganizationListItem) => {
    setSelectedOrg(org);
    setShowRefuse(true);
  }, []);

  const openDeleteDialog = useCallback((org: OrganizationListItem) => {
    setSelectedOrg(org);
    setShowDelete(true);
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Overview</h1>
        <div className="flex items-center space-x-2">
          <Button onClick={() => refresh()} variant="outline" size="sm" disabled={isLoading}>
            <RefreshCw className={`mr-2 size-4 ${isLoading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <Link href="/auth/register">
            <Button size="sm" className="h-9 shadow-sm">
              <Plus className="mr-2 h-4 w-4" />
              New Organization
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <StatsCardsRow
        stats={stats}
        activeStatus={currentStatus}
        onStatusClick={handleStatusChange}
      />

      {/* Content Card */}
      <Card>
        <CardContent className="pt-6">
          {/* Filters */}
          <OrganizationFilters
            search={filters.search}
            onSearchChange={filters.setSearch}
            status={currentStatus as OrganizationStatus | "all"}
            onStatusChange={(v) => handleStatusChange(v === "all" ? undefined : v)}
            totalCount={pagination?.count || 0}
          />

          {/* Content */}
          {isLoading ? (
            <div className="text-center py-10 text-muted-foreground">Loading...</div>
          ) : error ? (
            <div className="text-center py-10 text-destructive">{error}</div>
          ) : (
            <>
              <OrganizationsTable
                organizations={organizations}
                onRowClick={openDetailsDialog}
                onView={openDetailsDialog}
                onValidate={handleValidate}
                onRefuse={openRefuseDialog}
                onToggle={handleToggle}
                onDelete={openDeleteDialog}
                isActionsDisabled={actions.isLoading}
              />

              <OrganizationsPagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </>
          )}
        </CardContent>
      </Card>

      {/* Dialogs */}
      <OrganizationDetailsDialog
        organization={selectedOrg}
        open={showDetails}
        onOpenChange={setShowDetails}
        onValidate={handleValidate}
        onRefuse={() => {
          setShowDetails(false);
          setShowRefuse(true);
        }}
        isActionsDisabled={actions.isLoading}
      />

      <RefuseOrganizationDialog
        organizationName={selectedOrg?.name}
        open={showRefuse}
        onOpenChange={setShowRefuse}
        onConfirm={handleRefuse}
        isLoading={actions.isLoading}
      />

      <DeleteOrganizationDialog
        organizationName={selectedOrg?.name}
        open={showDelete}
        onOpenChange={setShowDelete}
        onConfirm={handleDelete}
        isLoading={actions.isLoading}
      />

      <Dialog open={!!errorDetails} onOpenChange={() => setErrorDetails(null)}>
        <DialogContent className="w-full max-w-sm">
          <DialogHeader className="flex flex-col items-center justify-center text-center">
            <div className="bg-red-100 p-3 rounded-full mb-4">
              <AlertCircle className="h-6 w-6 text-red-600" />
            </div>
            <DialogTitle className="text-center">Error</DialogTitle>
            <DialogDescription className="text-center pt-2">{errorDetails}</DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-center pt-4">
            <Button onClick={() => setErrorDetails(null)} className="bg-red-600 hover:bg-red-700">
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
