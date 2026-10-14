import React from 'react';
import { Menu, Zap, Server, Activity, Search } from 'lucide-react';

export default function Topbar({ activeSection, setActiveSection, collapsed, setIsMobileOpen, isLiveApi }) {
  const sectionTitles = {
    dashboard: 'Dashboard Overview',
    models: 'Trained Model Gallery',
    prediction: 'Flood Risk Prediction Workspace',
    performance: 'Model Performance & Metric Comparison',
    analytics: 'Advanced ML Diagnostics & Analytics',
    dataset: 'Dataset Summary & Feature Metadata',
    upload: 'Model Manager & Colab Integration',
    about: 'Project Documentation & Technical Architecture'
  };

  return (
    <header className={`sticky top-0 z-30 h-16 bg-white backdrop-blur-xl border-b border-black/10 transition-all duration-300 ${
      collapsed ? 'md:ml-20' : 'md:ml-64'
    }`}>
      <div className="h-full px-4 md:px-8 flex items-center justify-between gap-4">
        {/* Left Side: Mobile Toggle & Page Title */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsMobileOpen(true)}
            className="md:hidden p-2 rounded-lg bg-white text-black hover:text-black border border-black/10"
          >
            <Menu size={20} />
          </button>

          <div>
            <h2 className="text-base md:text-lg font-bold text-black tracking-wide">
              {sectionTitles[activeSection] || 'Flood Risk Analytics'}
            </h2>
            <div className="flex items-center gap-2 text-xs text-gray-600">
              <span>Platform</span>
              <span>/</span>
              <span className="text-black font-medium capitalize">{activeSection}</span>
            </div>
          </div>
        </div>

        {/* Right Side: Status Badges & Quick Action */}
        <div className="flex items-center gap-3 md:gap-4">
          {/* Backend Status Pill */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-black/10 text-xs">
            <span className="relative flex h-2 w-2">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isLiveApi ? 'bg-emerald-400' : 'bg-amber-400'}`}></span>
              <span className={`relative inline-flex rounded-full h-2 w-2 ${isLiveApi ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
            </span>
            <span className="text-black font-mono text-[11px]">
              {isLiveApi ? 'FastAPI Connected' : 'Mock Engine (Offline)'}
            </span>
          </div>

          {/* Quick Predict Action */}
          {activeSection !== 'prediction' && (
            <button
              onClick={() => setActiveSection('prediction')}
              className="flex items-center gap-2 px-3.5 py-1.5 md:px-4 md:py-2 rounded-xl bg-gradient-to-r from-black to-black hover:from-black hover:to-black text-white font-semibold text-xs md:text-sm shadow-lg shadow-black/10 transition-all duration-200 active:scale-95 border border-black/30"
            >
              <Zap size={16} className="fill-current text-black" />
              <span>Predict Risk</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}


