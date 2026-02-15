
import React, { useState } from 'react';
import { Service } from '../types';
import { Plus, Edit2, Trash2, X, Scissors, Clock, DollarSign, Tag } from 'lucide-react';

interface ServicesProps {
  services: Service[];
  onAddService: (service: Service) => void;
  onUpdateService: (service: Service) => void;
  onDeleteService: (id: string) => void;
}

const Services: React.FC<ServicesProps> = ({ services, onAddService, onUpdateService, onDeleteService }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);

  const [formData, setFormData] = useState<Partial<Service>>({
    name: '',
    price: 0,
    duration: 60,
    category: 'Hair'
  });

  const handleOpenModal = (service?: Service) => {
    if (service) {
      setEditingService(service);
      setFormData(service);
    } else {
      setEditingService(null);
      setFormData({ name: '', price: 0, duration: 60, category: 'Hair' });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = () => {
    if (!formData.name || formData.price === undefined) {
      alert("Nome e preço são obrigatórios.");
      return;
    }

    if (editingService) {
      onUpdateService({ ...editingService, ...formData } as Service);
    } else {
      onAddService({
        ...formData,
        id: Math.random().toString(36).substr(2, 9),
      } as Service);
    }
    setIsModalOpen(false);
  };

  const categories: Service['category'][] = ['Hair', 'Nails', 'Skin', 'Premium'];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-display font-bold text-slate-900">Catálogo de Serviços</h2>
          <p className="text-slate-500 text-sm">Gerencie o que o SPA DO CÍLIOS oferece às clientes.</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 px-6 py-2.5 bg-rose-500 text-white rounded-xl hover:bg-rose-600 transition-all font-bold shadow-lg shadow-rose-500/20"
        >
          <Plus size={18} />
          Novo Serviço
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.filter(s => s.category !== 'Internal').map((service) => (
          <div key={service.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all group">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-rose-50 text-rose-500 rounded-xl group-hover:scale-110 transition-transform">
                <Scissors size={24} />
              </div>
              <div className="flex gap-1">
                <button onClick={() => handleOpenModal(service)} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
                  <Edit2 size={16} />
                </button>
                <button onClick={() => { if(confirm('Excluir serviço?')) onDeleteService(service.id) }} className="p-2 text-rose-300 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
            
            <h3 className="text-lg font-bold text-slate-900 mb-1">{service.name}</h3>
            <span className="inline-block px-2 py-0.5 bg-slate-100 text-slate-500 text-[10px] font-bold uppercase rounded mb-4 tracking-wider">
              {service.category}
            </span>

            <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-50">
              <div className="flex items-center gap-1.5 text-slate-500 text-sm">
                <Clock size={14} className="text-slate-400" />
                {service.duration} min
              </div>
              <div className="text-rose-600 font-bold text-lg">
                R$ {service.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </div>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-md rounded-3xl p-8 shadow-2xl animate-in zoom-in duration-300">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-display font-bold text-slate-900">
                {editingService ? 'Editar Serviço' : 'Novo Serviço'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                <X size={24} />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                  <Tag size={10} /> Nome do Serviço
                </label>
                <input 
                  type="text" 
                  value={formData.name}
                  placeholder="Ex: Extensão de Cílios Volume Russo"
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-500/20 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                    <DollarSign size={10} /> Preço (R$)
                  </label>
                  <input 
                    type="number" 
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: parseFloat(e.target.value)})}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-500/20 outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                    <Clock size={10} /> Duração Base (min)
                  </label>
                  <input 
                    type="number" 
                    value={formData.duration}
                    onChange={(e) => setFormData({...formData, duration: parseInt(e.target.value)})}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-500/20 outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Categoria</label>
                <div className="grid grid-cols-2 gap-2">
                  {categories.map(cat => (
                    <button 
                      key={cat}
                      onClick={() => setFormData({...formData, category: cat})}
                      className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all ${formData.category === cat ? 'bg-slate-900 text-white border-slate-900' : 'bg-white border-slate-200 text-slate-500 hover:border-rose-200'}`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-8">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="flex-1 px-6 py-3 border border-slate-200 text-slate-600 rounded-xl font-bold hover:bg-slate-50 transition-colors"
              >
                Cancelar
              </button>
              <button 
                onClick={handleSubmit}
                className="flex-1 px-6 py-3 bg-rose-500 text-white rounded-xl font-bold hover:bg-rose-600 transition-all shadow-lg"
              >
                {editingService ? 'Atualizar' : 'Salvar Serviço'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Services;
