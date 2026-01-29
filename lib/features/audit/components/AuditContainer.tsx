"use client";

import { useAuditData } from "../hooks/useAuditData";
import { useAuditFilters } from "../hooks/useAuditFilters";
import { useAuditDetails } from "../hooks/useAuditDetails";
import { useAuth } from "@/lib/features/auth/hooks/useAuth";
import { AuditStatsCards } from "./AuditStatsCards";
import { AuditFilters } from "./AuditFilters";
import { AuditTable } from "./AuditTable";
import { AuditPagination } from "./AuditPagination";
import { AuditDetailsModal } from "./AuditDetailsModal";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

export function AuditContainer() {
  const { user } = useAuth();
  const { filters, setQ, setCategory, setSeverity, offset, limit, setOffset } = useAuditFilters();

  const { logs, stats, totalCount, isLoading, error, refresh } = useAuditData({
    ...filters,
    userRole: user?.role,
    organization_id: user?.role === "SUPER_USER" ? filters.organization_id : user?.organization_id,
  });

  const {
    selectedAudit,
    isLoading: isDetailsLoading,
    fetchDetails,
    clearDetails,
  } = useAuditDetails();

  const currentPage = Math.floor(offset / limit) + 1;
  const totalPages = Math.ceil(totalCount / limit);

  const handlePageChange = (page: number) => {
    setOffset((page - 1) * limit);
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[#172b4d]">Audit Logs</h1>
          <p className="text-muted-foreground mt-1">
            Track and monitor all administrative actions and system events.
          </p>
        </div>
        <Button
          onClick={() => refresh()}
          variant="outline"
          disabled={isLoading}
          className="border-[#dfe1e6] text-[#172b4d]"
        >
          <RefreshCw className={`mr-2 size-4 ${isLoading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      {/* Stats Section */}
      <AuditStatsCards
        stats={stats}
        totalCount={totalCount}
        activeCategory={filters.category}
        onCategoryClick={(cat) => setCategory(cat || "all")}
      />

      {/* Content Section */}
      <Card className="border-[#dfe1e6]">
        <CardContent className="pt-6">
          {/* Filters */}
          <AuditFilters
            search={filters.q || ""}
            onSearchChange={setQ}
            category={filters.category || "all"}
            onCategoryChange={setCategory}
            severity={filters.severity || "all"}
            onSeverityChange={setSeverity}
            totalCount={totalCount}
            // organization_id filter could be added here if isSuperuser
          />

          {/* Error Message */}
          {error && (
            <div className="bg-destructive/10 text-destructive p-4 rounded-md mb-6 border border-destructive/20 text-sm">
              Error fetching audit logs: {error}
            </div>
          )}

          {/* Table */}
          <AuditTable
            logs={logs}
            isLoading={isLoading}
            onRowClick={(log) => fetchDetails(log.id)}
          />

          {/* Pagination */}
          {!isLoading && totalPages > 1 && (
            <AuditPagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </CardContent>
      </Card>

      {/* Details Modal */}
      <AuditDetailsModal
        audit={selectedAudit}
        isOpen={!!selectedAudit || isDetailsLoading}
        onClose={clearDetails}
        isLoading={isDetailsLoading}
      />
    </div>
  );
}
