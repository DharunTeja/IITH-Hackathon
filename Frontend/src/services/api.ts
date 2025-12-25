const API_BASE_URL = 'http://localhost:8000/api';

interface ApiResponse<T> {
  data?: T;
  error?: string;
}

async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const token = localStorage.getItem('access_token');
  console.log('Access Token:', token); // Debugging token retrieval

  const headers: HeadersInit = {
    ...(options.body instanceof FormData
      ? {}
      : { 'Content-Type': 'application/json' }),
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return {
        error:
          errorData.detail ||
          errorData.message ||
          `Error ${response.status}`,
      };
    }

    if (response.status === 204) return {};
    const data = await response.json();
    return { data };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : 'Network error',
    };
  }
}


// Authentication
export const authApi = {
  register: (name: string, email: string, password: string, role: string) =>
    request<{ access_token: string }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password, role }),
    }),

  login: (email: string, password: string) =>
    request<{ access_token: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  me: () => request<{ user: any }>('/auth/me'),
};

// Medications
export const medicationsApi = {
  list: () => request<any[]>('/medications/'),

  create: (medication: {
    name: string;
    dosage: string;
    time: string;
    totalTablets: number;
    remainingTablets: number;
    frequency: string;
  }) =>
    request<any>('/medications/', {
      method: 'POST',
      body: JSON.stringify(medication),
    }),

  update: (id: string, medication: Partial<any>) =>
    request<any>(`/medications/${id}`, {
      method: 'PUT',
      body: JSON.stringify(medication),
    }),

  delete: (id: string) =>
    request<void>(`/medications/${id}`, { method: 'DELETE' }),
};

// Symptom Diary
export const symptomDiaryApi = {
  list: () => request<any[]>('/symptom-diary/'),

  create: (entry: {
    date: string;
    symptoms: string[];
    severity: number;
    notes: string;
  }) =>
    request<any>('/symptom-diary/', {
      method: 'POST',
      body: JSON.stringify(entry),
    }),
};

// Reminders
export const remindersApi = {
  list: () => request<any[]>('/reminders/'),

  create: (reminder: {
    type: string;
    time: string;
    title: string;
    isActive: boolean;
  }) =>
    request<any>('/reminders/', {
      method: 'POST',
      body: JSON.stringify(reminder),
    }),
};

// Messages
export const messagesApi = {
  list: () => request<any[]>('/messages/'),

  send: (receiverId: string, message: string) =>
    request<any>('/messages/', {
      method: 'POST',
      body: JSON.stringify({ receiverId, message }),
    }),

  chatHistory: (userId: string) => request<any[]>(`/message/chat/${userId}`),
};

// Appointments
export const appointmentsApi = {
  list: () => request<any[]>('/appointments/'),

  create: (appointment: {
    doctorId: string;
    date: string;
    time: string;
    reason: string;
  }) =>
    request<any>('/appointments/', {
      method: 'POST',
      body: JSON.stringify(appointment),
    }),

  updateStatus: (id: string, status: string) =>
    request<any>(`/appointments/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    }),
};

// Health Records
export const healthRecordsApi = {
  list: () => request<any[]>('/health-records/'),

  upload: (formData: FormData) =>
    request<any>('/health-record/', {
      method: 'POST',
      headers: {}, // Let browser set Content-Type for FormData
      body: formData as any,
    }),
};

// Prescriptions
export const prescriptionsApi = {
  list: () => request<any[]>('/prescriptions/'),

  create: (prescription: {
    patientId: string;
    medicine: string;
    dosage: string;
    timing: string;
  }) =>
    request<any>('/prescriptions/', {
      method: 'POST',
      body: JSON.stringify(prescription),
    }),
};

// Doctor Features
export const doctorsApi = {
  listPatients: () => request<any[]>('/doctors/patients/'),

  getPatientRecords: (patientId: string) =>
    request<any[]>(`/doctors/patient/${patientId}/records`),
};

// Patient Dashboard
export const patientDashboardApi = {
  get: () => request<any>('/patients/dashboard'),
};
