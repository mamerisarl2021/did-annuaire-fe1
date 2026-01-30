import { PublishRequest } from "../types/publish-request.types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle } from "lucide-react";

interface PublishRequestsTableProps {
  requests: PublishRequest[];
  isLoading: boolean;
  onApprove: (request: PublishRequest) => void;
  onReject: (request: PublishRequest) => void;
}

export function PublishRequestsTable({
  requests,
  isLoading,
  onApprove,
  onReject,
}: PublishRequestsTableProps) {
  if (isLoading) {
    return <div className="text-center py-10 text-muted-foreground">Loading...</div>;
  }

  if (requests.length === 0) {
    return (
      <div className="text-center py-10 text-muted-foreground">No publish requests found.</div>
    );
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING":
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
            Pending
          </Badge>
        );
      case "APPROVED":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            Approved
          </Badge>
        );
      case "REJECTED":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            Rejected
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="rounded-md border">
      <table className="w-full">
        <thead className="bg-muted/50">
          <tr className="border-b">
            <th className="px-4 py-3 text-left text-sm font-medium">DID</th>
            <th className="px-4 py-3 text-left text-sm font-medium">Version</th>
            <th className="px-4 py-3 text-left text-sm font-medium">Environment</th>
            <th className="px-4 py-3 text-left text-sm font-medium">Status</th>
            <th className="px-4 py-3 text-left text-sm font-medium">Requested By</th>
            <th className="px-4 py-3 text-left text-sm font-medium">Requested</th>
            <th className="px-4 py-3 text-right text-sm font-medium">Actions</th>
          </tr>
        </thead>
        <tbody>
          {requests.map((request) => (
            <tr key={request.id} className="border-b hover:bg-muted/30">
              <td className="px-4 py-3 text-sm font-mono">{request.did}</td>
              <td className="px-4 py-3 text-sm">v{request.version}</td>
              <td className="px-4 py-3 text-sm">
                <Badge variant="secondary">{request.environment}</Badge>
              </td>
              <td className="px-4 py-3 text-sm">{getStatusBadge(request.status)}</td>
              <td className="px-4 py-3 text-sm">{request.requested_by}</td>
              <td className="px-4 py-3 text-sm text-muted-foreground">
                {request.decided_at
                  ? new Date(request.decided_at).toISOString().split("T")[0]
                  : "N/A"}
              </td>
              <td className="px-4 py-3 text-sm text-right">
                {request.status === "PENDING" && (
                  <div className="flex justify-end gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-green-600 border-green-200 hover:bg-green-50"
                      onClick={() => onApprove(request)}
                    >
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-red-600 border-red-200 hover:bg-red-50"
                      onClick={() => onReject(request)}
                    >
                      <XCircle className="h-4 w-4 mr-1" />
                      Reject
                    </Button>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
