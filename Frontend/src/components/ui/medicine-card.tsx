import { cn } from "@/lib/utils";
import { Pill, AlertTriangle, CheckCircle } from "lucide-react";
import { Medication } from "@/types/healthcare";
import { Button } from "./button";
import { Progress } from "./progress";

interface MedicineCardProps {
  medication: Medication;
  onTake?: () => void;
  className?: string;
}

function getStockStatus(remaining: number, total: number) {
  const percentage = (remaining / total) * 100;
  if (percentage <= 20) return { status: 'critical', color: 'text-destructive', bgColor: 'bg-destructive/10' };
  if (percentage <= 50) return { status: 'low', color: 'text-warning', bgColor: 'bg-warning/10' };
  return { status: 'good', color: 'text-success', bgColor: 'bg-success/10' };
}

export function MedicineCard({ medication, onTake, className }: MedicineCardProps) {
  const stockStatus = getStockStatus(medication.remainingTablets, medication.totalTablets);
  const stockPercentage = (medication.remainingTablets / medication.totalTablets) * 100;

  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-xl border bg-card p-5 shadow-sm transition-all duration-300 hover:shadow-md",
        className
      )}
    >
      <div className="flex items-start gap-4">
        <div className={cn("rounded-xl p-3", stockStatus.bgColor)}>
          <Pill className={cn("h-6 w-6", stockStatus.color)} />
        </div>
        
        <div className="flex-1 space-y-3">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-semibold text-foreground">{medication.name}</h3>
              <p className="text-sm text-muted-foreground">{medication.dosage} • {medication.time}</p>
            </div>
            <Button size="sm" variant="default" onClick={onTake}>
              <CheckCircle className="h-4 w-4 mr-1" />
              Take
            </Button>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Stock remaining</span>
              <span className={cn("font-medium flex items-center gap-1", stockStatus.color)}>
                {stockStatus.status === 'critical' && <AlertTriangle className="h-3 w-3" />}
                {medication.remainingTablets} / {medication.totalTablets}
              </span>
            </div>
            <Progress 
              value={stockPercentage} 
              className={cn(
                "h-2",
                stockStatus.status === 'critical' && "[&>div]:bg-destructive",
                stockStatus.status === 'low' && "[&>div]:bg-warning",
                stockStatus.status === 'good' && "[&>div]:bg-success"
              )} 
            />
          </div>
        </div>
      </div>
    </div>
  );
}
