import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { cn } from "~/lib/utils";

interface StatCardProps {
  label: string;
  value: number | string;
  icon: React.ReactNode;
  delta?: { value: number; label: string };
  className?: string;
}

export default function StatCard({ label, value, icon, delta, className }: StatCardProps) {
  const isPositive = (delta?.value ?? 0) >= 0;

  return (
    <Card className={cn("", className)}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{label}</CardTitle>
        <span className="text-muted-foreground">{icon}</span>
      </CardHeader>
      <CardContent>
        <p className="text-3xl font-bold tracking-tight">{typeof value === "number" ? value.toLocaleString() : value}</p>
        {delta && (
          <p className={cn("mt-1 text-xs", isPositive ? "text-green-600 dark:text-green-400" : "text-red-500")}>
            {isPositive ? "+" : ""}{delta.value} {delta.label}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
