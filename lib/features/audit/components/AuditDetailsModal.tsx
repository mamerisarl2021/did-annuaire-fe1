"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { SeverityBadge } from "./SeverityBadge";
import { type AuditAction } from "../types/audit.types";

interface AuditDetailsModalProps {
  audit: AuditAction | null;
  isOpen: boolean;
  onClose: () => void;
  isLoading?: boolean;
}

export function AuditDetailsModal({ audit, isOpen, onClose, isLoading }: AuditDetailsModalProps) {
  if (!audit && !isLoading) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-full max-w-sm">
        <DialogHeader>
          <div className="flex items-center justify-between mr-4">
            <DialogTitle>Audit Action Details</DialogTitle>
            {audit && <SeverityBadge severity={audit.severity} />}
          </div>
          <DialogDescription>
            ID: {audit?.id || "Loading..."} • {audit?.action}
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-xs text-muted-foreground">Timestamp</Label>
                <div className="font-medium text-sm">
                  {new Date(audit!.timestamp).toISOString()}
                </div>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Category</Label>
                <div className="font-medium text-sm">{audit!.category}</div>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">User</Label>
                <div className="font-medium text-sm">{audit!.user || "System"}</div>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Organization</Label>
                <div className="font-medium text-sm">{audit!.organization || "-"}</div>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">IP Address</Label>
                <div className="font-medium text-sm">{audit!.ip || "N/A"}</div>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Request ID</Label>
                <div className="font-medium text-sm break-all">{audit!.request_id || "N/A"}</div>
              </div>
            </div>

            <div>
              <Label className="text-xs text-muted-foreground">User Agent</Label>
              <div className="mt-1 text-xs bg-muted p-2 rounded-md font-mono break-all text-muted-foreground">
                {audit!.user_agent || "N/A"}
              </div>
            </div>

            <div>
              <Label className="text-xs text-muted-foreground">Technical Details</Label>
              <div className="mt-1 bg-muted p-2 rounded-md overflow-hidden">
                <pre className="text-xs font-mono overflow-x-auto max-h-[150px]">
                  {JSON.stringify(audit!.details || {}, null, 2)}
                </pre>
              </div>
            </div>
          </div>
        )}

        <DialogFooter>
          <Button variant="secondary" onClick={onClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
