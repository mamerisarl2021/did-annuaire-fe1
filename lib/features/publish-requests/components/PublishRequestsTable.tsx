import { PublishRequest } from "../types/publish-request.types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { truncateDID } from "@/lib/features/did/utils/didFormatter";

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
    <div className="rounded-md border overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead className="px-4 py-3 text-left text-sm font-medium">DID</TableHead>
              <TableHead className="px-4 py-3 text-left text-sm font-medium">Version</TableHead>
              <TableHead className="px-4 py-3 text-left text-sm font-medium">Environment</TableHead>
              <TableHead className="px-4 py-3 text-left text-sm font-medium">Status</TableHead>
              <TableHead className="px-4 py-3 text-left text-sm font-medium">Requested By</TableHead>
              <TableHead className="px-4 py-3 text-left text-sm font-medium">Requested</TableHead>
              <TableHead className="px-4 py-3 text-left text-sm font-medium">Note</TableHead>
              <TableHead className="px-4 py-3 text-right text-sm font-medium">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {requests.map((request) => (
              <TableRow key={request.id} className="hover:bg-muted/30 transition-colors">
                <TableCell className="px-4 py-3 text-sm font-mono">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span className="cursor-help">{truncateDID(request.did)}</span>
                      </TooltipTrigger>
                      <TooltipContent className="max-w-md break-all">
                        <p className="font-mono text-xs text-white">{request.did}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </TableCell>
                <TableCell className="px-4 py-3 text-sm">v{request.version}</TableCell>
                <TableCell className="px-4 py-3 text-sm">
                  <Badge variant="secondary">{request.environment}</Badge>
                </TableCell>
                <TableCell className="px-4 py-3 text-sm">{getStatusBadge(request.status)}</TableCell>
                <TableCell className="px-4 py-3 text-sm">{request.requested_by}</TableCell>
                <TableCell className="px-4 py-3 text-sm text-muted-foreground">
                  {request.decided_at
                    ? new Date(request.decided_at).toISOString().split("T")[0]
                    : "N/A"}
                </TableCell>
                <TableCell className="px-4 py-3 text-sm">
                  <div className="max-w-[200px] truncate" title={request.note || ""}>
                    {request.note || "—"}
                  </div>
                </TableCell>
                <TableCell className="px-4 py-3 text-sm text-right">
                  {request.status === "PENDING" && (
                    <div className="flex justify-end gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-green-600 border-green-200 hover:bg-green-50 px-2 lg:px-3"
                        onClick={() => onApprove(request)}
                      >
                        <CheckCircle className="h-4 w-4 lg:mr-1" />
                        <span className="hidden lg:inline text-[11px] font-bold">Approve</span>
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-red-600 border-red-200 hover:bg-red-50 px-2 lg:px-3"
                        onClick={() => onReject(request)}
                      >
                        <XCircle className="h-4 w-4 lg:mr-1" />
                        <span className="hidden lg:inline text-[11px] font-bold">Reject</span>
                      </Button>
                    </div>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

