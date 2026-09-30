import React from 'react';
import { motion } from 'framer-motion';
import { RefreshCw } from 'lucide-react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

export default function ModelPredictionComparison({ results, models, onReset }) {
  const modelById = new Map(models.map((model) => [model.id, model]));
  const chartData = results.map((result) => ({
    name: result.model_name,
    score: result.predicted_score,
    color: result.risk_color,
    risk: result.risk_label,
  }));

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-panel rounded-3xl p-5 md:p-8 border border-white/10 space-y-6"
    >
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold text-white">All model predictions</h3>
          <p className="text-sm text-slate-400 mt-1">{results.length} models evaluated with the same input values.</p>
        </div>
        <button
          type="button"
          onClick={onReset}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-white/10"
        >
          <RefreshCw size={14} /> Change inputs
        </button>
      </div>

      <div className="rounded-2xl bg-slate-950/50 border border-white/10 p-3 md:p-5">
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 12, right: 16, left: 0, bottom: 40 }}>
              <CartesianGrid stroke="#334155" strokeDasharray="3 3" />
              <XAxis dataKey="name" stroke="#94a3b8" angle={-15} textAnchor="end" interval={0} height={64} tick={{ fontSize: 11 }} />
              <YAxis domain={[0, 100]} stroke="#94a3b8" tick={{ fontSize: 11 }} />
              <Tooltip
                contentStyle={{ background: '#0f172a', border: '1px solid #334155', borderRadius: 12, color: '#e2e8f0' }}
                formatter={(value, _name, item) => [`${value}/100 · ${item.payload.risk}`, 'Risk index']}
              />
              <Bar dataKey="score" name="Risk index" radius={[8, 8, 0, 0]}>
                {chartData.map((item) => <Cell key={item.name} fill={item.color} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <p className="text-[11px] text-slate-400 text-center px-2">
          Regression models return a numeric score. Classifier categories are mapped to representative risk index values for this shared chart; see each predicted category below.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
        {results.map((result) => {
          const model = modelById.get(result.model_id);
          return (
            <article key={result.model_id} className="rounded-2xl bg-slate-900/70 border border-white/10 p-4 space-y-2">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h4 className="font-bold text-white text-sm">{result.model_name}</h4>
                  <p className="text-[11px] text-slate-400">{model?.algorithm}</p>
                </div>
                <span className="font-mono font-bold text-lg" style={{ color: result.risk_color }}>{result.predicted_score}</span>
              </div>
              <p className="text-xs text-slate-300">{result.risk_label}</p>
              {result.class_label && <p className="text-xs text-slate-400">Predicted class: <span className="text-white">{result.class_label}</span></p>}
            </article>
          );
        })}
      </div>
    </motion.section>
  );
}
