
import React, { useState } from 'react';
import { FinancialRecord } from '../types';
import { 
  ArrowUpCircle, 
  ArrowDownCircle, 
  Wallet,
  TrendingUp,
  Filter,
  Download,
  CalendarDays
} from 'lucide-react';

interface FinancialProps {
  records: FinancialRecord[];
}

type TimePeriod = 'Today' | 'Week' | 'Month';

const Financial: React.FC<FinancialProps> = ({ records }) => {
  const [period, setPeriod] = useState<TimePeriod>('Month');
  const now = new Date();

  const getWeekStart = (date: Date) => {
    const d = new Date(date);
    const day = d.getDay(), diff = d.getDate() - day + (day === 0 ? -6 : 1);
    const start = new Date(d.setDate(diff));
    start.setHours(0,0,0,0);
    return start;
  };

  const isInPeriod = (dateStr: string) => {
    const date = new Date(dateStr);
    if (period === 'Today') {
      return date.toDateString() === now.toDateString();
    }
    if (period === 'Week') {
      const weekStart = getWeekStart(now);
      return date >= weekStart;
    }
    if (period === 'Month') {
      return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
    }
    return false;
  };

  const periodRecords = records.filter(r => isInPeriod(r.date));
  
  const incomeTotal = periodRecords
    .filter(r => r.type === 'Income')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const expenseTotal = periodRecords
    .filter(r => r.type === 'Expense')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const profit = incomeTotal - expenseTotal;

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-3">
          <CalendarDays className="text-rose-500" size={20} />
          <span className="text-sm font-bold text-slate-700">Resumo por período:</span>
        </div>
        <div className="flex p-1 bg-slate-100 rounded-xl">
          <button 
            onClick={() => setPeriod('Today')}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${period === 'Today' ? 'bg-white text-rose-500 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            Hoje
          </button>
          <button 
            onClick={() => setPeriod('Week')}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${period === 'Week' ? 'bg-white text-rose-500 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            Semana
          </button>
          <button 
            onClick={() => setPeriod('Month')}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${period === 'Month' ? 'bg-white text-rose-500 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            Mês
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:border-emerald-200 transition-colors group">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl group-hover:scale-110 transition-transform">
              <ArrowUpCircle size={24} />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">Faturado</span>
          </div>
          <h3 className="text-slate-500 text-sm font-medium">Entradas Totais</h3>
          <p className="text-3xl font-bold text-slate-900 mt-1">{formatCurrency(incomeTotal)}</p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:border-rose-200 transition-colors group">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2.5 bg-rose-50 text-rose-600 rounded-xl group-hover:scale-110 transition-transform">
              <ArrowDownCircle size={24} />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-rose-600 bg-rose-50 px-2 py-0.5 rounded">Gasto</span>
          </div>
          <h3 className="text-slate-500 text-sm font-medium">Saídas Totais</h3>
          <p className="text-3xl font-bold text-slate-900 mt-1">{formatCurrency(expenseTotal)}</p>
        </div>

        <div className={`p-6 rounded-3xl shadow-xl transition-all group ${profit >= 0 ? 'bg-slate-900 text-white' : 'bg-rose-900 text-white'}`}>
          <div className="flex justify-between items-start mb-4">
            <div className="p-2.5 bg-white/10 rounded-xl group-hover:scale-110 transition-transform">
              <Wallet size={24} />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-widest bg-white/10 px-2 py-0.5 rounded">Margem Real</span>
          </div>
          <h3 className="text-white/60 text-sm font-medium">Lucro Líquido</h3>
          <p className="text-3xl font-bold mt-1">{formatCurrency(profit)}</p>
          <div className="mt-4 flex items-center gap-2">
            <div className={`w-full h-1.5 bg-white/10 rounded-full overflow-hidden`}>
              <div 
                className="h-full bg-rose-400 transition-all duration-1000" 
                style={{ width: `${Math.min(100, (expenseTotal / (incomeTotal || 1)) * 100)}%` }}
              ></div>
            </div>
            <span className="text-[10px] font-bold text-white/40">Despesas</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <TrendingUp size={20} className="text-slate-400" />
            <h3 className="text-lg font-bold text-slate-800">Fluxo Detalhado ({period === 'Today' ? 'Hoje' : period === 'Week' ? 'Semana' : 'Mês'})</h3>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-slate-50 text-slate-600 rounded-xl hover:bg-slate-100 transition-colors text-sm font-bold">
            <Download size={18} />
            Baixar Relatório
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Data</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Natureza</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Categoria</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Valor</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {periodRecords.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map((record) => (
                <tr key={record.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 text-sm text-slate-500">
                    {new Date(record.date).toLocaleDateString('pt-BR')}
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-medium text-slate-800 line-clamp-1">{record.description}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-0.5 text-[10px] font-bold uppercase rounded-md ${
                      record.type === 'Income' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                    }`}>
                      {record.category}
                    </span>
                  </td>
                  <td className={`px-6 py-4 text-right font-bold ${record.type === 'Income' ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {record.type === 'Income' ? '+' : '-'} {formatCurrency(record.amount)}
                  </td>
                </tr>
              ))}
              {periodRecords.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-20 text-center flex flex-col items-center">
                    <CalendarDays size={32} className="text-slate-200 mb-2" />
                    <p className="text-slate-400 text-sm italic">Nenhum registro para este período.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Financial;
