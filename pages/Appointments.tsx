import React, { useState, useEffect } from 'react';
import { Appointment, Client, Professional, Service, PaymentMethod } from '../types';
import { MOCK_PROFESSIONALS } from '../constants';
import { 
  Plus, 
  ChevronLeft, 
  ChevronRight, 
  Clock, 
  User, 
  Scissors, 
  Coffee, 
  Utensils, 
  Ban, 
  X, 
  FileText, 
  CheckCircle, 
  DollarSign, 
  CreditCard, 
  Smartphone, 
  Coins, 
  Gift,
  ArrowRight
} from 'lucide-react';

interface AppointmentsProps {
  appointments: Appointment[];
  clients: Client[];
  services: Service[];
  onAddAppointment: (app: Appointment) => void;
  onCheckoutAppointment: (app: Appointment) => void;
}

const Appointments: React.FC<AppointmentsProps> = ({ appointments, clients, services, onAddAppointment, onCheckoutAppointment }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);

  const [bookingType, setBookingType] = useState<'client' | 'block'>('client');
  const [clientId, setClientId] = useState(clients[0]?.id || '');
  const [proId, setProId] = useState(MOCK_PROFESSIONALS[0].id);
  const [serviceId, setServiceId] = useState(services[0]?.id || '');
  const [selectedHour, setSelectedHour] = useState('09:00');
  const [customDuration, setCustomDuration] = useState(60);
  const [blockType, setBlockType] = useState('Almoço');
  const [notes, setNotes] = useState('');

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('Pix');
  const [discount, setDiscount] = useState(0);

  const hours = Array.from({ length: 15 }, (_, i) => `${String(i + 8).padStart(2, '0')}:00`);

  useEffect(() => {
    if (bookingType === 'client') {
      const s = services.find(s => s.id === serviceId);
      if (s) setCustomDuration(s.duration);
    } else {
        if (blockType === 'Almoço') setCustomDuration(60);
        else if (blockType === 'Café da Tarde') setCustomDuration(30);
        else setCustomDuration(120);
    }
  }, [serviceId, bookingType, blockType, services]);

  const handleAdd = () => {
    let newApp: Appointment;
    if (bookingType === 'client') {
      const service = services.find(s => s.id === serviceId);
      newApp = {
        id: Math.random().toString(36).substr(2, 9),
        clientId,
        professionalId: proId,
        serviceId,
        dateTime: `${selectedDate.toISOString().split('T')[0]}T${selectedHour}:00`,
        duration: customDuration,
        status: 'Scheduled',
        totalPrice: service?.price || 0,
        notes: notes.trim()
      };
    } else {
      newApp = {
        id: Math.random().toString(36).substr(2, 9),
        professionalId: proId,
        blockTitle: blockType,
        dateTime: `${selectedDate.toISOString().split('T')[0]}T${selectedHour}:00`,
        duration: customDuration,
        status: 'Blocked',
        totalPrice: 0,
        notes: notes.trim()
      };
    }
    onAddAppointment(newApp);
    setIsModalOpen(false);
    setBookingType('client');
    setNotes('');
  };

  const handleOpenCheckout = (app: Appointment) => {
    setSelectedAppointment(app);
    setPaymentMethod('Pix');
    setDiscount(0);
    setIsCheckoutModalOpen(true);
  };

  const handleConfirmCheckout = () => {
    if (!selectedAppointment) return;
    const updatedApp: Appointment = {
      ...selectedAppointment,
      status: 'Completed',
      paymentMethod,
      discount
    };
    onCheckoutAppointment(updatedApp);
    setIsCheckoutModalOpen(false);
    setSelectedAppointment(null);
  };

  const getAppointmentsForHour = (hour: string) => {
    return appointments.filter(app => {
      const appDate = new Date(app.dateTime);
      const appHour = `${String(appDate.getHours()).padStart(2, '0')}:00`;
      return appDate.toDateString() === selectedDate.toDateString() && appHour === hour;
    });
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' }).format(date);
  };

  const getBlockIcon = (title: string) => {
    switch (title) {
      case 'Almoço': return <Utensils size={14} />;
      case 'Café da Tarde': return <Coffee size={14} />;
      default: return <Ban size={14} />;
    }
  };

  const paymentMethods: { id: PaymentMethod; icon: any }[] = [
    { id: 'Pix', icon: Smartphone },
    { id: 'Cartão de Crédito', icon: CreditCard },
    { id: 'Cartão de Débito', icon: CreditCard },
    { id: 'Dinheiro', icon: Coins },
    { id: 'Outro', icon: DollarSign },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-1 bg-white p-1 rounded-2xl border border-slate-100 shadow-sm">
          <button 
            onClick={() => setSelectedDate(new Date(selectedDate.setDate(selectedDate.getDate() - 1)))}
            className="p-3 hover:bg-slate-50 rounded-xl text-slate-400 transition-all"
          >
            <ChevronLeft size={20} />
          </button>
          <h2 className="text-sm font-bold text-slate-800 min-w-[180px] text-center uppercase tracking-widest">
            {formatDate(selectedDate)}
          </h2>
          <button 
            onClick={() => setSelectedDate(new Date(selectedDate.setDate(selectedDate.getDate() + 1)))}
            className="p-3 hover:bg-slate-50 rounded-xl text-slate-400 transition-all"
          >
            <ChevronRight size={20} />
          </button>
        </div>
        <button 
          onClick={() => { setNotes(''); setIsModalOpen(true); }}
          className="flex items-center justify-center gap-2 px-8 py-3.5 bg-slate-950 text-white rounded-2xl hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/10 font-bold text-sm tracking-tight"
        >
          <Plus size={18} />
          Novo Horário
        </button>
      </div>

      <div className="bg-white rounded-[32px] border border-slate-100 overflow-hidden shadow-sm">
        <div className="grid grid-cols-1 divide-y divide-slate-50">
          {hours.map((hour) => {
            const apps = getAppointmentsForHour(hour);
            return (
              <div key={hour} className="group flex min-h-[110px] hover:bg-slate-50/30 transition-colors">
                <div className="w-24 p-6 border-r border-slate-50 flex items-start justify-center text-[11px] font-bold text-slate-300 uppercase tracking-widest">
                  {hour}
                </div>
                <div className="flex-1 p-3 space-y-3">
                  {apps.length > 0 ? apps.map(app => (
                    <div key={app.id} className="animate-in fade-in zoom-in-95 duration-300">
                      {app.status === 'Blocked' ? (
                        <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-white border border-slate-200 rounded-lg flex items-center justify-center text-slate-400">
                              {getBlockIcon(app.blockTitle || '')}
                            </div>
                            <span className="text-xs font-bold text-slate-600 uppercase tracking-tight">{app.blockTitle}</span>
                          </div>
                          <span className="text-[10px] font-bold text-slate-400 uppercase">{app.duration} min</span>
                        </div>
                      ) : (
                        <div className={`p-5 rounded-[24px] border transition-all ${app.status === 'Completed' ? 'bg-white border-emerald-100' : 'bg-white border-rose-100'}`}>
                          <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                            <div className="space-y-1">
                              <h4 className="text-sm font-bold text-slate-900 tracking-tight">
                                {clients.find(c => c.id === app.clientId)?.name}
                              </h4>
                              <div className="flex flex-wrap items-center gap-y-1 gap-x-3 text-[11px] font-medium text-slate-400">
                                <span className="flex items-center gap-1.5"><Scissors size={12} className="text-rose-400" /> {services.find(s => s.id === app.serviceId)?.name}</span>
                                <span className="flex items-center gap-1.5"><Clock size={12} /> {app.duration} min</span>
                                <span className="flex items-center gap-1.5"><User size={12} /> {MOCK_PROFESSIONALS.find(p => p.id === app.professionalId)?.name}</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-3 self-end sm:self-center">
                              <div className="text-right mr-2">
                                <p className="text-sm font-bold text-slate-900">R$ {app.totalPrice.toFixed(2)}</p>
                                <p className="text-[9px] font-bold text-slate-300 uppercase tracking-tighter">Valor Bruto</p>
                              </div>
                              {app.status === 'Scheduled' ? (
                                <button 
                                  onClick={() => handleOpenCheckout(app)}
                                  className="flex items-center gap-2 px-5 py-2.5 bg-rose-500 text-white rounded-xl text-xs font-bold transition-all hover:bg-rose-600 shadow-lg shadow-rose-500/20"
                                >
                                  Fechar Comanda
                                </button>
                              ) : (
                                <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-600 rounded-xl text-[10px] font-bold uppercase border border-emerald-100">
                                  <CheckCircle size={14} /> Pago ({app.paymentMethod})
                                </div>
                              )}
                            </div>
                          </div>
                          {app.notes && (
                            <div className="mt-4 pt-4 border-t border-slate-50 flex gap-2 text-xs text-slate-400 italic">
                               <FileText size={14} className="opacity-50" />
                               <span>{app.notes}</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )) : (
                    <button 
                      onClick={() => { setSelectedHour(hour); setNotes(''); setIsModalOpen(true); }}
                      className="w-full h-12 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all text-slate-300 hover:text-rose-400 border-2 border-dashed border-transparent hover:border-slate-100 rounded-2xl"
                    >
                      <Plus size={20} />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Clean Booking Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-lg rounded-[40px] p-10 shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="flex justify-between items-start mb-8">
              <div>
                <h3 className="text-2xl font-bold text-slate-900 tracking-tight">Novo Agendamento</h3>
                <p className="text-sm text-slate-400 mt-1">Configure os detalhes do serviço.</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-2 text-slate-300 hover:text-slate-900 transition-colors"><X size={24} /></button>
            </div>
            
            <div className="flex p-1.5 bg-slate-50 rounded-2xl mb-8">
              <button onClick={() => setBookingType('client')} className={`flex-1 py-3 rounded-xl text-xs font-bold transition-all ${bookingType === 'client' ? 'bg-white text-rose-500 shadow-sm' : 'text-slate-400'}`}>CLIENTE</button>
              <button onClick={() => setBookingType('block')} className={`flex-1 py-3 rounded-xl text-xs font-bold transition-all ${bookingType === 'block' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400'}`}>BLOQUEIO</button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {bookingType === 'client' ? (
                <>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Cliente</label>
                    <select value={clientId} onChange={(e) => setClientId(e.target.value)} className="w-full px-4 py-3.5 bg-slate-50 border-none rounded-2xl text-sm font-medium focus:ring-2 focus:ring-rose-500/20 outline-none transition-all">
                      {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Serviço</label>
                    <select value={serviceId} onChange={(e) => setServiceId(e.target.value)} className="w-full px-4 py-3.5 bg-slate-50 border-none rounded-2xl text-sm font-medium focus:ring-2 focus:ring-rose-500/20 outline-none transition-all">
                      {services.filter(s => s.category !== 'Internal').map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                    </select>
                  </div>
                </>
              ) : (
                <div className="sm:col-span-2 grid grid-cols-3 gap-3">
                    {['Almoço', 'Pausa', 'Folga'].map(t => (
                      <button key={t} onClick={() => setBlockType(t)} className={`py-3 rounded-2xl border text-[11px] font-bold transition-all ${blockType === t ? 'bg-slate-900 text-white border-slate-900' : 'bg-white border-slate-100 text-slate-400 hover:border-slate-200'}`}>{t}</button>
                    ))}
                </div>
              )}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Profissional</label>
                <select value={proId} onChange={(e) => setProId(e.target.value)} className="w-full px-4 py-3.5 bg-slate-50 border-none rounded-2xl text-sm font-medium outline-none">
                  {MOCK_PROFESSIONALS.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Início</label>
                <select value={selectedHour} onChange={(e) => setSelectedHour(e.target.value)} className="w-full px-4 py-3.5 bg-slate-50 border-none rounded-2xl text-sm font-medium outline-none">
                  {hours.map(h => <option key={h} value={h}>{h}</option>)}
                </select>
              </div>
              <div className="sm:col-span-2 space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Duração (minutos)</label>
                <input type="number" step="5" value={customDuration} onChange={(e) => setCustomDuration(parseInt(e.target.value))} className="w-full px-4 py-3.5 bg-slate-50 border-none rounded-2xl text-sm font-medium outline-none" />
              </div>
              <div className="sm:col-span-2 space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Observações Internas</label>
                <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Ex: Preferência por café sem açúcar..." className="w-full p-4 bg-slate-50 border-none rounded-2xl text-sm outline-none resize-none min-h-[100px]" />
              </div>
            </div>

            <div className="flex gap-4 mt-10">
              <button onClick={() => setIsModalOpen(false)} className="flex-1 py-4 border border-slate-100 text-slate-400 rounded-2xl font-bold text-sm hover:bg-slate-50 transition-all">CANCELAR</button>
              <button onClick={handleAdd} className="flex-1 py-4 bg-rose-500 text-white rounded-2xl font-bold text-sm hover:bg-rose-600 shadow-xl shadow-rose-500/20 transition-all">CONFIRMAR</button>
            </div>
          </div>
        </div>
      )}

      {/* Clean Checkout Modal */}
      {isCheckoutModalOpen && selectedAppointment && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4">
          <div className="bg-white w-full max-w-lg rounded-[48px] p-12 animate-in slide-in-from-bottom-8 duration-500">
            <div className="flex justify-between items-start mb-10">
              <div>
                <h3 className="text-3xl font-bold text-slate-900 tracking-tighter">Fechar Comanda</h3>
                <p className="text-sm text-slate-400 mt-2">Revise o valor final e registre o pagamento.</p>
              </div>
              <button onClick={() => setIsCheckoutModalOpen(false)} className="text-slate-300 hover:text-slate-900"><X size={32} /></button>
            </div>

            <div className="bg-slate-50 rounded-[32px] p-8 mb-10 space-y-6">
                <div className="flex justify-between">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Cliente</span>
                    <span className="text-sm font-bold text-slate-900">{clients.find(c => c.id === selectedAppointment.clientId)?.name}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Serviço</span>
                    <span className="text-sm font-bold text-slate-900">{services.find(s => s.id === selectedAppointment.serviceId)?.name}</span>
                </div>
                <div className="pt-6 border-t border-slate-200 flex justify-between items-baseline">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Total Bruto</span>
                    <span className="text-2xl font-bold text-slate-900 tracking-tight">R$ {selectedAppointment.totalPrice.toFixed(2)}</span>
                </div>
            </div>

            <div className="space-y-8">
              <div className="space-y-4">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Forma de Pagamento</label>
                <div className="flex flex-wrap gap-2">
                    {paymentMethods.map((pm) => (
                        <button
                            key={pm.id}
                            onClick={() => setPaymentMethod(pm.id)}
                            className={`flex items-center gap-2.5 px-5 py-3 rounded-2xl border text-xs font-bold transition-all ${paymentMethod === pm.id ? 'bg-slate-900 text-white border-slate-900 shadow-xl' : 'bg-white border-slate-100 text-slate-400 hover:border-slate-200'}`}
                        >
                            <pm.icon size={16} />
                            {pm.id}
                        </button>
                    ))}
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Desconto Aplicado</label>
                    <span className="text-[10px] font-bold text-rose-500 uppercase">- R$ {discount.toFixed(2)}</span>
                </div>
                <input 
                    type="number" 
                    value={discount}
                    onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)}
                    placeholder="0,00"
                    className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-emerald-500/20 outline-none font-bold text-slate-900"
                />
              </div>

              <div className="bg-emerald-500 rounded-[32px] p-8 text-white flex justify-between items-center shadow-2xl shadow-emerald-500/20">
                  <div>
                      <p className="text-[10px] font-bold uppercase opacity-80 mb-1">Total Final</p>
                      <p className="text-4xl font-bold tracking-tighter">R$ {(selectedAppointment.totalPrice - discount).toFixed(2)}</p>
                  </div>
                  <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center">
                    <CheckCircle size={28} />
                  </div>
              </div>
            </div>

            <button 
                onClick={handleConfirmCheckout}
                className="w-full mt-10 py-5 bg-slate-950 text-white rounded-[24px] font-bold text-base hover:bg-slate-800 transition-all flex items-center justify-center gap-3 shadow-2xl shadow-slate-900/20"
            >
                Confirmar Pagamento <ArrowRight size={20} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Appointments;