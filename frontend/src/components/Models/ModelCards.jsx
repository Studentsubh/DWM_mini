import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Cpu, Zap, Eye, CheckCircle2, Award, Clock, ArrowUpRight } from 'lucide-react';

export default function ModelCards({ models, setActiveSection, setSelectedModelId, onOpenDetailModal }) {
  const [filterType, setFilterType] = useState('All');

  const filteredModels = models.filter((m) => {
    if (filterType === 'Regression') return m.type === 'Regression';
    if (filterType === 'Classification') return m.type === 'Classification';
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Category Tabs & Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-white/10">
        <div>
          <h3 className="text-xl font-bold text-white tracking-wide">Machine Learning Model Gallery</h3>
          <p className="text-xs text-slate-400">Trained regression and classification models available for hydrometeorological risk inference.</p>
        </div>

        {/* Category Filter Buttons */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-900 border border-white/10 text-xs">
          {['All', 'Regression', 'Classification'].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilterType(tab)}
              className={`px-3.5 py-1.5 rounded-lg font-medium transition-all duration-200 ${
                filterType === tab
                  ? 'bg-[#2F5BFF] text-white shadow-md shadow-blue-500/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              {tab} {tab === 'All' ? `(${models.length})` : ''}
            </button>
          ))}
        </div>
      </div>

      {/* Model Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredModels.map((model, idx) => {
          const isRegression = model.type === 'Regression';
          const primaryMetricLabel = isRegression ? 'Test R² Score' : 'Test Accuracy';
          const primaryMetricVal = isRegression ? model.metrics?.test_r2 : model.metrics?.test_accuracy;
          const trainMetricVal = isRegression ? model.metrics?.train_r2 : model.metrics?.train_accuracy;

          return (
            <motion.div
              key={model.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.08 }}
              className={`glass-panel glass-panel-hover rounded-2xl p-5 flex flex-col justify-between relative overflow-hidden border ${
                model.is_recommended ? 'border-blue-500/40 shadow-blue-500/10 shadow-lg' : 'border-white/10'
              }`}
            >
              {/* Header Badge Row */}
              <div className="space-y-3 mb-4">
                <div className="flex items-center justify-between gap-2">
                  <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                    isRegression ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' : 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                  }`}>
                    {model.type}
                  </span>

                  <div className="flex items-center gap-1.5">
                    {model.is_recommended && (
                      <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#FFD600]/20 text-[#FFD600] border border-[#FFD600]/40">
                        <Award size={12} /> Best Fit
                      </span>
                    )}
                    <span className="flex items-center gap-1 text-[10px] font-semibold text-emerald-400 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                      <CheckCircle2 size={12} /> Trained
                    </span>
                  </div>
                </div>

                <div>
                  <h4 className="text-lg font-bold text-white tracking-wide leading-snug group-hover:text-[#2F5BFF]">
                    {model.name}
                  </h4>
                  <p className="text-xs text-slate-400 font-mono mt-0.5">{model.algorithm}</p>
                </div>
              </div>

              {/* Main Metric Spotlight Card (Inspired by high-contrast neo brutalist design) */}
              <div className="my-3 p-3.5 rounded-xl bg-slate-900/90 border border-slate-700/60 neo-stat-box">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-semibold text-slate-300">{primaryMetricLabel}</span>
                  <span className="text-xl font-black text-[#FFD600]">{primaryMetricVal ?? 'N/A'}</span>
                </div>

                {/* Progress Indicator Bar */}
                <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(primaryMetricVal || 0) * 100}%` }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                    className="bg-gradient-to-r from-[#2F5BFF] to-[#FFD600] h-full rounded-full"
                  />
                </div>
              </div>

              {/* Secondary Metrics Grid */}
              <div className="grid grid-cols-2 gap-2 my-3 text-xs">
                <div className="p-2.5 rounded-xl bg-slate-950/60 border border-white/5 space-y-0.5">
                  <span className="text-[11px] text-slate-400 font-medium">Training Score</span>
                  <div className="font-bold text-slate-200">{trainMetricVal ?? 'N/A'}</div>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-950/60 border border-white/5 space-y-0.5">
                  <span className="text-[11px] text-slate-400 font-medium">{isRegression ? 'RMSE / MAE' : 'Precision / F1'}</span>
                  <div className="font-bold text-slate-200">
                    {isRegression ? `${model.metrics?.rmse} / ${model.metrics?.mae}` : `${model.metrics?.precision} / ${model.metrics?.f1_score}`}
                  </div>
                </div>
              </div>

              {/* Card Actions */}
              <div className="pt-3 border-t border-white/10 flex items-center gap-2">
                <button
                  onClick={() => {
                    setSelectedModelId(model.id);
                    setActiveSection('prediction');
                  }}
                  className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-gradient-to-r from-[#2F5BFF] to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold text-xs shadow-md shadow-blue-600/25 transition-all duration-150"
                >
                  <Zap size={14} className="fill-current text-[#FFD600]" />
                  <span>Use Model</span>
                </button>

                <button
                  onClick={() => onOpenDetailModal(model)}
                  className="flex items-center gap-1 px-3 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white font-semibold text-xs border border-white/10 transition-colors"
                >
                  <Eye size={14} />
                  <span>Details</span>
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
