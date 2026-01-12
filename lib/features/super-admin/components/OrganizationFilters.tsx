"use client";

import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search as SearchIcon } from "lucide-react";
import { type OrganizationStatus } from "../types/organization.types";

interface OrganizationFiltersProps {
  /** Current search value */
  search: string;
  /** Callback when search changes */
  onSearchChange: (value: string) => void;
  /** Current status filter */
  status: OrganizationStatus | "all";
  /** Callback when status changes */
  onStatusChange: (value: OrganizationStatus | "all") => void;
  /** Total count to display */
  totalCount: number;
}

/**
 * Pure UI component for organization list filters
 *
 * Responsibilities:
 * - Renders search input
 * - Renders status dropdown
 * - Displays total count badge
 * - Delegates all changes to parent
 */
export function OrganizationFilters({
  search,
  onSearchChange,
  status,
  onStatusChange,
  totalCount,
}: OrganizationFiltersProps) {
  return (
    <div className="flex flex-col md:flex-row gap-4 mb-6 justify-between items-center">
      {/* Search Input */}
      <div className="relative flex-1 max-w-sm w-full">
        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
        <Input
          placeholder="Search (Name, Email)..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Status Filter & Count */}
      <div className="flex items-center gap-2 w-full md:w-auto">
        <Select
          value={status}
          onValueChange={(v) => onStatusChange(v as OrganizationStatus | "all")}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="PENDING">Pending</SelectItem>
            <SelectItem value="ACTIVE">Active</SelectItem>
            <SelectItem value="SUSPENDED">Suspended</SelectItem>
            <SelectItem value="REFUSED">Refused</SelectItem>
          </SelectContent>
        </Select>
        <Badge variant="secondary">{totalCount} total</Badge>
      </div>
    </div>
  );
}
