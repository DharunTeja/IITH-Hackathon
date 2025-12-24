import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { usePrescriptions, usePatients } from '@/hooks/useApi';
import { Plus, ClipboardList, User, Calendar, Pill } from 'lucide-react';

export default function Prescriptions() {
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const { prescriptions, isLoading, createPrescription } = usePrescriptions();
  const { patients, isLoading: patientsLoading } = usePatients();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState('');
  const [medicine, setMedicine] = useState('');
  const [dosage, setDosage] = useState('');
  const [timing, setTiming] = useState('');

  if (!isAuthenticated || user?.role !== 'doctor') {
    return <Navigate to="/login" replace />;
  }

  const handleAddPrescription = async () => {
    if (!selectedPatient || !medicine || !dosage || !timing) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Please fill in all fields.',
      });
      return;
    }

    const { error } = await createPrescription({
      patientId: selectedPatient,
      medicine,
      dosage,
      timing,
    });

    if (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error,
      });
      return;
    }

    setIsDialogOpen(false);
    setSelectedPatient('');
    setMedicine('');
    setDosage('');
    setTiming('');

    toast({
      title: 'Prescription Added',
      description: `Prescription for ${medicine} has been created.`,
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Prescriptions</h1>
            <p className="text-muted-foreground">Create and manage patient prescriptions</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="hero">
                <Plus className="h-4 w-4 mr-2" />
                New Prescription
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Create Prescription</DialogTitle>
                <DialogDescription>
                  Add a new prescription for a patient.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label>Select Patient</Label>
                  <Select value={selectedPatient} onValueChange={setSelectedPatient}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a patient" />
                    </SelectTrigger>
                    <SelectContent>
                      {patientsLoading ? (
                        <div className="p-2">Loading...</div>
                      ) : (
                        patients.map((patient: any) => (
                          <SelectItem key={patient.id} value={patient.id}>
                            {patient.name} {patient.age ? `(Age: ${patient.age})` : ''}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="medicine">Medicine Name</Label>
                  <Input
                    id="medicine"
                    placeholder="e.g., Amoxicillin"
                    value={medicine}
                    onChange={(e) => setMedicine(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dosage">Dosage</Label>
                  <Input
                    id="dosage"
                    placeholder="e.g., 500mg"
                    value={dosage}
                    onChange={(e) => setDosage(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timing">Timing / Instructions</Label>
                  <Input
                    id="timing"
                    placeholder="e.g., Twice daily after meals"
                    value={timing}
                    onChange={(e) => setTiming(e.target.value)}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button variant="hero" onClick={handleAddPrescription}>
                  Create Prescription
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Prescriptions List */}
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Card key={i}>
                <CardContent className="p-5 space-y-3">
                  <Skeleton className="h-6 w-1/3" />
                  <Skeleton className="h-4 w-1/2" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : prescriptions.length > 0 ? (
          <div className="space-y-4">
            {prescriptions.map((prescription: any) => {
              const patient = patients.find((p: any) => p.id === prescription.patientId);
              return (
                <Card key={prescription.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-4">
                        <div className="rounded-xl p-3 bg-success/10 text-success">
                          <ClipboardList className="h-6 w-6" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <Pill className="h-4 w-4 text-primary" />
                            <h3 className="font-semibold">{prescription.medicine}</h3>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            {prescription.dosage} • {prescription.timing}
                          </p>
                          <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <User className="h-3 w-3" />
                              {patient?.name || 'Unknown Patient'}
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {prescription.createdAt}
                            </span>
                          </div>
                        </div>
                      </div>
                      <Badge variant="secondary" className="bg-success/10 text-success">
                        Active
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <Card className="border-dashed">
            <CardContent className="p-12 text-center">
              <ClipboardList className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-semibold mb-2">No prescriptions yet</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Create your first prescription for a patient.
              </p>
              <Button variant="hero" onClick={() => setIsDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create Prescription
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
