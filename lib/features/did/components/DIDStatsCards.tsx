import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { type DIDStats } from "../types";
import { Hash, CheckCircle, XCircle } from "lucide-react";

interface DIDStatsCardsProps {
  stats: DIDStats;
}

export function DIDStatsCards({ stats }: DIDStatsCardsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total DIDs</CardTitle>
          <Hash className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-[#0052CC]">{stats.total}</div>
          <p className="text-xs text-muted-foreground">All identifiers</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active</CardTitle>
          <CheckCircle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">{stats.published}</div>
          <p className="text-xs text-muted-foreground">Live in production</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Deactivated</CardTitle>
          <XCircle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-gray-500">{stats.deactivated}</div>
          <p className="text-xs text-muted-foreground">Archived</p>
        </CardContent>
      </Card>
    </div>
  );
}
