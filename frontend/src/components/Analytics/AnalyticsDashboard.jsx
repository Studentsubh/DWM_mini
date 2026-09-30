import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, BarChart2, ScatterChart as ScatterIcon, Layers, Activity } from 'lucide-react';
import {
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
  Cell,
  LineChart,
  Line
} from 'recharts';

export default function AnalyticsDashboard({ models }) {
  const primaryModel = models.find(m => m.is_recommended) || models[0];

  // Distribution data mock bins
  const distributionData = [
    { bin: '0-20 (Low)', count: 1450 },
    { bin: '20-40 (Low-Med)', count: 2840 },
    { bin: '40-60 (Medium)', count: 3410 },
    { bin: '60-80 (High)', count: 2150 },
    { bin: '80-100 (Severe)', count: 712 }
  ];

  const actualVsPredData = primaryModel?.actual_vs_predicted || [
    { actual: 15, predicted: 16 },
    { actual: 30, predicted: 29 },
    { actual: 50, predicted: 52 },
    { actual: 70, predicted: 68 },
    { actual: 85, predicted: 86 }
  ];

  const residualData = primaryModel?.residual_data || [
    { predicted: 16, residual: -1.0 },
    { predicted: 29, residual: 1.0 },
    { predicted: 52, residual: -2.0 },
    { predicted: 68, residual: 2.0 },
    { predicted: 86, residual: -1.0 }
  ];

  const featureImportanceData = primaryModel?.feature_importance || [];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-white/10">
        <div>
          <h3 className="text-xl font-bold text-white tracking-wide">Advanced Analytics & Diagnostics</h3>
          <p className="text-xs text-slate-400">Deep-dive visualizations for prediction distributions, feature influence, and residual error analysis.</p>
        </div>
        <span className="text-xs font-mono text-[#FFD600] bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
          Target: {primaryModel?.name}
        </span>
      </div>

      {/* Grid 1: Prediction Distribution & Feature Importance */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Prediction Score Distribution */}
        <div className="lg:col-span-6 glass-panel p-5 rounded-3xl space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-white tracking-wide flex items-center gap-2">
              <Activity size={18} className="text-[#2F5BFF]" /> Prediction Risk Distribution Histogram
            </h4>
            <span className="text-xs font-mono text-slate-400">N = 10,562</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={distributionData} margin={{ top: 10, right: 10, left: -10, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="bin" stroke="#94a3b8" tick={{ fontSize: 10 }} />
                <YAxis stroke="#94a3b8" tick={{ fontSize: 10 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff' }}
                  formatter={(val) => [val.toLocaleString() + ' samples', 'Sample Count']}
                />
                <Bar dataKey="count" fill="#2F5BFF" radius={[8, 8, 0, 0]}>
                  {distributionData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={index === 0 ? '#10B981' : index === 1 ? '#34D399' : index === 2 ? '#F59E0B' : index === 3 ? '#F97316' : '#EF4444'}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Global Feature Importance Ranking */}
        <div className="lg:col-span-6 glass-panel p-5 rounded-3xl space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-white tracking-wide flex items-center gap-2">
              <BarChart2 size={18} className="text-[#FFD600]" /> Feature Importance Ranking
            </h4>
            <span className="text-xs font-mono text-slate-400">Gini Impurity</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={featureImportanceData} layout="vertical" margin={{ top: 5, right: 10, left: 40, bottom: 5 }}>
                <XAxis type="number" stroke="#64748b" tick={{ fontSize: 10 }} />
                <YAxis dataKey="feature" type="category" stroke="#94a3b8" tick={{ fontSize: 10 }} width={110} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff' }}
                  formatter={(val) => [(val * 100).toFixed(1) + '%', 'Importance']}
                />
                <Bar dataKey="importance" fill="#FFD600" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Grid 2: Actual vs Predicted & Residuals */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Actual vs Predicted Scatter */}
        <div className="lg:col-span-6 glass-panel p-5 rounded-3xl space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-white tracking-wide flex items-center gap-2">
              <TrendingUp size={18} className="text-emerald-400" /> Actual vs Predicted Scatter Plot
            </h4>
            <span className="text-xs font-mono text-blue-400">R² = {primaryModel?.metrics?.test_r2}</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 10, right: 10, bottom: 10, left: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="actual" name="Actual Score" stroke="#94a3b8" tick={{ fontSize: 10 }} />
                <YAxis dataKey="predicted" name="Predicted Score" stroke="#94a3b8" tick={{ fontSize: 10 }} />
                <Tooltip
                  cursor={{ strokeDasharray: '3 3' }}
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff' }}
                />
                <Scatter name="Observations" data={actualVsPredData} fill="#2F5BFF" />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Residual Plot */}
        <div className="lg:col-span-6 glass-panel p-5 rounded-3xl space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-white tracking-wide flex items-center gap-2">
              <Layers size={18} className="text-purple-400" /> Residual Plot (Errors vs Fitted)
            </h4>
            <span className="text-xs font-mono text-slate-400">Mean Zero Line</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 10, right: 10, bottom: 10, left: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="predicted" name="Fitted Score" stroke="#94a3b8" tick={{ fontSize: 10 }} />
                <YAxis dataKey="residual" name="Residual Error" stroke="#94a3b8" tick={{ fontSize: 10 }} domain={[-5, 5]} />
                <Tooltip
                  cursor={{ strokeDasharray: '3 3' }}
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff' }}
                />
                <Scatter name="Residuals" data={residualData} fill="#EF4444" />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
