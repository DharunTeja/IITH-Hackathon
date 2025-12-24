import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { useSymptoms } from '@/hooks/useApi';
import { Plus, Activity, Calendar, Trash2 } from 'lucide-react';

const severityLabels = ['None', 'Mild', 'Moderate', 'Significant', 'Severe', 'Critical'];
const severityColors = ['bg-success', 'bg-success/70', 'bg-warning/70', 'bg-warning', 'bg-destructive/70', 'bg-destructive'];

const commonSymptoms = [
  'Headache', 'Fatigue', 'Nausea', 'Fever', 'Cough', 'Sore Throat',
  'Back Pain', 'Dizziness', 'Chest Pain', 'Shortness of Breath',
  'Joint Pain', 'Muscle Ache', 'Insomnia', 'Anxiety', 'Depression'
];

export default function Symptoms() {
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  const { symptoms, isLoading, addSymptom } = useSymptoms();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [severity, setSeverity] = useState(3);
  const [notes, setNotes] = useState('');
  const [customSymptom, setCustomSymptom] = useState('');

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const handleToggleSymptom = (symptom: string) => {
    setSelectedSymptoms(prev =>
      prev.includes(symptom)
        ? prev.filter(s => s !== symptom)
        : [...prev, symptom]
    );
  };

  const handleAddCustomSymptom = () => {
    if (customSymptom.trim() && !selectedSymptoms.includes(customSymptom.trim())) {
      setSelectedSymptoms(prev => [...prev, customSymptom.trim()]);
      setCustomSymptom('');
    }
  };

  const handleSubmit = async () => {
    if (selectedSymptoms.length === 0) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Please select at least one symptom.',
      });
      return;
    }

    const { error } = await addSymptom({
      date: new Date().toISOString().split('T')[0],
      symptoms: selectedSymptoms,
      severity,
      notes,
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
    setSelectedSymptoms([]);
    setSeverity(3);
    setNotes('');

    toast({
      title: 'Symptoms Logged',
      description: 'Your symptom entry has been recorded.',
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Symptom Diary</h1>
            <p className="text-muted-foreground">Track and log your daily symptoms</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="hero">
                <Plus className="h-4 w-4 mr-2" />
                Log Symptoms
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Log Today's Symptoms</DialogTitle>
                <DialogDescription>
                  Select your symptoms and rate their severity.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-6 py-4">
                {/* Common Symptoms */}
                <div className="space-y-3">
                  <Label>Select Symptoms</Label>
                  <div className="flex flex-wrap gap-2">
                    {commonSymptoms.map((symptom) => (
                      <Badge
                        key={symptom}
                        variant={selectedSymptoms.includes(symptom) ? 'default' : 'outline'}
                        className="cursor-pointer transition-all hover:scale-105"
                        onClick={() => handleToggleSymptom(symptom)}
                      >
                        {symptom}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Custom Symptom */}
                <div className="space-y-2">
                  <Label>Add Custom Symptom</Label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Type a symptom..."
                      value={customSymptom}
                      onChange={(e) => setCustomSymptom(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleAddCustomSymptom()}
                    />
                    <Button variant="outline" onClick={handleAddCustomSymptom}>
                      Add
                    </Button>
                  </div>
                </div>

                {/* Selected Symptoms */}
                {selectedSymptoms.length > 0 && (
                  <div className="space-y-2">
                    <Label>Selected ({selectedSymptoms.length})</Label>
                    <div className="flex flex-wrap gap-2">
                      {selectedSymptoms.map((symptom) => (
                        <Badge
                          key={symptom}
                          className="bg-primary/10 text-primary cursor-pointer"
                          onClick={() => handleToggleSymptom(symptom)}
                        >
                          {symptom} ×
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Severity Slider */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label>Severity Level</Label>
                    <Badge className={severityColors[severity]}>
                      {severityLabels[severity]}
                    </Badge>
                  </div>
                  <Slider
                    value={[severity]}
                    onValueChange={([v]) => setSeverity(v)}
                    min={0}
                    max={5}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>None</span>
                    <span>Critical</span>
                  </div>
                </div>

                {/* Notes */}
                <div className="space-y-2">
                  <Label htmlFor="notes">Additional Notes</Label>
                  <Textarea
                    id="notes"
                    placeholder="Describe how you're feeling, when symptoms started, etc."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={3}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button variant="hero" onClick={handleSubmit}>
                  Save Entry
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Entries List */}
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Card key={i}>
                <CardContent className="p-5 space-y-3">
                  <Skeleton className="h-6 w-1/4" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : symptoms.length > 0 ? (
          <div className="space-y-4">
            {symptoms.map((entry) => (
              <Card key={entry.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-3 flex-1">
                      <div className="flex items-center gap-3">
                        <div className={`rounded-lg p-2 ${severityColors[entry.severity]}/20`}>
                          <Activity className={`h-5 w-5 ${severityColors[entry.severity].replace('bg-', 'text-')}`} />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">{entry.date}</span>
                          </div>
                        </div>
                        <Badge className={severityColors[entry.severity]}>
                          {severityLabels[entry.severity]}
                        </Badge>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {entry.symptoms.map((symptom) => (
                          <Badge key={symptom} variant="secondary">
                            {symptom}
                          </Badge>
                        ))}
                      </div>

                      {entry.notes && (
                        <p className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg">
                          {entry.notes}
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="border-dashed">
            <CardContent className="p-12 text-center">
              <Activity className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-semibold mb-2">No symptom entries yet</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Start tracking your symptoms to share with your healthcare provider.
              </p>
              <Button variant="hero" onClick={() => setIsDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Log Your First Entry
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
