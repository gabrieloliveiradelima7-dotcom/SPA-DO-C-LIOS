import React, { useState } from 'react';
import { Sparkles, MessageSquare, Send, Copy, RefreshCw } from 'lucide-react';
import { api } from '../services/api';

const Marketing: React.FC = () => {
  const [clientName, setClientName] = useState('Adriana Silva');
  const [service, setService] = useState('Coloração');
  const [type, setType] = useState<'loyalty' | 're-engagement' | 'birthday'>('loyalty');
  const [generatedText, setGeneratedText] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const result = await api.ai.marketingMessage({ clientName, recentService: service, promoType: type });
      setGeneratedText(result.text || '');
    } catch {
      setGeneratedText('Falha ao gerar mensagem. Verifique a API do backend.');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedText);
    alert('Texto copiado!');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-8 rounded-3xl text-white relative overflow-hidden shadow-xl shadow-slate-200">
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="text-rose-400" />
            <h2 className="text-2xl font-display font-bold">Marketing Inteligente (AI)</h2>
          </div>
          <p className="text-slate-300 text-sm max-w-lg mb-8">
            Utilize nossa inteligência artificial para criar mensagens personalizadas e elegantes para o SPA DO CÍLIOS. Aumente sua retenção de clientes em até 30% com comunicação assertiva.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-400 uppercase">Nome da Cliente</label>
              <input
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-400 uppercase">Serviço Recente</label>
              <input
                value={service}
                onChange={(e) => setService(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-400 uppercase">Objetivo</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as any)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-rose-500 appearance-none"
              >
                <option value="loyalty">Fidelização (Pós-serviço)</option>
                <option value="re-engagement">Reativação (30 dias+)</option>
                <option value="birthday">Aniversário</option>
              </select>
            </div>
          </div>

          <button
            onClick={handleGenerate}
            disabled={loading}
            className="mt-8 flex items-center justify-center gap-2 px-8 py-3 bg-rose-500 hover:bg-rose-600 text-white rounded-xl font-bold transition-all disabled:opacity-50"
          >
            {loading ? <RefreshCw className="animate-spin" /> : <Sparkles size={18} />}
            {loading ? 'Pensando...' : 'Gerar Campanha com AI'}
          </button>
        </div>

        <div className="absolute top-0 right-0 w-64 h-64 bg-rose-500/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -ml-32 -mb-32"></div>
      </div>

      {generatedText && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm animate-in slide-in-from-top-2 duration-300">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2 text-slate-800 font-semibold">
              <MessageSquare size={18} className="text-rose-500" />
              Resultado da Sugestão
            </div>
            <div className="flex gap-2">
              <button
                onClick={copyToClipboard}
                className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors"
                title="Copiar texto"
              >
                <Copy size={18} />
              </button>
              <button className="flex items-center gap-2 px-4 py-1.5 bg-emerald-50 text-emerald-700 rounded-lg text-sm font-semibold hover:bg-emerald-100 transition-colors">
                <Send size={14} />
                WhatsApp
              </button>
            </div>
          </div>
          <div className="p-6 bg-slate-50 rounded-xl border border-slate-100 text-slate-700 leading-relaxed italic">"{generatedText}"</div>
          <p className="mt-4 text-[10px] text-slate-400 uppercase tracking-widest text-center">Gerado via API no backend</p>
        </div>
      )}
    </div>
  );
};

export default Marketing;
