"use client";

import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCcw, ShieldCheck, Search, ClipboardList } from "lucide-react";
import { RoleGuard } from "@/lib/guards";
import { UserRole, UserRoleType } from "@/lib/types/roles";
import { useDIDsStats } from "@/lib/features/did/hooks/useDIDsStats";
import { useAuth } from "@/lib/features/auth/hooks/useAuth";
import { cn } from "@/lib/utils";

export default function OrgMemberDashboard() {
  const router = useRouter();
  const { user } = useAuth();
  const { isLoading, refresh } = useDIDsStats();

  const userRoles = Array.isArray(user?.roles) ? user?.roles : [];
  const isAuditor =
    userRoles.includes(UserRole.AUDITOR as UserRoleType) || user?.role === UserRole.AUDITOR;

  return (
    <RoleGuard allowedRoles={[UserRole.ORG_MEMBER, UserRole.AUDITOR]}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center px-8 pt-6">
          <h1 className="text-3xl font-bold tracking-tight">Dashboard Overview</h1>
          <Button onClick={() => refresh()} variant="outline" size="sm" disabled={isLoading}>
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
                    Create, publish, and manage your decentralized identifiers.
                  </p>
                  <Button className="w-full bg-blue-600 hover:bg-blue-700">Go to DIDs</Button>
                </CardContent>
              </Card>

              <Card
                className="hover:shadow-lg transition-shadow cursor-pointer border-t-4 border-t-green-600"
                onClick={() => router.push("/dashboard/dids/resolve")}
              >
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
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

              {isAuditor && (
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
              )}
            </div>
          </div>
        </div>
      </div>
    </RoleGuard>
  );
}
