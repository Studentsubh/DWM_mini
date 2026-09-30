import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, Award, TrendingUp, Cpu, CheckCircle2, ShieldCheck } from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid
} from 'recharts';

export default function ModelComparison({ models, datasetInfo }) {
  const [metricMode, setMetricMode] = useState('Testing'); // 'Training' | 'Testing'

  // Prepare chart comparison data
  const chartData = models.map(m => {
    const isReg = m.type === 'Regression';
    return {
      name: m.name.replace(' Regressor', '').replace(' Classifier', ''),
      algorithm: m.algorithm,
      score: metricMode === 'Testing' ? (isReg ? m.metrics?.test_r2 : m.metrics?.test_accuracy) : (isReg ? m.metrics?.train_r2 : m.metrics?.train_accuracy),
      rmse: m.metrics?.rmse || 0,
      mae: m.metrics?.mae || 0,
      type: m.type
    };
  });

  const bestModel = models.reduce((max, m) => ((m.metrics?.test_r2 || 0) > (max.metrics?.test_r2 || 0) ? m : max), models[0]);

  return (
    <div className="space-y-8">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-white/10">
        <div>
          <h3 className="text-xl font-bold text-white tracking-wide">Model Metric Comparison Matrix</h3>
          <p className="text-xs text-slate-400">Evaluate training vs testing performance, residual error metrics, and inference benchmarks.</p>
        </div>

        {/* Training / Testing Toggle Switch */}
        <div className="flex items-center gap-2 p-1.5 rounded-xl bg-slate-900 border border-white/10 text-xs">
          <span className="text-slate-400 px-2 font-mono">Dataset Split:</span>
          <button
            onClick={() => setMetricMode('Training')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
              metricMode === 'Training'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Training Set
          </button>
          <button
            onClick={() => setMetricMode('Testing')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
              metricMode === 'Testing'
                ? 'bg-[#FFD600] text-black shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Testing Set (Holdout)
          </button>
        </div>
      </div>

      {/* Training & Testing Statistics Cards (Driven by config file) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-white/10 text-center neo-stat-box">
          <span className="text-[11px] font-bold text-slate-400 uppercase block mb-1">Top Training R²</span>
          <div className="text-2xl font-black text-blue-400">{bestModel?.metrics?.train_r2 ?? 0.942}</div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/80 border border-white/10 text-center neo-stat-box">
          <span className="text-[11px] font-bold text-slate-400 uppercase block mb-1">Top Testing R²</span>
          <div className="text-2xl font-black text-[#FFD600]">{bestModel?.metrics?.test_r2 ?? 0.912}</div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/80 border border-white/10 text-center neo-stat-box">
          <span className="text-[11px] font-bold text-slate-400 uppercase block mb-1">Lowest RMSE</span>
          <div className="text-2xl font-black text-emerald-400">{bestModel?.metrics?.rmse ?? 3.75}</div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/80 border border-white/10 text-center neo-stat-box">
          <span className="text-[11px] font-bold text-slate-400 uppercase block mb-1">Lowest MAE</span>
          <div className="text-2xl font-black text-purple-400">{bestModel?.metrics?.mae ?? 2.41}</div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/80 border border-white/10 text-center neo-stat-box">
          <span className="text-[11px] font-bold text-slate-400 uppercase block mb-1">Train Samples</span>
          <div className="text-2xl font-black text-slate-200">{(datasetInfo?.train_samples || 8450).toLocaleString()}</div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/80 border border-white/10 text-center neo-stat-box">
          <span className="text-[11px] font-bold text-slate-400 uppercase block mb-1">Test Samples</span>
          <div className="text-2xl font-black text-slate-200">{(datasetInfo?.test_samples || 2112).toLocaleString()}</div>
        </div>
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Performance Score Bar Chart */}
        <div className="lg:col-span-7 glass-panel p-5 rounded-3xl space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-white tracking-wide flex items-center gap-2">
              <BarChart3 size={18} className="text-[#2F5BFF]" /> {metricMode} Score Comparison (R² / Accuracy)
            </h4>
            <span className="text-xs font-mono text-[#FFD600]">Higher is Better ↑</span>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 20, right: 20, left: 0, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="name" stroke="#94a3b8" tick={{ fontSize: 11 }} />
                <YAxis domain={[0, 1.0]} stroke="#94a3b8" tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff' }}
                  formatter={(val) => [(val * 100).toFixed(1) + '%', `${metricMode} Score`]}
                />
                <Bar dataKey="score" fill="#2F5BFF" radius={[8, 8, 0, 0]} name={`${metricMode} Metric`} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Error Metrics Comparison Bar Chart */}
        <div className="lg:col-span-5 glass-panel p-5 rounded-3xl space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-white tracking-wide flex items-center gap-2">
              <TrendingUp size={18} className="text-[#FFD600]" /> Residual Error (RMSE vs MAE)
            </h4>
            <span className="text-xs font-mono text-emerald-400">Lower is Better ↓</span>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData.filter(d => d.rmse > 0)} margin={{ top: 20, right: 10, left: -10, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="name" stroke="#94a3b8" tick={{ fontSize: 11 }} />
                <YAxis stroke="#94a3b8" tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', color: '#cbd5e1' }} />
                <Bar dataKey="rmse" fill="#EF4444" radius={[6, 6, 0, 0]} name="RMSE" />
                <Bar dataKey="mae" fill="#F59E0B" radius={[6, 6, 0, 0]} name="MAE" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Summary Table */}
      <div className="glass-panel p-6 rounded-3xl space-y-4">
        <h4 className="text-sm font-bold text-white tracking-wide">Detailed Model Specification Table</h4>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300 border-collapse">
            <thead>
              <tr className="border-b border-white/10 text-slate-400 font-mono text-[11px] uppercase">
                <th className="py-3 px-3">Model Name</th>
                <th className="py-3 px-3">Algorithm</th>
                <th className="py-3 px-3">Type</th>
                <th className="py-3 px-3">Train R²</th>
                <th className="py-3 px-3">Test R²</th>
                <th className="py-3 px-3">RMSE</th>
                <th className="py-3 px-3">MAE</th>
                <th className="py-3 px-3">Train Time</th>
                <th className="py-3 px-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 font-mono">
              {models.map(m => (
                <tr key={m.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-3 font-bold text-white font-sans">{m.name}</td>
                  <td className="py-3 px-3 text-slate-400">{m.algorithm}</td>
                  <td className="py-3 px-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] ${m.type === 'Regression' ? 'bg-blue-500/20 text-blue-400' : 'bg-purple-500/20 text-purple-400'}`}>
                      {m.type}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-blue-400 font-bold">{m.metrics?.train_r2 ?? m.metrics?.train_accuracy}</td>
                  <td className="py-3 px-3 text-[#FFD600] font-bold">{m.metrics?.test_r2 ?? m.metrics?.test_accuracy}</td>
                  <td className="py-3 px-3 text-emerald-400">{m.metrics?.rmse ?? 'N/A'}</td>
                  <td className="py-3 px-3 text-purple-400">{m.metrics?.mae ?? 'N/A'}</td>
                  <td className="py-3 px-3 text-slate-400">{m.metrics?.training_time_sec}s</td>
                  <td className="py-3 px-3">
                    <span className="text-emerald-400 font-bold">✓ Trained</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
