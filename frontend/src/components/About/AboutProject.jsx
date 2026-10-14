import React from 'react';
import { ShieldCheck, Cpu, Code2, Layers, BookOpen, CheckCircle2, Server, Terminal } from 'lucide-react';

export default function AboutProject() {
  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="pb-2 border-b border-black/10">
        <h3 className="text-xl font-bold text-black tracking-wide">About AquaShield AI Flood Risk Analytics</h3>
        <p className="text-xs text-gray-600">Technical documentation, architectural design system, and project viva overview.</p>
      </div>

      {/* Main Architecture Card */}
      <div className="glass-panel p-6 md:p-8 rounded-3xl space-y-6 border border-black/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-black border border-black/30 flex items-center justify-center text-black">
            <Layers size={22} />
          </div>
          <div>
            <h4 className="text-lg font-bold text-black">Four-Tier Decoupled Architecture</h4>
            <p className="text-xs text-gray-600 font-mono">Frontend UI ⟷ Backend API ⟷ Model Layer ⟷ Data Layer</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
          <div className="p-4 rounded-2xl bg-white border border-black/10 space-y-2">
            <span className="text-xs font-bold text-black block">1. Frontend Layer</span>
            <p className="text-xs text-black">React 19, Vite, Tailwind CSS v4, Framer Motion animations, Recharts data visualization.</p>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-black/10 space-y-2">
            <span className="text-xs font-bold text-black block">2. Backend Layer</span>
            <p className="text-xs text-black">Python FastAPI service handling model loading, validation, CORS, and inference endpoints.</p>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-black/10 space-y-2">
            <span className="text-xs font-bold text-emerald-400 block">3. Model Layer</span>
            <p className="text-xs text-black">Scikit-learn, XGBoost, Random Forest Ensembles exported as `.pkl`, `.joblib`, and `.json` artifacts.</p>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-black/10 space-y-2">
            <span className="text-xs font-bold text-purple-400 block">4. Data Layer</span>
            <p className="text-xs text-black">Centralized JSON configuration (`models_config.json`) driving all metrics, charts, and features.</p>
          </div>
        </div>
      </div>

      {/* Presentation / Viva Points */}
      <div className="glass-panel p-6 rounded-3xl space-y-4">
        <h4 className="text-base font-bold text-black tracking-wide flex items-center gap-2">
          <BookOpen className="text-black" size={20} /> Project Presentation & Viva Highlights
        </h4>

        <div className="space-y-3 text-xs text-black">
          <div className="flex items-start gap-3 p-3 rounded-xl bg-white border border-black/10">
            <CheckCircle2 size={16} className="text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-black">Multi-Model Comparison Engine:</strong> Supports comparing Random Forest, XGBoost, Gradient Boosting, and Linear Regression models side-by-side using R², RMSE, and MAE metrics.
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-xl bg-white border border-black/10">
            <CheckCircle2 size={16} className="text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-black">Interactive Prediction Workspace:</strong> Step-by-step 5-stage processing stepper (`Processing` → `Validating` → `Running` → `Generating` → `Complete`) with real-time risk spectrum bar.
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-xl bg-white border border-black/10">
            <CheckCircle2 size={16} className="text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-black">Zero Hardcoded Metrics:</strong> All model metrics, graphs, and feature importances are dynamically sourced from a single JSON configuration file ready for Colab replacement.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


