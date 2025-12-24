import { Link } from 'react-router-dom';
import { StatCard } from '@/components/ui/stat-card';
import { MedicineCard } from '@/components/ui/medicine-card';
import { AppointmentCard } from '@/components/ui/appointment-card';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { useMedications, useAppointments, useReminders, useSymptoms } from '@/hooks/useApi';
import {
  Pill,
  Calendar,
  Activity,
  Bell,
  Clock,
  ArrowRight,
  Plus,
  Heart,
  Utensils,
  Dumbbell,
} from 'lucide-react';

const reminderIcons = {
  medicine: Pill,
  food: Utensils,
  exercise: Dumbbell,
};

export function PatientDashboard() {
  const { toast } = useToast();
  const { medications, isLoading: medsLoading, updateMedication } = useMedications();
  const { appointments, isLoading: aptsLoading } = useAppointments();
  const { reminders, isLoading: remindersLoading } = useReminders();
  const { symptoms } = useSymptoms();

  const handleTakeMedicine = async (med: any) => {
    const { error } = await updateMedication(med.id, {
      remainingTablets: Math.max(0, med.remainingTablets - 1),
    });

    if (!error) {
      toast({
        title: 'Medicine logged!',
        description: `You've taken ${med.name}. Great job staying on track!`,
      });
    }
  };

  const upcomingAppointments = appointments.filter(a => a.status === 'approved' || a.status === 'pending');
  const lowStockMeds = medications.filter(m => (m.remainingTablets / m.totalTablets) <= 0.3);

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold">Patient Dashboard</h1>
        <p className="text-muted-foreground">Track your health and manage your medications</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Today's Medicines"
          value={medications.length}
          subtitle="Manage your medications"
          icon={Pill}
          variant="primary"
        />
        <StatCard
          title="Upcoming Appointments"
          value={upcomingAppointments.length}
          subtitle="View schedule"
          icon={Calendar}
          variant="success"
        />
        <StatCard
          title="Symptoms Logged"
          value={symptoms.length}
          subtitle="This week"
          icon={Activity}
          variant="warning"
        />
        <StatCard
          title="Active Reminders"
          value={reminders.filter(r => r.isActive).length}
          subtitle="Medicine, food, exercise"
          icon={Bell}
          variant="default"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Medications */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold">Today's Medications</h2>
              <p className="text-sm text-muted-foreground">Track and take your daily medicines</p>
            </div>
            <Link to="/medications">
              <Button variant="outline" size="sm">
                View All
                <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </Link>
          </div>

          {medsLoading ? (
            <div className="grid gap-4 sm:grid-cols-2">
              {[1, 2, 3, 4].map((i) => (
                <Card key={i}>
                  <CardContent className="p-5 space-y-3">
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-2 w-full" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {medications.slice(0, 4).map((med) => (
                <MedicineCard
                  key={med.id}
                  medication={med}
                  onTake={() => handleTakeMedicine(med)}
                />
              ))}
            </div>
          )}

          {lowStockMeds.length > 0 && (
            <Card className="border-warning/50 bg-warning/5">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-warning/20 p-2">
                    <Bell className="h-5 w-5 text-warning" />
                  </div>
                  <div>
                    <p className="font-medium">Low Stock Alert</p>
                    <p className="text-sm text-muted-foreground">
                      {lowStockMeds.map(m => m.name).join(', ')} running low. Consider refilling soon.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Reminders Sidebar */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Today's Schedule</h2>
            <Button variant="ghost" size="sm">
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          <Card>
            <CardContent className="p-4 space-y-3">
              {remindersLoading ? (
                [1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))
              ) : reminders.length > 0 ? (
                reminders.map((reminder) => {
                  const Icon = reminderIcons[reminder.type as keyof typeof reminderIcons] || Bell;
                  return (
                    <div
                      key={reminder.id}
                      className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                    >
                      <div className={`rounded-lg p-2 ${
                        reminder.type === 'medicine' ? 'bg-primary/10 text-primary' :
                        reminder.type === 'food' ? 'bg-warning/10 text-warning' :
                        'bg-success/10 text-success'
                      }`}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{reminder.title}</p>
                        <p className="text-xs text-muted-foreground">{reminder.time}</p>
                      </div>
                      <Clock className="h-4 w-4 text-muted-foreground" />
                    </div>
                  );
                })
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">No reminders set</p>
              )}
            </CardContent>
          </Card>

          {/* Quick Health Check */}
          <Card className="gradient-card border-primary/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <Heart className="h-5 w-5 text-primary" />
                Quick Health Check
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">
                How are you feeling today? Log your symptoms to keep your doctor informed.
              </p>
              <Link to="/symptoms">
                <Button variant="default" className="w-full">
                  Log Today's Symptoms
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Appointments Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">Upcoming Appointments</h2>
            <p className="text-sm text-muted-foreground">Your scheduled visits with healthcare providers</p>
          </div>
          <Link to="/appointments">
            <Button variant="outline" size="sm">
              Book New
              <Plus className="h-4 w-4 ml-1" />
            </Button>
          </Link>
        </div>

        {aptsLoading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <Card key={i}>
                <CardContent className="p-5 space-y-3">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {upcomingAppointments.slice(0, 3).map((apt) => (
              <AppointmentCard
                key={apt.id}
                appointment={apt}
                userRole="patient"
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
