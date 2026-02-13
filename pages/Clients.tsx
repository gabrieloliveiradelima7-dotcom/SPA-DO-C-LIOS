import React, { useState } from 'react';
import { Client } from '../types';
import { Search, Plus, Crown, Mail, Phone, Edit2, Trash2, X, UserCheck, UserMinus, Camera, Image as ImageIcon, Sparkles, Gift, CheckCircle2, Hash } from 'lucide-react';

interface ClientsProps {
  clients: Client[];
  onAddClient: (client: Client) => void;
  onUpdateClient: (client: Client) => void;
  onDeleteClient: (id: string) => void;
}

const Clients: React.FC<ClientsProps> = ({ clients, onAddClient, onUpdateClient, onDeleteClient }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Active' | 'Inactive'>('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);

  const [formData, setFormData] = useState<Partial<Client>>({
    name: '',
    phone: '',
    email: '',
    birthday: '',
    isVIP: false,
    status: 'Active',
    avatar: '',
    preferences: [],
    visitCount: 0
  });

  const filteredClients = clients.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase()) || c.phone.includes(searchTerm);
    const matchesStatus = statusFilter === 'All' || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleOpenModal = (client?: Client) => {
    if (client) {
      setEditingClient(client);
      setFormData(client);
    } else {
      setEditingClient(null);
      setFormData({
        name: '', phone: '', email: '', birthday: '', isVIP: false, status: 'Active', avatar: '', preferences: [], visitCount: 0
      });
    }
    setIsModalOpen(true);
  };

  const handleAddVisit = (client: Client) => {
    onUpdateClient({ ...client, visitCount: (client.visitCount || 0) + 1 });
  };

  const handleSubmit = () => {
    if (!formData.name || !formData.phone) {
      alert("Campos obrigatórios: Nome e Telefone.");
      return;
    }
    if (editingClient) onUpdateClient({ ...editingClient, ...formData } as Client);
    else {
      onAddClient({
        ...formData,
        id: Math.random().toString(36).substr(2, 9),
        totalSpent: 0,
        lastVisit: 'Recente',
        loyaltyPoints: 0,
        visitCount: formData.visitCount || 0,
        preferences: formData.preferences || []
      } as Client);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div className="relative w-full lg:max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
          <input 
            type="text" 
            placeholder="Pesquisar por nome ou celular..." 
            className="w-full pl-12 pr-4 py-4 bg-white border border-slate-100 rounded-[20px] focus:outline-none focus:ring-4 focus:ring-slate-50 transition-all shadow-sm text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-3 w-full lg:w-auto">
          <div className="flex p-1 bg-white border border-slate-100 rounded-2xl shadow-sm">
            {['All', 'Active', 'Inactive'].map((f) => (
              <button 
                key={f}
                onClick={() => setStatusFilter(f as any)}
                className={`px-5 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${statusFilter === f ? 'bg-slate-950 text-white' : 'text-slate-400 hover:text-slate-600'}`}
              >
                {f === 'All' ? 'Todos' : f === 'Active' ? 'Ativas' : 'Inativas'}
              </button>
            ))}
          </div>
          <button 
            onClick={() => handleOpenModal()}
            className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-8 py-4 bg-rose-500 text-white rounded-[20px] hover:bg-rose-600 transition-all shadow-xl shadow-rose-500/10 font-bold text-sm tracking-tight"
          >
            <Plus size={18} /> Novo Cliente
          </button>
        </div>
      </div>

      <div className="bg-white border border-slate-100 rounded-[32px] overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50/50 border-b border-slate-50">
              <tr>
                <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Cliente</th>
                <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">Fidelidade</th>
                <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredClients.map((client) => {
                const visits = client.visitCount || 0;
                return (
                  <tr key={client.id} className="group hover:bg-slate-50/30 transition-colors">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="relative">
                          {client.avatar ? (
                            <img src={client.avatar} className="w-12 h-12 rounded-full object-cover grayscale hover:grayscale-0 transition-all border border-slate-100" />
                          ) : (
                            <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 font-bold text-xs">{client.name[0]}</div>
                          )}
                          {client.isVIP && <div className="absolute -top-1 -right-1 bg-amber-400 p-1 rounded-full border-2 border-white"><Crown size={8} className="text-white fill-white" /></div>}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900 tracking-tight">{client.name}</p>
                          <p className="text-xs text-slate-400 font-medium">{client.phone}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex flex-col items-center gap-3">
                        <div className="flex gap-1">
                          {Array.from({ length: 10 }).map((_, idx) => (
                            <div key={idx} className={`w-1.5 h-1.5 rounded-full ${idx < visits ? 'bg-rose-500' : 'bg-slate-100'}`} />
                          ))}
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-[10px] font-bold text-slate-300 uppercase">{visits}/10</span>
                          {visits >= 10 ? (
                            <button className="flex items-center gap-2 px-3 py-1 bg-emerald-500 text-white text-[9px] font-bold rounded-full shadow-lg shadow-emerald-200">
                               <Gift size={10} /> RESGATAR
                            </button>
                          ) : (
                            <button onClick={() => handleAddVisit(client)} className="p-1.5 text-slate-300 hover:text-rose-500 transition-colors"><CheckCircle2 size={16} /></button>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => handleOpenModal(client)} className="p-2.5 bg-slate-50 text-slate-400 hover:text-slate-900 rounded-xl transition-all"><Edit2 size={16} /></button>
                        <button onClick={() => { if(confirm('Excluir?')) onDeleteClient(client.id) }} className="p-2.5 bg-rose-50 text-rose-300 hover:text-rose-600 rounded-xl transition-all"><Trash2 size={16} /></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Simplified Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/40 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-md rounded-[40px] p-10 shadow-2xl animate-in zoom-in-95 duration-300">
            <h3 className="text-2xl font-bold text-slate-900 tracking-tighter mb-8">{editingClient ? 'Editar Cliente' : 'Novo Cliente'}</h3>
            <div className="space-y-5">
               <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Nome</label>
                  <input value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full p-4 bg-slate-50 rounded-2xl text-sm border-none outline-none focus:ring-2 focus:ring-slate-100 transition-all" />
               </div>
               <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Celular</label>
                  <input value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className="w-full p-4 bg-slate-50 rounded-2xl text-sm border-none outline-none focus:ring-2 focus:ring-slate-100 transition-all" />
               </div>
               <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl">
                     <input type="checkbox" checked={formData.isVIP} onChange={(e) => setFormData({...formData, isVIP: e.target.checked})} className="w-5 h-5 accent-slate-900" />
                     <span className="text-xs font-bold text-slate-700">VIP</span>
                  </div>
                  <select value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value as any})} className="bg-slate-50 p-4 rounded-2xl text-xs font-bold uppercase border-none outline-none">
                     <option value="Active">Ativa</option>
                     <option value="Inactive">Inativa</option>
                  </select>
               </div>
            </div>
            <div className="flex gap-4 mt-10">
               <button onClick={() => setIsModalOpen(false)} className="flex-1 py-4 text-slate-400 font-bold text-xs uppercase tracking-widest">Fechar</button>
               <button onClick={handleSubmit} className="flex-1 py-4 bg-slate-950 text-white rounded-2xl font-bold text-xs uppercase tracking-widest shadow-xl shadow-slate-900/10">Salvar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Clients;