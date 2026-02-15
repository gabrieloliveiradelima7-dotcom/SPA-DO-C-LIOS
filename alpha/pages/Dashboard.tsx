import React from 'react';
import { 
  TrendingUp, 
  Users, 
  ShoppingBag, 
  Clock, 
  ArrowUpRight, 
  ArrowDownRight 
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  BarChart, 
  Bar 
} from 'recharts';

const data = [
  { name: 'Seg', revenue: 2400, appointments: 12 },
  { name: 'Ter', revenue: 1398, appointments: 8 },
  { name: 'Qua', revenue: 9800, appointments: 22 },
  { name: 'Qui', revenue: 3908, appointments: 15 },
  { name: 'Sex', revenue: 4800, appointments: 18 },
  { name: 'Sáb', revenue: 13000, appointments: 35 },
  { name: 'Dom', revenue: 0, appointments: 0 },
];

const KPICard = ({ title, value, trend, icon: Icon, trendUp }: any) => (
  <div className="bg-white p-7 rounded-[24px] border border-slate-100 shadow-sm transition-all hover:shadow-md hover:translate-y-[-2px]">
    <div className="flex justify-between items-start mb-5">
      <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-600">
        <Icon size={20} />
      </div>
      <div className={`flex items-center text-[11px] font-bold px-2 py-1 rounded-full ${trendUp ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
        {trend}
        {trendUp ? <ArrowUpRight size={14} className="ml-0.5" /> : <ArrowDownRight size={14} className="ml-0.5" />}
      </div>
    </div>
    <h3 className="text-slate-400 text-xs font-bold uppercase tracking-wider">{title}</h3>
    <p className="text-2xl font-bold text-slate-900 mt-1 tracking-tight">{value}</p>
  </div>
);

const Dashboard: React.FC = () => {
  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-2 duration-500">
      {/* KPI Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard title="Faturamento" value="R$ 32.450" trend="+12.5%" icon={TrendingUp} trendUp={true} />
        <KPICard title="Clientes" value="248" trend="+4.2%" icon={Users} trendUp={true} />
        <KPICard title="Ticket Médio" value="R$ 184" trend="-2.1%" icon={ShoppingBag} trendUp={false} />
        <KPICard title="Ocupação" value="84%" trend="+8.0%" icon={Clock} trendUp={true} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Revenue Chart */}
        <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm">
          <h3 className="text-base font-bold text-slate-800 mb-8 tracking-tight">Desempenho da Semana</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="0 0" vertical={false} stroke="#f8fafc" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 11, fontWeight: 600}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 11, fontWeight: 600}} dx={-10} />
                <Tooltip 
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', padding: '12px' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#f43f5e" 
                  strokeWidth={3} 
                  dot={false}
                  activeDot={{ r: 6, fill: '#f43f5e', strokeWidth: 4, stroke: '#fff' }} 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Appointments Bar Chart */}
        <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm">
          <h3 className="text-base font-bold text-slate-800 mb-8 tracking-tight">Volume de Atendimentos</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="0 0" vertical={false} stroke="#f8fafc" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 11, fontWeight: 600}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 11, fontWeight: 600}} dx={-10} />
                <Tooltip 
                   contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', padding: '12px' }}
                />
                <Bar dataKey="appointments" fill="#E2E8F0" radius={[10, 10, 10, 10]} barSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Simplified Alerts */}
      <div className="bg-slate-50 p-8 rounded-[32px] border border-dashed border-slate-200">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">Sugestões e Alertas</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-slate-100">
            <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            <p className="text-xs text-slate-600 font-medium">Estoque baixo detectado em: <span className="font-bold text-slate-900 uppercase">Shampoo Kerastase</span></p>
          </div>
          <div className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-slate-100">
            <div className="w-1.5 h-1.5 rounded-full bg-rose-500" />
            <p className="text-xs text-slate-600 font-medium">Aniversário VIP em breve: <span className="font-bold text-slate-900 uppercase">Adriana Silva</span></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;