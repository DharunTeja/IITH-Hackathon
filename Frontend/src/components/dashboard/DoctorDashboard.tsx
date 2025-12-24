import { Link } from 'react-router-dom';
import { StatCard } from '@/components/ui/stat-card';
import { AppointmentCard } from '@/components/ui/appointment-card';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { useAppointments, usePatients, useMessages } from '@/hooks/useApi';
import {
  Users,
  Calendar,
  ClipboardList,
  MessageSquare,
  ArrowRight,
  Clock,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';

export function DoctorDashboard() {
  const { toast } = useToast();
  const { appointments, isLoading: aptsLoading, updateStatus } = useAppointments();
  const { patients, isLoading: patientsLoading } = usePatients();
  const { messages } = useMessages();

  const pendingAppointments = appointments.filter(a => a.status === 'pending');
  const todayAppointments = appointments.filter(a => a.status === 'approved');
  const unreadMessages = messages.length;

  const handleApprove = async (id: string) => {
    const { error } = await updateStatus(id, 'approved');
    if (!error) {
      toast({
        title: 'Appointment Approved',
        description: 'The patient has been notified.',
      });
    }
  };

  const handleReject = async (id: string) => {
    const { error } = await updateStatus(id, 'rejected');
    if (!error) {
      toast({
        title: 'Appointment Rejected',
        description: 'The patient has been notified.',
      });
    }
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold">Doctor Dashboard</h1>
        <p className="text-muted-foreground">Manage your patients and appointments</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Patients"
          value={patients.length}
          subtitle="View all patients"
          icon={Users}
          variant="primary"
        />
        <StatCard
          title="Today's Appointments"
          value={todayAppointments.length}
          subtitle="Approved appointments"
          icon={Calendar}
          variant="success"
        />
        <StatCard
          title="Pending Requests"
          value={pendingAppointments.length}
          subtitle="Awaiting approval"
          icon={Clock}
          variant="warning"
        />
        <StatCard
          title="Unread Messages"
          value={unreadMessages}
          subtitle="From patients"
          icon={MessageSquare}
          variant="default"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Appointment Requests */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-warning" />
                Pending Appointment Requests
              </h2>
              <p className="text-sm text-muted-foreground">Review and respond to patient requests</p>
            </div>
            <Link to="/appointments">
              <Button variant="outline" size="sm">
                View All
                <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </Link>
          </div>

          {aptsLoading ? (
            <div className="grid gap-4 sm:grid-cols-2">
              {[1, 2].map((i) => (
                <Card key={i}>
                  <CardContent className="p-5 space-y-3">
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                    <div className="flex gap-2">
                      <Skeleton className="h-8 w-20" />
                      <Skeleton className="h-8 w-20" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : pendingAppointments.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2">
              {pendingAppointments.map((apt) => (
                <AppointmentCard
                  key={apt.id}
                  appointment={apt}
                  userRole="doctor"
                  onApprove={() => handleApprove(apt.id)}
                  onReject={() => handleReject(apt.id)}
                />
              ))}
            </div>
          ) : (
            <Card className="border-success/50 bg-success/5">
              <CardContent className="p-6 text-center">
                <CheckCircle className="h-12 w-12 text-success mx-auto mb-3" />
                <p className="font-medium">All caught up!</p>
                <p className="text-sm text-muted-foreground">No pending appointment requests.</p>
              </CardContent>
            </Card>
          )}

          {/* Today's Schedule */}
          <div className="mt-8 space-y-4">
            <h2 className="text-lg font-semibold">Today's Schedule</h2>
            {aptsLoading ? (
              <div className="grid gap-4 sm:grid-cols-2">
                {[1, 2].map((i) => (
                  <Card key={i}>
                    <CardContent className="p-5 space-y-3">
                      <Skeleton className="h-6 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2">
                {todayAppointments.map((apt) => (
                  <AppointmentCard
                    key={apt.id}
                    appointment={apt}
                    userRole="doctor"
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Patients List Sidebar */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Recent Patients</h2>
            <Link to="/patients">
              <Button variant="ghost" size="sm">
                View All
              </Button>
            </Link>
          </div>

          <Card>
            <CardContent className="p-4 space-y-3">
              {patientsLoading ? (
                [1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center gap-3 p-3">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="flex-1">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-3 w-16 mt-1" />
                    </div>
                  </div>
                ))
              ) : (
                patients.slice(0, 5).map((patient: any) => (
                  <div
                    key={patient.id}
                    className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors cursor-pointer"
                  >
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {patient.name?.charAt(0) || '?'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{patient.name}</p>
                      {patient.age && (
                        <p className="text-xs text-muted-foreground">Age: {patient.age}</p>
                      )}
                    </div>
                    {patient.lastVisit && (
                      <Badge variant="outline" className="text-xs">
                        {patient.lastVisit}
                      </Badge>
                    )}
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="gradient-card border-primary/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <ClipboardList className="h-5 w-5 text-primary" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Link to="/prescriptions">
                <Button variant="outline" className="w-full justify-start">
                  <ClipboardList className="h-4 w-4 mr-2" />
                  Write Prescription
                </Button>
              </Link>
              <Link to="/messages">
                <Button variant="outline" className="w-full justify-start">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Message Patient
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Recent Messages Preview */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-muted-foreground" />
                Recent Messages
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {messages.slice(0, 2).map((msg: any) => (
                <div key={msg.id} className="p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-sm font-medium">{msg.senderName}</p>
                    <span className="text-xs text-muted-foreground">
                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2">{msg.message}</p>
                </div>
              ))}
              <Link to="/messages">
                <Button variant="link" className="w-full text-primary">
                  View all messages
                  <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
