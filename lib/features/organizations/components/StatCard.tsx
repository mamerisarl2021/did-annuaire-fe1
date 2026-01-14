import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: number;
  active?: boolean;
  onClick?: () => void;
  icon?: React.ReactNode;
}

export function StatCard({ label, value, active, onClick, icon }: StatCardProps) {
  return (
    <Card
      className={cn(
        "cursor-pointer transition-all hover:shadow-md",
        active ? "border-primary ring-1 ring-primary" : "hover:border-primary/50"
      )}
      onClick={onClick}
    >
      <CardContent className="p-4 flex flex-col items-center justify-center text-center space-y-2">
        {icon && <div className="text-muted-foreground">{icon}</div>}
        <div className="text-2xl font-bold">{value}</div>
        <div className="text-sm text-muted-foreground font-medium uppercase tracking-wider">
          {label}
        </div>
      </CardContent>
    </Card>
  );
}
