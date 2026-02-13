
import { Client, Professional, Service, Product, Appointment } from './types';

export const MOCK_CLIENTS: Client[] = [
  { id: '1', name: 'Adriana Silva', phone: '11999999999', email: 'adriana@email.com', birthday: '1990-05-15', totalSpent: 1250.0, lastVisit: '2023-11-20', loyaltyPoints: 450, isVIP: true, status: 'Active', preferences: ['Warm blond', 'Gel nails'], avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format&fit=crop', visitCount: 8 },
  { id: '2', name: 'Beatriz Costa', phone: '11888888888', email: 'beatriz@email.com', birthday: '1985-10-02', totalSpent: 340.0, lastVisit: '2023-12-01', loyaltyPoints: 120, isVIP: false, status: 'Active', preferences: ['Short cut'], avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=150&auto=format&fit=crop', visitCount: 3 },
  { id: '3', name: 'Camila Santos', phone: '11777777777', email: 'camila@email.com', birthday: '1992-03-22', totalSpent: 2100.0, lastVisit: '2023-12-10', loyaltyPoints: 890, isVIP: true, status: 'Inactive', preferences: ['Hydration', 'Red polish'], avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=150&auto=format&fit=crop', visitCount: 10 },
];

export const MOCK_PROFESSIONALS: Professional[] = [
  { id: 'p1', name: 'Luciana M.', role: 'Senior Hair Stylist', commission: 0.5, avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=200&auto=format&fit=crop', rating: 4.9, active: true },
  { id: 'p2', name: 'Mariana G.', role: 'Manicure Master', commission: 0.6, avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=200&auto=format&fit=crop', rating: 4.8, active: true },
  { id: 'p3', name: 'Juliana R.', role: 'Esthetics Expert', commission: 0.5, avatar: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?q=80&w=200&auto=format&fit=crop', rating: 5.0, active: true },
];

export const MOCK_SERVICES: Service[] = [
  { id: 's1', name: 'Premium Haircut', price: 150, duration: 60, category: 'Hair' },
  { id: 's2', name: 'Gel Nails Refill', price: 120, duration: 90, category: 'Nails' },
  { id: 's3', name: 'Botox Capilar', price: 450, duration: 120, category: 'Premium' },
  { id: 's4', name: 'Facial Cleaning', price: 180, duration: 45, category: 'Skin' },
];

export const MOCK_PRODUCTS: Product[] = [
  { id: 'prod1', name: 'Kerastase Shampoo', price: 210, stock: 12, minStock: 5, brand: 'Kerastase' },
  { id: 'prod2', name: 'OPI Polish Red', price: 45, stock: 4, minStock: 6, brand: 'OPI' },
  { id: 'prod3', name: 'Moisturizing Cream', price: 95, stock: 25, minStock: 10, brand: 'LOréal' },
];

export const MOCK_APPOINTMENTS: Appointment[] = [
  // Added missing duration property to satisfy the Appointment interface requirement
  { id: 'a1', clientId: '1', professionalId: 'p1', serviceId: 's1', dateTime: '2023-12-15T10:00:00', duration: 60, status: 'Scheduled', totalPrice: 150 },
  { id: 'a2', clientId: '3', professionalId: 'p2', serviceId: 's2', dateTime: '2023-12-15T11:30:00', duration: 90, status: 'Scheduled', totalPrice: 120 },
];
