"use client";

import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCcw, Users as UsersIcon, FileText, ClipboardList, ShieldCheck } from "lucide-react";
import { RoleGuard } from "@/lib/guards";
import { UserRole } from "@/lib/types/roles";
import { useDIDsStats } from "@/lib/features/did/hooks/useDIDsStats";
import { useUsersStats } from "@/lib/features/users/hooks/useUsersStats";
import { usePublishRequestsStats } from "@/lib/features/publish-requests/hooks/usePublishRequestsStats";
import { useAuth } from "@/lib/features/auth/hooks/useAuth";
import { cn } from "@/lib/utils";

export default function OrgAdminDashboard() {
  const router = useRouter();
  const { user } = useAuth();

  const { isLoading: isDIDLoading, refresh: refreshDIDs } = useDIDsStats();

  const { isLoading: isUsersLoading, refresh: refreshUsers } = useUsersStats();

  const { isLoading: isPubLoading, refresh: refreshPubs } = usePublishRequestsStats(
    user?.organization_id
  );

  const isLoading = isDIDLoading || isUsersLoading || isPubLoading;

  const handleRefresh = () => {
    refreshDIDs();
    refreshUsers();
    refreshPubs();
  };

  return (
    <RoleGuard allowedRoles={[UserRole.ORG_ADMIN]}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center px-8 pt-6">
          <h1 className="text-3xl font-bold tracking-tight">Dashboard Overview</h1>
          <Button onClick={handleRefresh} variant="outline" size="sm" disabled={isLoading}>
            <RefreshCcw className={cn("mr-2 h-4 w-4", isLoading && "animate-spin")} />
            Refresh
          </Button>
        </div>
        <div className="px-8 space-y-6 pb-8">
          <div className="pt-4">
            <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card
                className="hover:shadow-lg transition-shadow cursor-pointer border-t-4 border-t-blue-600"
                onClick={() => router.push("/dashboard/dids")}
              >
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <ShieldCheck className="h-5 w-5 text-blue-600" />
                    Manage DIDs
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Create and publish decentralized identifiers.
                  </p>
                  <Button className="w-full bg-blue-600 hover:bg-blue-700">Go to DIDs</Button>
                </CardContent>
              </Card>

              <Card
                className="hover:shadow-lg transition-shadow cursor-pointer border-t-4 border-t-[#0052CC]"
                onClick={() => router.push("/dashboard/users")}
              >
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <UsersIcon className="h-5 w-5 text-[#0052CC]" />
                    Manage Users
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Invite and manage organization members.
                  </p>
                  <Button className="w-full bg-[#0052CC] hover:bg-[#0747A6]">Go to Users</Button>
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
                    Review and approve publication requests.
                  </p>
                  <Button className="w-full bg-yellow-600 hover:bg-yellow-700">Review Now</Button>
                </CardContent>
              </Card>

              <Card
                className="hover:shadow-lg transition-shadow cursor-pointer border-t-4 border-t-purple-600"
                onClick={() => router.push("/dashboard/audit")}
              >
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <ClipboardList className="h-5 w-5 text-purple-600" />
                    Audit Logs
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Monitor system activities and history.
                  </p>
                  <Button className="w-full bg-purple-600 hover:bg-purple-700">View Logs</Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </RoleGuard>
  );
}
