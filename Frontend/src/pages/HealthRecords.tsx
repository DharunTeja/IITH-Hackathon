import { useState, useRef } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { useHealthRecords, usePrescriptions } from '@/hooks/useApi';
import {
  FileText,
  Upload,
  Download,
  ClipboardList,
  Calendar,
  User,
  Image as ImageIcon,
} from 'lucide-react';

const typeIcons = {
  lab: FileText,
  report: ImageIcon,
  prescription: ClipboardList,
};

const typeColors = {
  lab: 'bg-info/10 text-info',
  report: 'bg-warning/10 text-warning',
  prescription: 'bg-success/10 text-success',
};

export default function HealthRecords() {
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  const { records, isLoading: recordsLoading, uploadRecord } = useHealthRecords();
  const { prescriptions, isLoading: prescriptionsLoading } = usePrescriptions();
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    const { error } = await uploadRecord(formData);
    
    if (error) {
      toast({
        variant: 'destructive',
        title: 'Upload Failed',
        description: error,
      });
    } else {
      toast({
        title: 'Upload Successful',
        description: `${file.name} has been uploaded.`,
      });
    }
  };

  const handleDownload = (name: string) => {
    toast({
      title: 'Downloading',
      description: `Downloading ${name}...`,
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Health Records</h1>
            <p className="text-muted-foreground">View and manage your medical records</p>
          </div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleUpload}
            className="hidden"
            accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
          />
          <Button variant="hero" onClick={() => fileInputRef.current?.click()}>
            <Upload className="h-4 w-4 mr-2" />
            Upload Record
          </Button>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="records" className="w-full">
          <TabsList>
            <TabsTrigger value="records" className="gap-2">
              <FileText className="h-4 w-4" />
              Reports & Labs
            </TabsTrigger>
            <TabsTrigger value="prescriptions" className="gap-2">
              <ClipboardList className="h-4 w-4" />
              Prescriptions
            </TabsTrigger>
          </TabsList>

          <TabsContent value="records" className="mt-6">
            {recordsLoading ? (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3].map((i) => (
                  <Card key={i}>
                    <CardContent className="p-5 space-y-3">
                      <Skeleton className="h-12 w-12 rounded-xl" />
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-3 w-1/2" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : records.length > 0 ? (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {records.map((record: any) => {
                  const Icon = typeIcons[record.type as keyof typeof typeIcons] || FileText;
                  const colorClass = typeColors[record.type as keyof typeof typeColors] || 'bg-muted text-muted-foreground';
                  
                  return (
                    <Card key={record.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-5">
                        <div className="flex items-start gap-4">
                          <div className={`rounded-xl p-3 ${colorClass}`}>
                            <Icon className="h-6 w-6" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold truncate">{record.name || record.fileName}</h3>
                            <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                              <Calendar className="h-3 w-3" />
                              {record.date || record.uploadedAt}
                            </div>
                            {record.doctor && (
                              <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                                <User className="h-3 w-3" />
                                {record.doctor}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-2 mt-4">
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1"
                            onClick={() => handleDownload(record.name || record.fileName)}
                          >
                            <Download className="h-4 w-4 mr-1" />
                            Download
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            ) : (
              <Card className="border-dashed">
                <CardContent className="p-12 text-center">
                  <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">No records yet</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Upload your medical records to keep them organized.
                  </p>
                  <Button variant="hero" onClick={() => fileInputRef.current?.click()}>
                    <Upload className="h-4 w-4 mr-2" />
                    Upload First Record
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="prescriptions" className="mt-6">
            {prescriptionsLoading ? (
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
                {prescriptions.map((prescription: any) => (
                  <Card key={prescription.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-5">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-4">
                          <div className="rounded-xl p-3 bg-success/10 text-success">
                            <ClipboardList className="h-6 w-6" />
                          </div>
                          <div>
                            <h3 className="font-semibold">{prescription.medicine}</h3>
                            <p className="text-sm text-muted-foreground">
                              {prescription.dosage} • {prescription.timing}
                            </p>
                            <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <User className="h-3 w-3" />
                                {prescription.doctorName}
                              </span>
                              <span className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {prescription.createdAt}
                              </span>
                            </div>
                          </div>
                        </div>
                        <Badge variant="secondary">Active</Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="border-dashed">
                <CardContent className="p-12 text-center">
                  <ClipboardList className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">No prescriptions yet</h3>
                  <p className="text-sm text-muted-foreground">
                    Your prescriptions from doctors will appear here.
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
