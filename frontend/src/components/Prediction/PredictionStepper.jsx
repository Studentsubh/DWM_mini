import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Loader2, Sparkles, Cpu, ShieldCheck } from 'lucide-react';

const STEPS = [
  'Processing Hydrological Input',
  'Validating Feature Bounds',
  'Running Model Inference Engine',
  'Generating Risk Classification',
  'Prediction Complete'
];

export default function PredictionStepper({ currentStep, totalProgress }) {
  return (
    <div className="glass-panel rounded-3xl p-8 max-w-xl mx-auto my-8 border border-blue-500/30 text-center space-y-6 shadow-2xl">
      <div className="relative w-20 h-20 mx-auto flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-0 rounded-full border-4 border-t-[#2F5BFF] border-r-[#FFD600] border-b-blue-900 border-l-slate-800"
        />
        <Cpu className="w-8 h-8 text-[#FFD600] animate-pulse" />
      </div>

      <div className="space-y-2">
        <h3 className="text-xl font-bold text-white tracking-wide">
          {STEPS[currentStep] || 'Evaluating Input...'}
        </h3>
        <p className="text-xs text-slate-400 font-mono">
          Model execution step {currentStep + 1} of {STEPS.length}
        </p>
      </div>

      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="w-full bg-slate-900 rounded-full h-3 border border-white/10 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${totalProgress}%` }}
            transition={{ duration: 0.3 }}
            className="h-full bg-gradient-to-r from-[#2F5BFF] via-blue-400 to-[#FFD600] rounded-full"
          />
        </div>
        <div className="flex justify-between text-[11px] font-mono text-slate-400">
          <span>0%</span>
          <span className="text-[#FFD600] font-bold">{Math.round(totalProgress)}%</span>
          <span>100%</span>
        </div>
      </div>

      {/* Step Indicators */}
      <div className="grid grid-cols-5 gap-2 pt-2">
        {STEPS.map((step, idx) => {
          const isDone = idx < currentStep;
          const isCurrent = idx === currentStep;
          return (
            <div
              key={step}
              className={`h-2 rounded-full transition-all duration-300 ${
                isDone
                  ? 'bg-emerald-500'
                  : isCurrent
                  ? 'bg-[#FFD600] animate-pulse'
                  : 'bg-slate-800'
              }`}
            />
          );
        })}
      </div>
    </div>
  );
}
