import { Medication, Reminder, SymptomEntry, Appointment, Message, Prescription } from '@/types/healthcare';

export const mockMedications: Medication[] = [
  {
    id: '1',
    userId: '1',
    name: 'Metformin',
    dosage: '500mg',
    time: '08:00',
    totalTablets: 30,
    remainingTablets: 24,
    frequency: 'daily',
  },
  {
    id: '2',
    userId: '1',
    name: 'Lisinopril',
    dosage: '10mg',
    time: '09:00',
    totalTablets: 30,
    remainingTablets: 8,
    frequency: 'daily',
  },
  {
    id: '3',
    userId: '1',
    name: 'Vitamin D3',
    dosage: '1000 IU',
    time: '12:00',
    totalTablets: 60,
    remainingTablets: 45,
    frequency: 'daily',
  },
];

export const mockReminders: Reminder[] = [
  { id: '1', userId: '1', type: 'medicine', time: '08:00', title: 'Morning Medication', isActive: true },
  { id: '2', userId: '1', type: 'food', time: '12:30', title: 'Lunch Time', isActive: true },
  { id: '3', userId: '1', type: 'exercise', time: '17:00', title: 'Evening Walk', isActive: true },
  { id: '4', userId: '1', type: 'medicine', time: '21:00', title: 'Night Medication', isActive: true },
];

export const mockSymptoms: SymptomEntry[] = [
  {
    id: '1',
    userId: '1',
    date: '2024-12-23',
    symptoms: ['Headache', 'Fatigue'],
    severity: 3,
    notes: 'Mild headache after lunch, feeling tired.',
  },
  {
    id: '2',
    userId: '1',
    date: '2024-12-22',
    symptoms: ['Back Pain'],
    severity: 5,
    notes: 'Lower back pain after sitting for long hours.',
  },
  {
    id: '3',
    userId: '1',
    date: '2024-12-21',
    symptoms: ['Nausea'],
    severity: 2,
    notes: 'Slight nausea in the morning.',
  },
];

export const mockAppointments: Appointment[] = [
  {
    id: '1',
    patientId: '1',
    doctorId: '2',
    date: '2024-12-26',
    time: '10:00',
    status: 'approved',
    reason: 'Regular checkup',
    patientName: 'John Patient',
    doctorName: 'Dr. Sarah Smith',
  },
  {
    id: '2',
    patientId: '1',
    doctorId: '2',
    date: '2024-12-28',
    time: '14:30',
    status: 'pending',
    reason: 'Follow-up consultation',
    patientName: 'John Patient',
    doctorName: 'Dr. Sarah Smith',
  },
];

export const mockMessages: Message[] = [
  {
    id: '1',
    senderId: '1',
    receiverId: '2',
    message: 'Hello Doctor, I have been experiencing some headaches lately.',
    timestamp: '2024-12-23T10:30:00',
    senderName: 'John Patient',
  },
  {
    id: '2',
    senderId: '2',
    receiverId: '1',
    message: 'Hi John, can you describe the headaches? Are they constant or intermittent?',
    timestamp: '2024-12-23T10:35:00',
    senderName: 'Dr. Sarah Smith',
  },
  {
    id: '3',
    senderId: '1',
    receiverId: '2',
    message: 'They come and go, usually in the afternoon. The pain is behind my eyes.',
    timestamp: '2024-12-23T10:40:00',
    senderName: 'John Patient',
  },
];

export const mockPrescriptions: Prescription[] = [
  {
    id: '1',
    patientId: '1',
    doctorId: '2',
    medicine: 'Paracetamol',
    dosage: '500mg',
    timing: 'As needed, max 4 times daily',
    createdAt: '2024-12-20',
    doctorName: 'Dr. Sarah Smith',
  },
  {
    id: '2',
    patientId: '1',
    doctorId: '2',
    medicine: 'Omeprazole',
    dosage: '20mg',
    timing: 'Once daily before breakfast',
    createdAt: '2024-12-18',
    doctorName: 'Dr. Sarah Smith',
  },
];

export const mockDoctors = [
  { id: '2', name: 'Dr. Sarah Smith', specialty: 'General Physician', avatar: '' },
  { id: '3', name: 'Dr. Michael Chen', specialty: 'Cardiologist', avatar: '' },
  { id: '4', name: 'Dr. Emily Johnson', specialty: 'Neurologist', avatar: '' },
];

export const mockPatients = [
  { id: '1', name: 'John Patient', age: 35, lastVisit: '2024-12-20' },
  { id: '5', name: 'Mary Wilson', age: 42, lastVisit: '2024-12-22' },
  { id: '6', name: 'Robert Brown', age: 58, lastVisit: '2024-12-19' },
];
