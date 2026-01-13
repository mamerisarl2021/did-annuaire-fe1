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
  /** List of statuses to display (useful for filtering by role) */
  visibleStatuses?: Array<"all" | "PENDING" | "ACTIVE" | "SUSPENDED" | "REFUSED">;
}

const DEFAULT_STATUSES: Array<"all" | "PENDING" | "ACTIVE" | "SUSPENDED" | "REFUSED"> = [
  "all",
  "PENDING",
  "ACTIVE",
  "SUSPENDED",
  "REFUSED",
];

/**
 * Pure UI component for displaying organization statistics
 *
 * Responsibilities:
 * - Renders stat cards for each status
 * - Highlights active filter
 * - Delegates click to parent
 */
export function StatsCardsRow({
  stats,
  activeStatus,
  onStatusClick,
  visibleStatuses = DEFAULT_STATUSES
}: StatsCardsRowProps) {
  const totalCount =
    (stats?.active || 0) + (stats?.pending || 0) + (stats?.suspended || 0) + (stats?.refused || 0);

  const allCards = [
    {
      id: "all",
      label: "Tous",
      value: totalCount,
      onClick: () => onStatusClick(undefined),
    },
    {
      id: "PENDING",
      label: "En attente",
      value: stats?.pending || 0,
      onClick: () => onStatusClick("PENDING"),
    },
    {
      id: "ACTIVE",
      label: "Actifs",
      value: stats?.active || 0,
      onClick: () => onStatusClick("ACTIVE"),
    },
    {
      id: "SUSPENDED",
      label: "Suspendus",
      value: stats?.suspended || 0,
      onClick: () => onStatusClick("SUSPENDED"),
    },
    {
      id: "REFUSED",
      label: "Refusés",
      value: stats?.refused || 0,
      onClick: () => onStatusClick("REFUSED"),
    },
  ];

  const cardsToRender = allCards.filter(card => visibleStatuses.includes(card.id as any));

  return (
    <div className={`grid gap-4 ${cardsToRender.length === 5 ? "grid-cols-2 sm:grid-cols-3 lg:grid-cols-5" : "grid-cols-1 sm:grid-cols-3"
      }`}>
      {cardsToRender.map((card) => (
        <StatCard
          key={card.id}
          label={card.label}
          value={card.value}
          active={(card.id === "all" && activeStatus === "all") || (activeStatus === card.id)}
          onClick={card.onClick}
        />
      ))}
    </div>
  );
}
