"use client";

import { useState } from "react";
import { useOrganizations } from "@/lib/features/organizations/hooks/useOrganizations";
import { OrganizationStats } from "@/lib/features/organizations/components/OrganizationStats";
import { OrganizationsTable } from "@/lib/features/organizations/components/OrganizationsTable";
import { OrganizationDetailsDialog } from "@/lib/features/organizations/components/OrganizationDetailsDialog";
import { Input } from "@/components/ui/input";
import {
    Search,
    Plus,
    RefreshCcw,
    ChevronLeft,
    ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { type OrganizationListItem } from "@/lib/features/organizations/types/organization.types";
import { type OrganizationStatusType } from "@/lib/types/organization-status";
import { organizationService } from "@/lib/features/organizations/services/organization.service";
import { cn } from "@/lib/utils";

export default function OrgAdminOrganizationsPage() {
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

    const [selectedOrg, setSelectedOrg] = useState<OrganizationListItem | null>(null);
    const [showDetails, setShowDetails] = useState(false);
    const [isFetchingDetails, setIsFetchingDetails] = useState(false);

    const openDetailsDialog = async (org: OrganizationListItem) => {
        setSelectedOrg(org);
        setShowDetails(true);
        setIsFetchingDetails(true);
        try {
            const fullOrg = await organizationService.getOrganizationDetails(org.id);
            if (fullOrg) {
                setSelectedOrg(fullOrg);
            }
        } catch (err) {
            console.error("Failed to fetch organization details:", err);
        } finally {
            setIsFetchingDetails(false);
        }
    };

    return (
        <div className="flex-1 space-y-8 p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Organizations</h2>
                    <p className="text-muted-foreground">
                        Manage and monitor your sub-organizations and their status.
                    </p>
                </div>
                <div className="flex items-center space-x-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => refresh()}
                        disabled={isLoading}
                        className="hidden h-9 md:flex"
                    >
                        <RefreshCcw className={cn("mr-2 h-4 w-4", isLoading && "animate-spin")} />
                        Refresh
                    </Button>
                    <Button size="sm" className="h-9 shadow-sm">
                        <Plus className="mr-2 h-4 w-4" />
                        New Organization
                    </Button>
                </div>
            </div>

            {/* Stats Cards */}
            <OrganizationStats
                stats={stats}
                activeFilter={filters.status}
                onFilterChange={setStatusFilter}
                isLoading={isLoading}
            />

            {/* Main Content */}
            <div className="space-y-4">
                {/* Filters Bar */}
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div className="flex flex-1 items-center space-x-2">
                        <div className="relative w-full md:max-w-xs">
                            <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                placeholder="Search by name or slug..."
                                className="pl-9"
                                value={filters.search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                        <Select
                            value={filters.status}
                            onValueChange={(val) => setStatusFilter(val as any)}
                        >
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="All Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Status</SelectItem>
                                <SelectItem value="ACTIVE">Active</SelectItem>
                                <SelectItem value="SUSPENDED">Suspended</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <span>Showing {organizations.length} organizations of {totalCount}</span>
                    </div>
                </div>

                {/* Error State */}
                {error && (
                    <div className="rounded-md border border-red-200 bg-red-50 p-4 text-red-700">
                        <p className="text-sm font-medium">{error}</p>
                    </div>
                )}

                {/* Organizations Table */}
                <OrganizationsTable
                    organizations={organizations}
                    onViewDetails={openDetailsDialog}
                    isLoading={isLoading}
                />

                {/* Pagination Controls */}
                <div className="flex items-center justify-between border-t border-gray-100 px-2 py-4">
                    <div className="flex items-center space-x-2">
                        <span className="text-sm text-muted-foreground">Rows per page</span>
                        <Select
                            value={pagination.pageSize.toString()}
                            onValueChange={(v) => setPageSize(parseInt(v))}
                        >
                            <SelectTrigger className="h-8 w-[70px]">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="10">10</SelectItem>
                                <SelectItem value="20">20</SelectItem>
                                <SelectItem value="50">50</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="flex items-center space-x-4">
                        <div className="flex items-center justify-center text-sm font-medium">
                            Page {pagination.page} of {pagination.totalPages || 1}
                        </div>
                        <div className="flex items-center space-x-2">
                            <Button
                                variant="outline"
                                className="h-8 w-8 p-0"
                                onClick={() => setPage(pagination.page - 1)}
                                disabled={pagination.page <= 1 || isLoading}
                            >
                                <ChevronLeft className="h-4 w-4" />
                                <span className="sr-only">Previous Page</span>
                            </Button>
                            <Button
                                variant="outline"
                                className="h-8 w-8 p-0"
                                onClick={() => setPage(pagination.page + 1)}
                                disabled={pagination.page >= pagination.totalPages || isLoading}
                            >
                                <ChevronRight className="h-4 w-4" />
                                <span className="sr-only">Next Page</span>
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Details Dialog */}
            <OrganizationDetailsDialog
                organization={selectedOrg}
                isOpen={showDetails}
                onClose={() => setShowDetails(false)}
            />
        </div>
    );
}
