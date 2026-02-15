export type PaymentMethod = 'Dinheiro' | 'Cartão de Crédito' | 'Cartão de Débito' | 'Pix' | 'Outro';

export interface ClientPayload {
  name: string;
  phone: string;
  email?: string;
  birthday?: string;
  totalSpent?: number;
  lastVisit?: string;
  loyaltyPoints?: number;
  isVIP?: boolean;
  status?: 'Active' | 'Inactive';
  preferences?: string[];
  avatar?: string;
  visitCount?: number;
}

export interface ServicePayload {
  name: string;
  price: number;
  duration: number;
  category: 'Hair' | 'Nails' | 'Skin' | 'Premium' | 'Internal';
}

export interface AppointmentPayload {
  clientId?: string;
  professionalId: string;
  serviceId?: string;
  blockTitle?: string;
  dateTime: string;
  duration: number;
  status: 'Scheduled' | 'Completed' | 'Cancelled' | 'Blocked';
  totalPrice: number;
  notes?: string;
  paymentMethod?: PaymentMethod;
  discount?: number;
}

export interface FinancialRecordPayload {
  date: string;
  type: 'Income' | 'Expense';
  category: string;
  costType?: 'Fixed' | 'Variable';
  amount: number;
  description: string;
  appointmentId?: string;
}
