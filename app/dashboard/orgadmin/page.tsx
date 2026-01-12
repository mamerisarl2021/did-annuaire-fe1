import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function OrgAdminDashboard() {
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold tracking-tight">Organization Dashboard</h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle>Statut</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-green-600 font-bold">Actif</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
