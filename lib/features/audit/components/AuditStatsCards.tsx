import { Card, CardContent } from "@/components/ui/card";
import { type AuditStats, AUDIT_CATEGORIES } from "../types/audit.types";
import { cn } from "@/lib/utils";

interface AuditStatCardProps {
  label: string;
  value: number;
  isActive?: boolean;
  onClick?: () => void;
}

/**
 * Local StatCard component matching the organizations design but optimized for high-density (8 cards)
 */
function AuditStatCard({ label, value, isActive, onClick }: AuditStatCardProps) {
  return (
    <Card
      className={cn(
        "cursor-pointer transition-all hover:shadow-md",
        isActive ? "border-[#0052cc] ring-1 ring-[#0052cc]" : "hover:border-[#0052cc]/50"
      )}
      onClick={onClick}
    >
      <CardContent className="p-3 flex flex-col items-center justify-center text-center space-y-1">
        <div className="text-xl font-bold text-[#172b4d]">{value.toLocaleString()}</div>
        <div className="text-[10px] text-[#5e6c84] font-bold uppercase tracking-wider truncate w-full">
          {label}
        </div>
      </CardContent>
    </Card>
  );
}

interface AuditStatsCardsProps {
  stats: AuditStats[];
  activeCategory?: string;
  onCategoryClick?: (category: string | undefined) => void;
  totalCount?: number;
}

/**
 * Pure UI component to display Audit Statistics
 * Shows all documented categories in a compact grid to ensure they fit on one line on large screens
 */
export function AuditStatsCards({
  stats,
  activeCategory,
  onCategoryClick,
  totalCount = 0
}: AuditStatsCardsProps) {

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
      {/* "All" Card */}
      <AuditStatCard
        label="All"
        value={totalCount}
        isActive={activeCategory === "all" || !activeCategory}
        onClick={() => onCategoryClick?.(undefined)}
      />

      {/* Defined Categories from documentation */}
      {AUDIT_CATEGORIES.map((catName) => {
        const stat = stats.find(s => s.category === catName);
        return (
          <AuditStatCard
            key={catName}
            label={catName}
            value={stat?.count || 0}
            isActive={activeCategory === catName}
            onClick={() => onCategoryClick?.(catName)}
          />
        );
      })}
    </div>
  );
}
