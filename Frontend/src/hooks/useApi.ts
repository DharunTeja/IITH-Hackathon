import { useState, useEffect, useCallback } from 'react';
import {
  medicationsApi,
  symptomDiaryApi,
  remindersApi,
  appointmentsApi,
  messagesApi,
  healthRecordsApi,
  prescriptionsApi,
  doctorsApi,
  patientDashboardApi,
} from '@/services/api';
import { Medication, SymptomEntry, Reminder, Appointment, Message, Prescription } from '@/types/healthcare';

// Generic fetch hook
function useApiData<T>(
  fetchFn: () => Promise<{ data?: T; error?: string }>,
  initialData: T
) {
  const [data, setData] = useState<T>(initialData);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    setIsLoading(true);
    const { data: result, error: err } = await fetchFn();
    if (err) {
      setError(err);
    } else if (result) {
      setData(result);
      setError(null);
    }
    setIsLoading(false);
  }, [fetchFn]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { data, setData, isLoading, error, refetch };
}

// Medications
export function useMedications() {
  const { data, setData, isLoading, error, refetch } = useApiData(
    medicationsApi.list,
    [] as Medication[]
  );

  const addMedication = async (medication: Omit<Medication, 'id' | 'userId'>) => {
    const { data: newMed, error } = await medicationsApi.create(medication);
    if (newMed) {
      setData((prev) => [...prev, newMed]);
    }
    return { data: newMed, error };
  };

  const updateMedication = async (id: string, updates: Partial<Medication>) => {
    const { data: updated, error } = await medicationsApi.update(id, updates);
    if (updated) {
      setData((prev) => prev.map((m) => (m.id === id ? updated : m)));
    }
    return { data: updated, error };
  };

  const deleteMedication = async (id: string) => {
    const { error } = await medicationsApi.delete(id);
    if (!error) {
      setData((prev) => prev.filter((m) => m.id !== id));
    }
    return { error };
  };

  return {
    medications: data,
    isLoading,
    error,
    refetch,
    addMedication,
    updateMedication,
    deleteMedication,
  };
}

// Symptoms
export function useSymptoms() {
  const { data, setData, isLoading, error, refetch } = useApiData(
    symptomDiaryApi.list,
    [] as SymptomEntry[]
  );

  const addSymptom = async (entry: Omit<SymptomEntry, 'id' | 'userId'>) => {
    const { data: newEntry, error } = await symptomDiaryApi.create(entry);
    if (newEntry) {
      setData((prev) => [newEntry, ...prev]);
    }
    return { data: newEntry, error };
  };

  return { symptoms: data, isLoading, error, refetch, addSymptom };
}

// Reminders
export function useReminders() {
  const { data, setData, isLoading, error, refetch } = useApiData(
    remindersApi.list,
    [] as Reminder[]
  );

  const addReminder = async (reminder: Omit<Reminder, 'id' | 'userId'>) => {
    const { data: newReminder, error } = await remindersApi.create(reminder);
    if (newReminder) {
      setData((prev) => [...prev, newReminder]);
    }
    return { data: newReminder, error };
  };

  return { reminders: data, isLoading, error, refetch, addReminder };
}

// Appointments
export function useAppointments() {
  const { data, setData, isLoading, error, refetch } = useApiData(
    appointmentsApi.list,
    [] as Appointment[]
  );

  const createAppointment = async (appointment: {
    doctorId: string;
    date: string;
    time: string;
    reason: string;
  }) => {
    const { data: newApt, error } = await appointmentsApi.create(appointment);
    if (newApt) {
      setData((prev) => [...prev, newApt]);
    }
    return { data: newApt, error };
  };

  const updateStatus = async (id: string, status: string) => {
    const { data: updated, error } = await appointmentsApi.updateStatus(id, status);
    if (updated) {
      setData((prev) => prev.map((a) => (a.id === id ? { ...a, status: status as Appointment['status'] } : a)));
    }
    return { data: updated, error };
  };

  return {
    appointments: data,
    isLoading,
    error,
    refetch,
    createAppointment,
    updateStatus,
  };
}

// Messages
export function useMessages(contactId?: string) {
  const fetchMessages = useCallback(() => {
    if (contactId) {
      return messagesApi.chatHistory(contactId);
    }
    return messagesApi.list();
  }, [contactId]);

  const { data, setData, isLoading, error, refetch } = useApiData(fetchMessages, [] as Message[]);

  const sendMessage = async (receiverId: string, message: string) => {
    const { data: newMsg, error } = await messagesApi.send(receiverId, message);
    if (newMsg) {
      setData((prev) => [...prev, newMsg]);
    }
    return { data: newMsg, error };
  };

  return { messages: data, isLoading, error, refetch, sendMessage };
}

// Health Records
export function useHealthRecords() {
  const { data, isLoading, error, refetch } = useApiData(
    healthRecordsApi.list,
    [] as any[]
  );

  const uploadRecord = async (formData: FormData) => {
    const { data: newRecord, error } = await healthRecordsApi.upload(formData);
    if (newRecord) {
      refetch();
    }
    return { data: newRecord, error };
  };

  return { records: data, isLoading, error, refetch, uploadRecord };
}

// Prescriptions
export function usePrescriptions() {
  const { data, setData, isLoading, error, refetch } = useApiData(
    prescriptionsApi.list,
    [] as Prescription[]
  );

  const createPrescription = async (prescription: {
    patientId: string;
    medicine: string;
    dosage: string;
    timing: string;
  }) => {
    const { data: newPrescription, error } = await prescriptionsApi.create(prescription);
    if (newPrescription) {
      setData((prev) => [newPrescription, ...prev]);
    }
    return { data: newPrescription, error };
  };

  return { prescriptions: data, isLoading, error, refetch, createPrescription };
}

// Doctor - Patients
export function usePatients() {
  const { data, isLoading, error, refetch } = useApiData(
    doctorsApi.listPatients,
    [] as any[]
  );

  const getPatientRecords = async (patientId: string) => {
    return doctorsApi.getPatientRecords(patientId);
  };

  return { patients: data, isLoading, error, refetch, getPatientRecords };
}

// Patient Dashboard
export function usePatientDashboard() {
  const { data, isLoading, error, refetch } = useApiData(
    patientDashboardApi.get,
    null as any
  );

  return { dashboard: data, isLoading, error, refetch };
}
