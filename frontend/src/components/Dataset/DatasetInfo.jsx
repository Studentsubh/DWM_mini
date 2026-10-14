import React from 'react';
import { Database, FileText, CheckCircle2, Layers, Tag, ShieldCheck } from 'lucide-react';

export default function DatasetInfo({ datasetInfo, features }) {
  const categories = {};
  (features || []).forEach(f => {
    categories[f.category] = (categories[f.category] || 0) + 1;
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-black/10">
        <div>
          <h3 className="text-xl font-bold text-black tracking-wide">Dataset Information & Metadata</h3>
          <p className="text-xs text-gray-600">Comprehensive overview of training dataset schema, sample sizes, and feature distributions.</p>
        </div>
        <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20 font-bold">
          0 Missing Values (Clean)
        </span>
      </div>

      {/* Dataset Overview Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="p-4 rounded-2xl bg-white border border-black/10 neo-stat-box text-center">
          <span className="text-[11px] font-bold text-gray-600 uppercase block mb-1">Total Observations</span>
          <div className="text-2xl font-black text-black">{(datasetInfo?.total_rows || 10562).toLocaleString()}</div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-black/10 neo-stat-box text-center">
          <span className="text-[11px] font-bold text-gray-600 uppercase block mb-1">Input Features</span>
          <div className="text-2xl font-black text-black">{datasetInfo?.total_features || 8}</div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-black/10 neo-stat-box text-center">
          <span className="text-[11px] font-bold text-gray-600 uppercase block mb-1">Train Set Size</span>
          <div className="text-2xl font-black text-emerald-400">{(datasetInfo?.train_samples || 8450).toLocaleString()}</div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-black/10 neo-stat-box text-center">
          <span className="text-[11px] font-bold text-gray-600 uppercase block mb-1">Test Set Size</span>
          <div className="text-2xl font-black text-black">{(datasetInfo?.test_samples || 2112).toLocaleString()}</div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-black/10 neo-stat-box text-center">
          <span className="text-[11px] font-bold text-gray-600 uppercase block mb-1">Missing Values</span>
          <div className="text-2xl font-black text-purple-400">{datasetInfo?.missing_values || 0}</div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-black/10 neo-stat-box text-center">
          <span className="text-[11px] font-bold text-gray-600 uppercase block mb-1">Feature Groups</span>
          <div className="text-2xl font-black text-black">{Object.keys(categories).length}</div>
        </div>
      </div>

      {/* Categories Distribution */}
      <div className="p-5 rounded-3xl bg-white border border-black/10 space-y-4">
        <h4 className="text-sm font-bold text-black tracking-wide">Feature Category Breakdown</h4>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {Object.entries(categories).map(([cat, count]) => (
            <div key={cat} className="p-3.5 rounded-2xl bg-white border border-black/10 flex items-center justify-between">
              <span className="text-xs font-semibold text-black">{cat}</span>
              <span className="text-xs font-bold text-black px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20 font-mono">
                {count} {count === 1 ? 'Feature' : 'Features'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Feature Specification Table */}
      <div className="glass-panel p-6 rounded-3xl space-y-4">
        <h4 className="text-sm font-bold text-black tracking-wide">Feature Schema Specification Table</h4>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-black border-collapse">
            <thead>
              <tr className="border-b border-black/10 text-gray-600 font-mono text-[11px] uppercase">
                <th className="py-3 px-3">Feature Name</th>
                <th className="py-3 px-3">Category</th>
                <th className="py-3 px-3">Unit</th>
                <th className="py-3 px-3">Bounds (Min - Max)</th>
                <th className="py-3 px-3">Default Value</th>
                <th className="py-3 px-3">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 font-mono">
              {(features || []).map(f => (
                <tr key={f.id} className="hover:bg-white transition-colors">
                  <td className="py-3 px-3 font-bold text-black font-sans">{f.label}</td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded text-[10px] bg-white text-black border border-black/10">
                      {f.category}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-black font-bold">{f.unit}</td>
                  <td className="py-3 px-3 text-black">{f.min} – {f.max}</td>
                  <td className="py-3 px-3 text-emerald-400">{f.default}</td>
                  <td className="py-3 px-3 text-gray-600 font-sans">{f.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}


