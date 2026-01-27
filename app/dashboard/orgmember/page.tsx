"use client";

import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Search, RefreshCcw } from "lucide-react";
import { RoleGuard } from "@/lib/guards";
import { UserRole } from "@/lib/types/roles";
import { useDIDsStats } from "@/lib/features/did/hooks/useDIDsStats";
import { DIDStatsCards } from "@/lib/features/did/components/DIDStatsCards";
import { cn } from "@/lib/utils";

export default function OrgMemberDashboard() {
  const router = useRouter();
  const { stats, isLoading, error, refresh } = useDIDsStats();

  return (
    <RoleGuard allowedRoles={[UserRole.ORG_MEMBER]}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center px-8 pt-6">
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <Button onClick={refresh} variant="outline" size="sm" disabled={isLoading}>
            <RefreshCcw className={cn("mr-2 h-4 w-4", isLoading && "animate-spin")} />
            Refresh
          </Button>
        </div>

        <div className="px-8 space-y-6 pb-8">
          {/* Stats Cards */}
          {!isLoading && stats && <DIDStatsCards stats={stats} />}

          {error && (
            <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-lg text-sm">
              Unable to load statistics: {error}
            </div>
          )}

          {/* Quick Actions */}
          <div className="grid gap-4 md:grid-cols-2">
            <Card
              className="hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => router.push("/dashboard/dids")}
            >
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="h-5 w-5 text-blue-600" />
                  Manage DIDs
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Create, publish, and manage your decentralized identifiers.
                </p>
                <Button className="w-full bg-blue-600 hover:bg-blue-700">Go to DIDs</Button>
              </CardContent>
            </Card>

            <Card
              className="hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => router.push("/dashboard/dids/resolve")}
            >
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Search className="h-5 w-5 text-green-600" />
                  Resolve DIDs
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Verify and resolve decentralized identifiers from any organization.
                </p>
                <Button className="w-full bg-green-600 hover:bg-green-700">Go to Resolver</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </RoleGuard>
  );
}
