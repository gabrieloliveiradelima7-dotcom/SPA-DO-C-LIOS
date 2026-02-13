import React, { useState } from 'react';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Clients from './pages/Clients';
import Marketing from './pages/Marketing';
import Appointments from './pages/Appointments';
import Financial from './pages/Financial';
import Expenses from './pages/Expenses';
import Services from './pages/Services';
import { MOCK_APPOINTMENTS, MOCK_CLIENTS, MOCK_SERVICES } from './constants';
import { Appointment, FinancialRecord, Client, Service } from './types';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [clients, setClients] = useState<Client[]>(MOCK_CLIENTS);
  const [services, setServices] = useState<Service[]>(MOCK_SERVICES);
  const [appointments, setAppointments] = useState<Appointment[]>(
    MOCK_APPOINTMENTS.map(a => ({ 
      ...a, 
      duration: services.find(s => s.id === a.serviceId)?.duration || 60 
    }))
  );
  
  const [financialRecords, setFinancialRecords] = useState<FinancialRecord[]>([
    { id: 'exp1', date: new Date().toISOString().split('T')[0], type: 'Expense', category: 'Aluguel', costType: 'Fixed', amount: 2500, description: 'Aluguel do Salão (Dez)' },
    { id: 'exp2', date: new Date().toISOString().split('T')[0], type: 'Expense', category: 'Internet', costType: 'Fixed', amount: 150, description: 'Fibra Óptica 500mb' }
  ]);

  // Client Management
  const handleAddClient = (client: Client) => setClients(prev => [...prev, client]);
  const handleUpdateClient = (client: Client) => setClients(prev => prev.map(c => c.id === client.id ? client : c));
  const handleDeleteClient = (id: string) => setClients(prev => prev.filter(c => c.id !== id));

  // Service Management
  const handleAddService = (service: Service) => setServices(prev => [...prev, service]);
  const handleUpdateService = (service: Service) => setServices(prev => prev.map(s => s.id === service.id ? service : s));
  const handleDeleteService = (id: string) => setServices(prev => prev.filter(s => s.id !== id));

  // Financial Management
  const handleAddRecord = (record: FinancialRecord) => setFinancialRecords(prev => [...prev, record]);
  const handleUpdateRecord = (record: FinancialRecord) => setFinancialRecords(prev => prev.map(r => r.id === record.id ? record : r));
  const handleDeleteRecord = (id: string) => setFinancialRecords(prev => prev.filter(r => r.id !== id));

  const handleAddAppointment = (newApp: Appointment) => {
    setAppointments(prev => [...prev, newApp]);
  };

  const handleCheckoutAppointment = (updatedApp: Appointment) => {
    setAppointments(prev => prev.map(a => a.id === updatedApp.id ? updatedApp : a));
    
    const finalAmount = updatedApp.totalPrice - (updatedApp.discount || 0);
    const client = clients.find(c => c.id === updatedApp.clientId);
    const service = services.find(s => s.id === updatedApp.serviceId);

    // Only register financial record on checkout
    const newRecord: FinancialRecord = {
      id: `rev-${updatedApp.id}`,
      date: new Date().toISOString().split('T')[0],
      type: 'Income',
      category: 'Serviço',
      amount: finalAmount,
      description: `Checkout: ${service?.name || 'Serviço'} - ${client?.name || 'Cliente'} (${updatedApp.paymentMethod})`
    };
    handleAddRecord(newRecord);

    if (client) {
      const updatedClient: Client = {
        ...client,
        visitCount: (client.visitCount || 0) + 1,
        totalSpent: (client.totalSpent || 0) + finalAmount,
        lastVisit: new Date().toISOString().split('T')[0],
        loyaltyPoints: (client.loyaltyPoints || 0) + Math.floor(finalAmount / 10)
      };
      handleUpdateClient(updatedClient);
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'clients':
        return <Clients clients={clients} onAddClient={handleAddClient} onUpdateClient={handleUpdateClient} onDeleteClient={handleDeleteClient} />;
      case 'marketing':
        return <Marketing />;
      case 'appointments':
        return <Appointments appointments={appointments} clients={clients} services={services} onAddAppointment={handleAddAppointment} onCheckoutAppointment={handleCheckoutAppointment} />;
      case 'expenses':
        return <Expenses records={financialRecords} onAddExpense={handleAddRecord} onUpdateExpense={handleUpdateRecord} onDeleteExpense={handleDeleteRecord} />;
      case 'financial':
        return <Financial records={financialRecords} />;
      case 'services':
        return <Services services={services} onAddService={handleAddService} onUpdateService={handleUpdateService} onDeleteService={handleDeleteService} />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
      {renderContent()}
    </Layout>
  );
};

export default App;