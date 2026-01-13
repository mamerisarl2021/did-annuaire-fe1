"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus, RefreshCw } from "lucide-react";

import { useApplications } from "@/lib/features/applications/hooks/useApplications";
import { useApplicationActions } from "@/lib/features/applications/hooks/useApplicationActions";
import { ApplicationsTable } from "@/lib/features/applications/components/ApplicationsTable";
import { CreateApplicationDialog } from "@/lib/features/applications/components/CreateApplicationDialog";
import { OrganizationsPagination } from "@/lib/features/super-admin/components/OrganizationsPagination"; // Reusing pagination for now or should create a generic one? Reusing is fine if it's generic enough

export default function ApplicationsPage() {
    const { applications, isLoading, error, pagination, refresh, filters } = useApplications();
    const { createApplication, deleteApplication, isLoading: isActionLoading } = useApplicationActions();
    const [showCreate, setShowCreate] = useState(false);

    const totalPages = pagination ? Math.ceil(pagination.count / pagination.pageSize) : 1;
    const currentPage = pagination?.page || 1;

    const handleCreate = async (data: any) => {
        const success = await createApplication(data);
        if (success) {
            refresh();
            return true;
        }
        return false;
    };

    const handleDelete = async (id: string) => {
        // Ideally we should have a confirmation dialog here, similar to SuperAdmin
        // For now, let's just confirm with window.confirm or implement a quick dialog
        if (window.confirm("Are you sure you want to delete this application?")) {
            const success = await deleteApplication(id);
            if (success) {
                refresh();
            }
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold tracking-tight">Applications</h1>
                <Button onClick={refresh} variant="outline" disabled={isLoading}>
                    <RefreshCw className={`mr-2 size-4 ${isLoading ? "animate-spin" : ""}`} />
                    Refresh
                </Button>
            </div>

            {/* Content Card */}
            <Card>
                <CardContent className="pt-6">
                    <div className="flex items-center justify-between gap-4 mb-6">
                        <div className="relative flex-1 max-w-sm">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search applications..."
                                value={filters.search}
                                onChange={(e) => filters.setSearch(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                        <Button onClick={() => setShowCreate(true)}>
                            <Plus className="h-4 w-4 mr-2" />
                            Create Application
                        </Button>
                    </div>

                    {isLoading ? (
                        <div className="text-center py-10 text-muted-foreground">Loading...</div>
                    ) : error ? (
                        <div className="text-center py-10 text-destructive">{error}</div>
                    ) : (
                        <>
                            <ApplicationsTable
                                applications={applications}
                                onDelete={handleDelete}
                                isActionsDisabled={isActionLoading}
                            />

                            <div className="mt-4">
                                {/* Reusing existing pagination component if compatible, otherwise using a simple generic one */}
                                {/* Assuming OrganizationsPagination is somewhat generic or we can adapt locally */}
                                <OrganizationsPagination
                                    currentPage={currentPage}
                                    totalPages={totalPages}
                                    onPageChange={(page) => pagination.setPage(page)}
                                />
                            </div>
                        </>
                    )}
                </CardContent>
            </Card>

            <CreateApplicationDialog
                open={showCreate}
                onOpenChange={setShowCreate}
                onSubmit={handleCreate}
                isLoading={isActionLoading}
            />
        </div>
    );
}
