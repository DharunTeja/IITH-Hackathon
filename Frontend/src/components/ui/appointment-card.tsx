import { cn } from "@/lib/utils";
import { Calendar, Clock, User, CheckCircle, XCircle, Clock3 } from "lucide-react";
import { Appointment } from "@/types/healthcare";
import { Button } from "./button";
import { Badge } from "./badge";

interface AppointmentCardProps {
  appointment: Appointment;
  userRole: 'patient' | 'doctor';
  onApprove?: () => void;
  onReject?: () => void;
  className?: string;
}

const statusStyles = {
  pending: { bg: "bg-warning/10", text: "text-warning", border: "border-warning/20" },
  approved: { bg: "bg-success/10", text: "text-success", border: "border-success/20" },
  rejected: { bg: "bg-destructive/10", text: "text-destructive", border: "border-destructive/20" },
  completed: { bg: "bg-muted", text: "text-muted-foreground", border: "border-border" },
};

export function AppointmentCard({
  appointment,
  userRole,
  onApprove,
  onReject,
  className,
}: AppointmentCardProps) {
  const status = statusStyles[appointment.status];

  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-xl border bg-card p-5 shadow-sm transition-all duration-300 hover:shadow-md",
        status.border,
        className
      )}
    >
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className={cn("rounded-xl p-3", status.bg)}>
              <Calendar className={cn("h-5 w-5", status.text)} />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">
                {userRole === 'patient' ? appointment.doctorName : appointment.patientName}
              </h3>
              <p className="text-sm text-muted-foreground">{appointment.reason}</p>
            </div>
          </div>
          <Badge
            variant="outline"
            className={cn(status.bg, status.text, "border-0 capitalize")}
          >
            {appointment.status}
          </Badge>
        </div>

        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            {appointment.date}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            {appointment.time}
          </span>
        </div>

        {userRole === 'doctor' && appointment.status === 'pending' && (
          <div className="flex items-center gap-2 pt-2 border-t">
            <Button size="sm" variant="success" onClick={onApprove} className="flex-1">
              <CheckCircle className="h-4 w-4 mr-1" />
              Approve
            </Button>
            <Button size="sm" variant="destructive" onClick={onReject} className="flex-1">
              <XCircle className="h-4 w-4 mr-1" />
              Reject
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
