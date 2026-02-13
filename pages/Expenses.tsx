
import React, { useState } from 'react';
import { FinancialRecord } from '../types';
import { Plus, Trash2, Edit2, Filter, Receipt, X, Info } from 'lucide-react';

interface ExpensesProps {
  records: FinancialRecord[];
  onAddExpense: (expense: FinancialRecord) => void;
  onUpdateExpense: (expense: FinancialRecord) => void;
  onDeleteExpense: (id: string) => void;
}

const Expenses: React.FC<ExpensesProps> = ({ records, onAddExpense, onUpdateExpense, onDeleteExpense }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<FinancialRecord | null>(null);
  const [filterType, setFilterType] = useState<'All' | 'Fixed' | 'Variable'>('All');
  
  const [formData, setFormData] = useState<Partial<FinancialRecord>>({
    description: '',
    amount: 0,
    category: 'Produtos',
    costType: 'Variable',
    date: new Date().toISOString().split('T')[0]
  });

  const expenseRecords = records.filter(r => {
    const isExpense = r.type === 'Expense';
    if (filterType === 'All') return isExpense;
    return isExpense && r.costType === filterType;
  });
  
  const handleOpenModal = (expense?: FinancialRecord) => {
    if (expense) {
      setEditingExpense(expense);
      setFormData(expense);
    } else {
      setEditingExpense(null);
      setFormData({
        description: '',
        amount: 0,
        category: 'Produtos',
        costType: 'Variable',
        date: new Date().toISOString().split('T')[0]
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = () => {
    if (!formData.description || !formData.amount) {
      alert("Por favor, preencha a descrição e o valor.");
      return;
    }
    
    if (editingExpense) {
      onUpdateExpense({ ...editingExpense, ...formData } as FinancialRecord);
    } else {
      const newExp: FinancialRecord = {
        ...formData,
        id: Math.random().toString(36).substr(2, 9),
        type: 'Expense',
      } as FinancialRecord;
      onAddExpense(newExp);
    }
    setIsModalOpen(false);
  };

  const categories = ['Aluguel', 'Energia/Água', 'Salários', 'Produtos', 'Marketing', 'Manutenção', 'Internet', 'Impostos', 'Outros'];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-display font-bold text-slate-900">Controle de Gastos</h2>
          <p className="text-slate-500 text-sm">Gerencie seus custos operacionais para manter a saúde do seu salão.</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 px-6 py-2.5 bg-rose-500 text-white rounded-xl hover:bg-rose-600 transition-all font-bold shadow-lg shadow-rose-500/20"
        >
          <Plus size={18} />
          Lançar Despesa
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 rounded-full bg-blue-500"></div>
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Custos Fixos</h3>
          </div>
          <p className="text-2xl font-bold text-slate-900">
            R$ {records.filter(e => e.type === 'Expense' && e.costType === 'Fixed').reduce((acc, c) => acc + c.amount, 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 rounded-full bg-orange-500"></div>
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Custos Variáveis</h3>
          </div>
          <p className="text-2xl font-bold text-slate-900">
            R$ {records.filter(e => e.type === 'Expense' && e.costType === 'Variable').reduce((acc, c) => acc + c.amount, 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
        </div>
        <div className="bg-slate-900 p-6 rounded-2xl shadow-sm text-white">
          <h3 className="text-xs font-bold text-slate-400 uppercase mb-2 tracking-wider">Total em Despesas</h3>
          <p className="text-2xl font-bold">
            R$ {records.filter(e => e.type === 'Expense').reduce((acc, c) => acc + c.amount, 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="p-4 border-b border-slate-100 flex gap-2">
          <button 
            onClick={() => setFilterType('All')}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${filterType === 'All' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
          >
            Tudo
          </button>
          <button 
            onClick={() => setFilterType('Fixed')}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${filterType === 'Fixed' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
          >
            Fixos
          </button>
          <button 
            onClick={() => setFilterType('Variable')}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${filterType === 'Variable' ? 'bg-orange-600 text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
          >
            Variáveis
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Data</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Descrição</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Tipo</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Valor</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {expenseRecords.map((record) => (
                <tr key={record.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 text-sm text-slate-500">{new Date(record.date).toLocaleDateString('pt-BR')}</td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-slate-800">{record.description}</div>
                    <div className="text-[10px] text-slate-400 uppercase font-bold">{record.category}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${record.costType === 'Fixed' ? 'bg-blue-50 text-blue-600 border border-blue-100' : 'bg-orange-50 text-orange-600 border border-orange-100'}`}>
                      {record.costType === 'Fixed' ? 'Custo Fixo' : 'Variável'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right font-bold text-rose-600">
                    - R$ {record.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-1">
                      <button onClick={() => handleOpenModal(record)} className="p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 rounded-lg transition-all" title="Editar">
                        <Edit2 size={16} />
                      </button>
                      <button onClick={() => onDeleteExpense(record.id)} className="p-2 text-rose-300 hover:bg-rose-50 hover:text-rose-600 rounded-lg transition-all" title="Excluir">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {expenseRecords.length === 0 && (
          <div className="py-20 text-center flex flex-col items-center">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
              <Receipt size={32} className="text-slate-200" />
            </div>
            <p className="text-slate-400 text-sm">Nenhuma despesa encontrada para este filtro.</p>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-md rounded-3xl p-8 shadow-2xl animate-in zoom-in duration-300">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-2xl font-display font-bold text-slate-900">
                  {editingExpense ? 'Editar Despesa' : 'Novo Lançamento'}
                </h3>
                <p className="text-xs text-slate-500 mt-1">Defina os detalhes do custo operacional.</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X size={24} />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">O que é este gasto?</label>
                <input 
                  type="text" 
                  placeholder="Ex: Aluguel Dezembro, Reposição de Shampoos..."
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Valor (R$)</label>
                  <input 
                    type="number" 
                    value={formData.amount}
                    onChange={(e) => setFormData({...formData, amount: parseFloat(e.target.value)})}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Vencimento/Pagamento</label>
                  <input 
                    type="date" 
                    value={formData.date}
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-500/20 text-sm outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Classificação</label>
                  <select 
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-500/20 outline-none appearance-none"
                  >
                    {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Natureza do Custo</label>
                <div className="grid grid-cols-2 gap-2">
                  <button 
                    onClick={() => setFormData({...formData, costType: 'Fixed'})}
                    className={`p-3 rounded-xl border text-xs font-bold transition-all ${formData.costType === 'Fixed' ? 'bg-blue-50 border-blue-200 text-blue-700 shadow-inner' : 'bg-white border-slate-200 text-slate-400 hover:border-blue-200'}`}
                  >
                    Custo Fixo
                    <p className="font-normal text-[9px] mt-1 opacity-60">Aluguel, Internet, Salários...</p>
                  </button>
                  <button 
                    onClick={() => setFormData({...formData, costType: 'Variable'})}
                    className={`p-3 rounded-xl border text-xs font-bold transition-all ${formData.costType === 'Variable' ? 'bg-orange-50 border-orange-200 text-orange-700 shadow-inner' : 'bg-white border-slate-200 text-slate-400 hover:border-orange-200'}`}
                  >
                    Custo Variável
                    <p className="font-normal text-[9px] mt-1 opacity-60">Produtos, Manutenção, Comissões...</p>
                  </button>
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
                className="flex-1 px-6 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/10"
              >
                {editingExpense ? 'Atualizar' : 'Salvar Despesa'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Expenses;
