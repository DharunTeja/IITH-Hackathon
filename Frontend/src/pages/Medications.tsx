import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { MedicineCard } from '@/components/ui/medicine-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { useMedications } from '@/hooks/useApi';
import { Plus, Pill, Search, AlertTriangle } from 'lucide-react';

export default function Medications() {
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  const { medications, isLoading, addMedication, updateMedication } = useMedications();
  const [searchQuery, setSearchQuery] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newMed, setNewMed] = useState<{
    name: string;
    dosage: string;
    time: string;
    totalTablets: number;
    frequency: 'daily' | 'weekly' | 'as-needed';
  }>({
    name: '',
    dosage: '',
    time: '',
    totalTablets: 30,
    frequency: 'daily',
  });

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const filteredMedications = medications.filter(med =>
    med.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddMedication = async () => {
    if (!newMed.name || !newMed.dosage || !newMed.time) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Please fill in all required fields.',
      });
      return;
    }

    const { error } = await addMedication({
      ...newMed,
      remainingTablets: newMed.totalTablets,
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
    setNewMed({ name: '', dosage: '', time: '', totalTablets: 30, frequency: 'daily' });
    
    toast({
      title: 'Medication Added',
      description: `${newMed.name} has been added to your list.`,
    });
  };

  const handleTakeMedicine = async (med: any) => {
    const { error } = await updateMedication(med.id, {
      remainingTablets: Math.max(0, med.remainingTablets - 1),
    });

    if (!error) {
      toast({
        title: 'Medicine Taken',
        description: `You've logged taking ${med.name}.`,
      });
    }
  };

  const lowStockCount = medications.filter(m => (m.remainingTablets / m.totalTablets) <= 0.3).length;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Medications</h1>
            <p className="text-muted-foreground">Manage and track your medications</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="hero">
                <Plus className="h-4 w-4 mr-2" />
                Add Medicine
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add New Medication</DialogTitle>
                <DialogDescription>
                  Add a new medication to your tracking list.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="med-name">Medicine Name</Label>
                  <Input
                    id="med-name"
                    placeholder="e.g., Metformin"
                    value={newMed.name}
                    onChange={(e) => setNewMed(prev => ({ ...prev, name: e.target.value }))}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="dosage">Dosage</Label>
                    <Input
                      id="dosage"
                      placeholder="e.g., 500mg"
                      value={newMed.dosage}
                      onChange={(e) => setNewMed(prev => ({ ...prev, dosage: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="time">Time</Label>
                    <Input
                      id="time"
                      type="time"
                      value={newMed.time}
                      onChange={(e) => setNewMed(prev => ({ ...prev, time: e.target.value }))}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="total">Total Tablets</Label>
                    <Input
                      id="total"
                      type="number"
                      value={newMed.totalTablets}
                      onChange={(e) => setNewMed(prev => ({ ...prev, totalTablets: parseInt(e.target.value) || 0 }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="frequency">Frequency</Label>
                    <Select
                      value={newMed.frequency}
                      onValueChange={(v: 'daily' | 'weekly' | 'as-needed') => setNewMed(prev => ({ ...prev, frequency: v }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="as-needed">As Needed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button variant="hero" onClick={handleAddMedication}>
                  Add Medication
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Search and Filters */}
        <div className="flex gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search medications..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Low Stock Warning */}
        {lowStockCount > 0 && (
          <Card className="border-warning/50 bg-warning/5">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-warning/20 p-2">
                  <AlertTriangle className="h-5 w-5 text-warning" />
                </div>
                <div>
                  <p className="font-medium">Low Stock Alert</p>
                  <p className="text-sm text-muted-foreground">
                    {lowStockCount} medication{lowStockCount > 1 ? 's' : ''} running low. Consider refilling soon.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Medications Grid */}
        {isLoading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <Card key={i}>
                <CardContent className="p-5 space-y-3">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-2 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredMedications.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredMedications.map((med) => (
              <MedicineCard
                key={med.id}
                medication={med}
                onTake={() => handleTakeMedicine(med)}
              />
            ))}
          </div>
        ) : (
          <Card className="border-dashed">
            <CardContent className="p-12 text-center">
              <Pill className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-semibold mb-2">No medications found</h3>
              <p className="text-sm text-muted-foreground mb-4">
                {searchQuery ? 'Try a different search term.' : 'Add your first medication to get started.'}
              </p>
              {!searchQuery && (
                <Button variant="hero" onClick={() => setIsDialogOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Medicine
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
