"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CheckCircle, XCircle, Eye, Building2, Trash2, RefreshCw } from "lucide-react";
import { OrganizationStatusBadge } from "./OrganizationStatusBadge";
import { type OrganizationListItem } from "../types/organization.types";

interface OrganizationsTableProps {
  organizations: OrganizationListItem[];
  onRowClick: (org: OrganizationListItem) => void;
  onView: (org: OrganizationListItem) => void;
  onValidate?: (orgId: string) => void;
  onRefuse?: (org: OrganizationListItem) => void;
  onToggle?: (orgId: string) => void;
  onDelete?: (org: OrganizationListItem) => void;
  isActionsDisabled?: boolean;
}

/**
 * Pure UI component for displaying organizations in a table
 *
 * Responsibilities:
 * - Renders organization data in table format
 * - Shows appropriate action buttons based on status
 * - Delegates all actions to parent
 */
export function OrganizationsTable({
  organizations,
  onRowClick,
  onView,
  onValidate,
  onRefuse,
  onToggle,
  onDelete,
  isActionsDisabled = false,
}: OrganizationsTableProps) {
  if (organizations.length === 0) {
    return (
      <div className="text-center py-16">
        <Building2 className="size-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-medium mb-2">No organizations</h3>
        <p className="text-muted-foreground">Modify filters to see results.</p>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Organization</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Country</TableHead>
            <TableHead>Admin Email</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {organizations.map((org) => (
            <TableRow
              key={org.id}
              className="cursor-pointer hover:bg-muted/50"
              onClick={() => onRowClick(org)}
            >
              <TableCell className="font-medium">
                <div>{org.name}</div>
                <div className="text-xs text-muted-foreground">{org.email}</div>
              </TableCell>
              <TableCell>
                <Badge variant="outline">{org.type}</Badge>
              </TableCell>
              <TableCell>{org.country}</TableCell>
              <TableCell>{org.adminEmail}</TableCell>
              <TableCell>
                <OrganizationStatusBadge status={org.status} />
              </TableCell>
              <TableCell>{new Date(org.createdAt).toLocaleDateString()}</TableCell>
              <TableCell className="text-right">
                <div
                  className="flex items-center justify-end gap-2"
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* View Button */}
                  <Button size="sm" variant="ghost" onClick={() => onView(org)}>
                    <Eye className="size-4" />
                  </Button>

                  {/* Toggle Button for Active/Suspended */}
                  {["ACTIVE", "SUSPENDED"].includes(org.status) && (
                    <Button
                      size="sm"
                      className="bg-blue-600 hover:bg-blue-700 text-white border-0"
                      onClick={() => onToggle?.(org.id)}
                      disabled={isActionsDisabled}
                    >
                      <RefreshCw className="size-4" />
                    </Button>
                  )}

                  {/* Delete Button */}
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => onDelete?.(org)}
                    disabled={isActionsDisabled}
                  >
                    <Trash2 className="size-4" />
                  </Button>

                  {/* Pending Actions */}
                  {org.status === "PENDING" && (
                    <>
                      <Button
                        size="sm"
                        className="bg-green-600 hover:bg-green-700 text-white border-0 shadow-none"
                        onClick={() => onValidate?.(org.id)}
                        disabled={isActionsDisabled}
                      >
                        <CheckCircle className="size-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => onRefuse?.(org)}
                        disabled={isActionsDisabled}
                      >
                        <XCircle className="size-4" />
                      </Button>
                    </>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
