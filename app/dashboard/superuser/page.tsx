"use client";

import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  RefreshCcw,
  Users as UsersIcon,
  FileText,
  ClipboardList,
  ShieldCheck,
  Building2,
} from "lucide-react";
import { RoleGuard } from "@/lib/guards";
import { UserRole } from "@/lib/types/roles";
import { useDIDsStats } from "@/lib/features/did/hooks/useDIDsStats";
import { useUsersStats } from "@/lib/features/users/hooks/useUsersStats";
import { usePublishRequestsStats } from "@/lib/features/publish-requests/hooks/usePublishRequestsStats";
import { useOrganizations } from "@/lib/features/super-admin/hooks/useOrganizations";
import { cn } from "@/lib/utils";

export default function SuperUserDashboardPage() {
  const router = useRouter();

  const { isLoading: isDIDLoading, refresh: refreshDIDs } = useDIDsStats();

  const { isLoading: isUsersLoading, refresh: refreshUsers } = useUsersStats();

  const { isLoading: isPubLoading, refresh: refreshPubs } = usePublishRequestsStats();

  const { isLoading: isOrgLoading, refresh: refreshOrgs } = useOrganizations();

  const isLoading = isDIDLoading || isUsersLoading || isPubLoading || isOrgLoading;

  const handleRefresh = () => {
    refreshDIDs();
    refreshUsers();
    refreshPubs();
    refreshOrgs();
  };

  return (
    <RoleGuard allowedRoles={[UserRole.SUPER_USER]}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center px-8 pt-6">
          <h1 className="text-3xl font-bold tracking-tight">System Administration</h1>
          <Button onClick={handleRefresh} variant="outline" size="sm" disabled={isLoading}>
            <RefreshCcw className={cn("mr-2 h-4 w-4", isLoading && "animate-spin")} />
            Refresh
          </Button>
        </div>

        <div className="px-8 space-y-6 pb-8">
          <div className="pt-4">
            <h2 className="text-xl font-bold mb-4">Management Dashboard</h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Card
                className="hover:shadow-lg transition-shadow cursor-pointer border-t-4 border-t-indigo-600"
                onClick={() => router.push("/dashboard/organizations")}
              >
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Building2 className="h-5 w-5 text-indigo-600" />
                    Manage Organizations
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Validate, monitor, and manage all registered organizations.
                  </p>
                  <Button className="w-full bg-indigo-600 hover:bg-indigo-700">
                    View Organizations
                  </Button>
                </CardContent>
              </Card>

              <Card
                className="hover:shadow-lg transition-shadow cursor-pointer border-t-4 border-t-blue-600"
                onClick={() => router.push("/dashboard/dids")}
              >
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <ShieldCheck className="h-5 w-5 text-blue-600" />
                    Global DIDs
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Overview and management of all decentralized identifiers.
                  </p>
                  <Button className="w-full bg-blue-600 hover:bg-blue-700">View All DIDs</Button>
                </CardContent>
              </Card>

              <Card
                className="hover:shadow-lg transition-shadow cursor-pointer border-t-4 border-t-[#0052CC]"
                onClick={() => router.push("/dashboard/users")}
              >
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <UsersIcon className="h-5 w-5 text-[#0052CC]" />
                    User Management
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Manage system users and their roles across the platform.
                  </p>
                  <Button className="w-full bg-[#0052CC] hover:bg-[#0747A6]">View All Users</Button>
                </CardContent>
              </Card>

              <Card
                className="hover:shadow-lg transition-shadow cursor-pointer border-t-4 border-t-yellow-600"
                onClick={() => router.push("/dashboard/publish-requests")}
              >
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <FileText className="h-5 w-5 text-yellow-600" />
                    Publish Requests
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Monitor publication requests across all organizations.
                  </p>
                  <Button className="w-full bg-yellow-600 hover:bg-yellow-700">
                    Review Requests
                  </Button>
                </CardContent>
              </Card>

              <Card
                className="hover:shadow-lg transition-shadow cursor-pointer border-t-4 border-t-purple-600"
                onClick={() => router.push("/dashboard/audit")}
              >
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <ClipboardList className="h-5 w-5 text-purple-600" />
                    System Audit
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Trace all system modifications and administrative actions.
                  </p>
                  <Button className="w-full bg-purple-600 hover:bg-purple-700">
                    View Audit Logs
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </RoleGuard>
  );
}
