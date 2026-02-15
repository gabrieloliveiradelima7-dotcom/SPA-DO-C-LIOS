import React, { useEffect, useState } from 'react';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Clients from './pages/Clients';
import Marketing from './pages/Marketing';
import Appointments from './pages/Appointments';
import Financial from './pages/Financial';
import Expenses from './pages/Expenses';
import Services from './pages/Services';
import { Appointment, FinancialRecord, Client, Service, Professional } from './types';
import { api } from './services/api';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [clients, setClients] = useState<Client[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [financialRecords, setFinancialRecords] = useState<FinancialRecord[]>([]);

  useEffect(() => {
    const load = async () => {
      const [clientsData, servicesData, appointmentsData, professionalsData, financialData] = await Promise.all([
        api.clients.list(),
        api.services.list(),
        api.appointments.list(),
        api.professionals.list(),
        api.financialRecords.list(),
      ]);
      setClients(clientsData);
      setServices(servicesData);
      setAppointments(appointmentsData);
      setProfessionals(professionalsData);
      setFinancialRecords(financialData);
    };

    load().catch((error) => {
      console.error('Erro ao carregar dados iniciais:', error);
      alert('Não foi possível carregar os dados da API.');
    });
  }, []);

  const handleAddClient = async (client: Client) => {
    const created = await api.clients.create(client);
    setClients((prev) => [...prev, created]);
  };

  const handleUpdateClient = async (client: Client) => {
    const updated = await api.clients.update(client.id, client);
    setClients((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
  };

  const handleDeleteClient = async (id: string) => {
    await api.clients.remove(id);
    setClients((prev) => prev.filter((c) => c.id !== id));
  };

  const handleAddService = async (service: Service) => {
    const created = await api.services.create(service);
    setServices((prev) => [...prev, created]);
  };

  const handleUpdateService = async (service: Service) => {
    const updated = await api.services.update(service.id, service);
    setServices((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
  };

  const handleDeleteService = async (id: string) => {
    await api.services.remove(id);
    setServices((prev) => prev.filter((s) => s.id !== id));
  };

  const handleAddRecord = async (record: FinancialRecord) => {
    const created = await api.financialRecords.create(record);
    setFinancialRecords((prev) => [...prev, created]);
  };

  const handleUpdateRecord = async (record: FinancialRecord) => {
    const updated = await api.financialRecords.update(record.id, record);
    setFinancialRecords((prev) => prev.map((r) => (r.id === updated.id ? updated : r)));
  };

  const handleDeleteRecord = async (id: string) => {
    await api.financialRecords.remove(id);
    setFinancialRecords((prev) => prev.filter((r) => r.id !== id));
  };

  const handleAddAppointment = async (newApp: Appointment) => {
    const created = await api.appointments.create(newApp);
    setAppointments((prev) => [...prev, created]);
  };

  const handleCheckoutAppointment = async (updatedApp: Appointment) => {
    const updated = await api.appointments.update(updatedApp.id, updatedApp);
    setAppointments((prev) => prev.map((a) => (a.id === updated.id ? updated : a)));
    const freshFinancial = await api.financialRecords.list();
    const freshClients = await api.clients.list();
    setFinancialRecords(freshFinancial);
    setClients(freshClients);
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
        return (
          <Appointments
            appointments={appointments}
            clients={clients}
            services={services}
            professionals={professionals}
            onAddAppointment={handleAddAppointment}
            onCheckoutAppointment={handleCheckoutAppointment}
          />
        );
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

  return <Layout activeTab={activeTab} setActiveTab={setActiveTab}>{renderContent()}</Layout>;
};

export default App;
