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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-black/10">
        <div>
          <h3 className="text-xl font-bold text-black tracking-wide">Model Metric Comparison Matrix</h3>
          <p className="text-xs text-gray-600">Evaluate training vs testing performance, residual error metrics, and inference benchmarks.</p>
        </div>

        {/* Training / Testing Toggle Switch */}
        <div className="flex items-center gap-2 p-1.5 rounded-xl bg-white border border-black/10 text-xs">
          <span className="text-gray-600 px-2 font-mono">Dataset Split:</span>
          <button
            onClick={() => setMetricMode('Training')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
              metricMode === 'Training'
                ? 'bg-black text-white shadow-md'
                : 'text-gray-600 hover:text-black'
            }`}
          >
            Training Set
          </button>
          <button
            onClick={() => setMetricMode('Testing')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
              metricMode === 'Testing'
                ? 'bg-black text-white shadow-md'
                : 'text-gray-600 hover:text-black'
            }`}
          >
            Testing Set (Holdout)
          </button>
        </div>
      </div>

      {/* Training & Testing Statistics Cards (Driven by config file) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="p-4 rounded-2xl bg-white border border-black/10 text-center neo-stat-box">
          <span className="text-[11px] font-bold text-gray-600 uppercase block mb-1">Top Training R²</span>
          <div className="text-2xl font-black text-black">{bestModel?.metrics?.train_r2 ?? 0.942}</div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-black/10 text-center neo-stat-box">
          <span className="text-[11px] font-bold text-gray-600 uppercase block mb-1">Top Testing R²</span>
          <div className="text-2xl font-black text-black">{bestModel?.metrics?.test_r2 ?? 0.912}</div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-black/10 text-center neo-stat-box">
          <span className="text-[11px] font-bold text-gray-600 uppercase block mb-1">Lowest RMSE</span>
          <div className="text-2xl font-black text-emerald-400">{bestModel?.metrics?.rmse ?? 3.75}</div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-black/10 text-center neo-stat-box">
          <span className="text-[11px] font-bold text-gray-600 uppercase block mb-1">Lowest MAE</span>
          <div className="text-2xl font-black text-purple-400">{bestModel?.metrics?.mae ?? 2.41}</div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-black/10 text-center neo-stat-box">
          <span className="text-[11px] font-bold text-gray-600 uppercase block mb-1">Train Samples</span>
          <div className="text-2xl font-black text-black">{(datasetInfo?.train_samples || 8450).toLocaleString()}</div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-black/10 text-center neo-stat-box">
          <span className="text-[11px] font-bold text-gray-600 uppercase block mb-1">Test Samples</span>
          <div className="text-2xl font-black text-black">{(datasetInfo?.test_samples || 2112).toLocaleString()}</div>
        </div>
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Performance Score Bar Chart */}
        <div className="lg:col-span-7 glass-panel p-5 rounded-3xl space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-black tracking-wide flex items-center gap-2">
              <BarChart3 size={18} className="text-black" /> {metricMode} Score Comparison (R² / Accuracy)
            </h4>
            <span className="text-xs font-mono text-black">Higher is Better ↑</span>
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
            <h4 className="text-sm font-bold text-black tracking-wide flex items-center gap-2">
              <TrendingUp size={18} className="text-black" /> Residual Error (RMSE vs MAE)
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
        <h4 className="text-sm font-bold text-black tracking-wide">Detailed Model Specification Table</h4>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-black border-collapse">
            <thead>
              <tr className="border-b border-black/10 text-gray-600 font-mono text-[11px] uppercase">
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
                <tr key={m.id} className="hover:bg-white transition-colors">
                  <td className="py-3 px-3 font-bold text-black font-sans">{m.name}</td>
                  <td className="py-3 px-3 text-gray-600">{m.algorithm}</td>
                  <td className="py-3 px-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] ${m.type === 'Regression' ? 'bg-black text-white' : 'bg-purple-500/20 text-purple-400'}`}>
                      {m.type}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-black font-bold">{m.metrics?.train_r2 ?? m.metrics?.train_accuracy}</td>
                  <td className="py-3 px-3 text-black font-bold">{m.metrics?.test_r2 ?? m.metrics?.test_accuracy}</td>
                  <td className="py-3 px-3 text-emerald-400">{m.metrics?.rmse ?? 'N/A'}</td>
                  <td className="py-3 px-3 text-purple-400">{m.metrics?.mae ?? 'N/A'}</td>
                  <td className="py-3 px-3 text-gray-600">{m.metrics?.training_time_sec}s</td>
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


