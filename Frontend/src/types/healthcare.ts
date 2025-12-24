export type UserRole = 'patient' | 'doctor';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

export interface Medication {
  id: string;
  userId: string;
  name: string;
  dosage: string;
  time: string;
  totalTablets: number;
  remainingTablets: number;
  frequency: 'daily' | 'weekly' | 'as-needed';
}

export interface Reminder {
  id: string;
  userId: string;
  type: 'medicine' | 'food' | 'exercise';
  time: string;
  title: string;
  isActive: boolean;
}

export interface SymptomEntry {
  id: string;
  userId: string;
  date: string;
  symptoms: string[];
  severity: number;
  notes: string;
}

export interface Appointment {
  id: string;
  patientId: string;
  doctorId: string;
  date: string;
  time: string;
  status: 'pending' | 'approved' | 'rejected' | 'completed';
  reason: string;
  patientName?: string;
  doctorName?: string;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  message: string;
  timestamp: string;
  senderName?: string;
}

export interface HealthRecord {
  id: string;
  patientId: string;
  type: 'lab' | 'prescription' | 'report';
  fileName: string;
  uploadedAt: string;
}

export interface Prescription {
  id: string;
  patientId: string;
  doctorId: string;
  medicine: string;
  dosage: string;
  timing: string;
  createdAt: string;
  doctorName?: string;
}
