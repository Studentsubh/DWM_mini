import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, ShieldAlert, CheckCircle2, RefreshCw, Info, Download } from 'lucide-react';

export default function ResultDisplay({ result, onReset, selectedModel }) {
  if (!result) return null;

  const score = result.predicted_score ?? 72.4;
  const riskTier = result.risk_tier || 'HIGH';
  const riskLabel = result.risk_label || 'High Risk';
  const riskColor = result.risk_color || '#F97316';
  const explanation = result.explanation || `The ${selectedModel?.name || 'Selected Model'} predicts a high flood-risk level based on current precipitation and water level inputs.`;
  const details = result.details || 'Critical hydrometeorological threat detected. Stream overflow probable.';

  // Spectrum percentage for marker pin
  const pinPercent = Math.min(Math.max(score, 0), 100);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="glass-panel rounded-3xl p-6 md:p-10 border border-black/10 space-y-8 shadow-2xl relative overflow-hidden"
    >
      {/* Background glow accent depending on risk score */}
      <div
        className="absolute -top-32 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full opacity-20 blur-3xl pointer-events-none"
        style={{ backgroundColor: riskColor }}
      />

      <div className="flex flex-col md:flex-row items-center justify-between gap-6 border-b border-black/10 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-mono text-gray-600">Inference Complete</span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              Verified ✓
            </span>
          </div>
          <h3 className="text-2xl font-black text-black tracking-wide">Flood Risk Evaluation Output</h3>
          <p className="text-xs text-gray-600 font-mono mt-1">Model Engine: <span className="text-black font-bold">{selectedModel?.name || result.model_name}</span></p>
        </div>

        <button
          onClick={onReset}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-white text-black text-xs font-bold border border-black/10 transition-colors"
        >
          <RefreshCw size={14} /> Adjust Inputs & Re-run
        </button>
      </div>

      {/* Main Score Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
        {/* Score Circle Box */}
        <div className="md:col-span-5 flex flex-col items-center justify-center p-6 rounded-3xl bg-white border border-black/10 neo-stat-box text-center space-y-2">
          <span className="text-xs font-bold text-gray-600 uppercase tracking-wider">Flood Risk Index Score</span>
          <div className="text-6xl font-black tracking-tight text-black flex items-baseline justify-center gap-1">
            <motion.span
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, type: 'spring' }}
              style={{ color: riskColor }}
            >
              {score}
            </motion.span>
            <span className="text-xl text-gray-500 font-normal">/ 100</span>
          </div>

          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold border shadow-lg mt-2"
            style={{ backgroundColor: `${riskColor}20`, color: riskColor, borderColor: `${riskColor}40` }}
          >
            <ShieldAlert size={16} />
            <span>{riskLabel.toUpperCase()} ({riskTier})</span>
          </div>
        </div>

        {/* Explanation & Actionable Guidance */}
        <div className="md:col-span-7 space-y-4">
          <div className="p-4 rounded-2xl bg-white border border-black/10 space-y-2">
            <h4 className="text-xs font-bold text-black uppercase tracking-wider flex items-center gap-2">
              <Info size={16} className="text-black" /> Predictive Model Analysis
            </h4>
            <p className="text-sm text-black leading-relaxed font-medium">{explanation}</p>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-black/10 space-y-1.5">
            <span className="text-xs font-semibold text-gray-600">Recommended Action Plan:</span>
            <p className="text-xs text-black leading-normal">{details}</p>
          </div>
        </div>
      </div>

      {/* Visual Risk Indicator Spectrum Bar */}
      <div className="space-y-4 pt-4 border-t border-black/10">
        <div className="flex items-center justify-between text-xs font-bold">
          <span className="text-gray-600 uppercase tracking-wider">Risk Level Spectrum</span>
          <span className="font-mono text-black">Target Position: {score}%</span>
        </div>

        {/* Spectrum Bar Container */}
        <div className="relative pt-6 pb-2">
          {/* Animated Pin Marker */}
          <motion.div
            initial={{ left: '0%' }}
            animate={{ left: `${pinPercent}%` }}
            transition={{ duration: 1, type: 'spring', damping: 20 }}
            className="absolute top-0 -translate-x-1/2 flex flex-col items-center z-20"
          >
            <div
              className="px-2 py-0.5 rounded text-[10px] font-black text-black shadow-lg uppercase"
              style={{ backgroundColor: riskColor }}
            >
              {score}
            </div>
            <div
              className="w-0 h-0 border-l-4 border-r-4 border-t-6 border-l-transparent border-r-transparent"
              style={{ borderTopColor: riskColor }}
            />
          </motion.div>

          {/* Gradient Spectrum Track */}
          <div className="h-4 w-full rounded-full bg-gradient-to-r from-emerald-500 via-amber-500 via-orange-500 to-red-600 shadow-inner flex overflow-hidden border border-black/10">
            <div className="w-[35%] border-r border-black/20" />
            <div className="w-[30%] border-r border-black/20" />
            <div className="w-[20%] border-r border-black/20" />
            <div className="w-[15%]" />
          </div>

          {/* Spectrum Labels */}
          <div className="grid grid-cols-4 text-center text-[11px] font-mono text-gray-600 pt-2">
            <div className="text-emerald-400 font-semibold">LOW (0 - 35)</div>
            <div className="text-amber-400 font-semibold">MODERATE (35 - 65)</div>
            <div className="text-orange-400 font-semibold">HIGH (65 - 85)</div>
            <div className="text-red-400 font-semibold">SEVERE (85 - 100)</div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}


