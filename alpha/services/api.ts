import { Appointment, Client, FinancialRecord, Professional, Service } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api/v1';

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options?.headers || {}),
    },
    ...options,
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || `Erro na requisição ${path}`);
  }

  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
}

export const api = {
  clients: {
    list: () => request<Client[]>('/clients'),
    create: (data: Client) => request<Client>('/clients', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: Client) => request<Client>(`/clients/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    remove: (id: string) => request<void>(`/clients/${id}`, { method: 'DELETE' }),
  },
  services: {
    list: () => request<Service[]>('/services'),
    create: (data: Service) => request<Service>('/services', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: Service) => request<Service>(`/services/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    remove: (id: string) => request<void>(`/services/${id}`, { method: 'DELETE' }),
  },
  appointments: {
    list: () => request<Appointment[]>('/appointments'),
    create: (data: Appointment) => request<Appointment>('/appointments', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: Appointment) => request<Appointment>(`/appointments/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  },
  financialRecords: {
    list: () => request<FinancialRecord[]>('/financial-records'),
    create: (data: FinancialRecord) => request<FinancialRecord>('/financial-records', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: FinancialRecord) => request<FinancialRecord>(`/financial-records/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    remove: (id: string) => request<void>(`/financial-records/${id}`, { method: 'DELETE' }),
  },
  professionals: {
    list: () => request<Professional[]>('/professionals'),
  },
  ai: {
    marketingMessage: (data: { clientName: string; recentService: string; promoType: 'loyalty' | 're-engagement' | 'birthday' }) =>
      request<{ text: string }>('/ai/marketing-message', { method: 'POST', body: JSON.stringify(data) }),
  },
};
