"use client";

import { type OrganizationStats } from "../types/organization.types";
import { StatCard } from "./StatCard";

interface StatsCardsRowProps {
  /** Organization statistics */
  stats: OrganizationStats | null;
  /** Currently active status filter */
  activeStatus: string;
  /** Callback when a stat card is clicked */
  onStatusClick: (status: string | undefined) => void;
}

/**
 * Pure UI component for displaying organization statistics
 *
 * Responsibilities:
 * - Renders stat cards for each status
 * - Highlights active filter
 * - Delegates click to parent
 */
export function StatsCardsRow({ stats, activeStatus, onStatusClick }: StatsCardsRowProps) {
  const totalCount =
    (stats?.active || 0) + (stats?.pending || 0) + (stats?.suspended || 0) + (stats?.refused || 0);

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
      <StatCard
        label="Tous"
        value={totalCount}
        active={activeStatus === "all"}
        onClick={() => onStatusClick(undefined)}
      />
      <StatCard
        label="En attente"
        value={stats?.pending || 0}
        active={activeStatus === "PENDING"}
        onClick={() => onStatusClick("PENDING")}
      />
      <StatCard
        label="Actifs"
        value={stats?.active || 0}
        active={activeStatus === "ACTIVE"}
        onClick={() => onStatusClick("ACTIVE")}
      />
      <StatCard
        label="Suspendus"
        value={stats?.suspended || 0}
        active={activeStatus === "SUSPENDED"}
        onClick={() => onStatusClick("SUSPENDED")}
      />
      <StatCard
        label="Refusés"
        value={stats?.refused || 0}
        active={activeStatus === "REFUSED"}
        onClick={() => onStatusClick("REFUSED")}
      />
    </div>
  );
}
