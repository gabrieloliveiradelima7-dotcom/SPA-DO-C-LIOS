
export type PaymentMethod = 'Dinheiro' | 'Cartão de Crédito' | 'Cartão de Débito' | 'Pix' | 'Outro';

export interface Client {
  id: string;
  name: string;
  phone: string;
  email: string;
  birthday: string;
  totalSpent: number;
  lastVisit: string;
  loyaltyPoints: number;
  isVIP: boolean;
  status: 'Active' | 'Inactive';
  preferences: string[];
  avatar?: string;
  visitCount: number;
}

export interface Professional {
  id: string;
  name: string;
  role: string;
  commission: number;
  avatar: string;
  rating: number;
  active: boolean;
}

export interface Service {
  id: string;
  name: string;
  price: number;
  duration: number; // default duration in minutes
  category: 'Hair' | 'Nails' | 'Skin' | 'Premium' | 'Internal';
}

export interface Appointment {
  id: string;
  clientId?: string;
  professionalId: string;
  serviceId?: string;
  blockTitle?: string;
  dateTime: string;
  duration: number; // actual duration in minutes for this specific appointment
  status: 'Scheduled' | 'Completed' | 'Cancelled' | 'Blocked';
  totalPrice: number;
  notes?: string; // Field for observations/notes
  paymentMethod?: PaymentMethod;
  discount?: number;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  minStock: number;
  brand: string;
}

export interface FinancialRecord {
  id: string;
  date: string;
  type: 'Income' | 'Expense';
  category: string;
  costType?: 'Fixed' | 'Variable';
  amount: number;
  description: string;
}
