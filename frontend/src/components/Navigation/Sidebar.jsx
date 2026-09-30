import React from 'react';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  Cpu,
  Zap,
  BarChart3,
  TrendingUp,
  Database,
  Upload,
  Info,
  ChevronLeft,
  ChevronRight,
  ShieldAlert
} from 'lucide-react';

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, badge: null },
  { id: 'models', label: 'Models', icon: Cpu, badge: '5' },
  { id: 'prediction', label: 'Prediction', icon: Zap, badge: 'Live' },
  { id: 'performance', label: 'Performance', icon: BarChart3, badge: null },
  { id: 'analytics', label: 'Analytics', icon: TrendingUp, badge: null },
  { id: 'dataset', label: 'Dataset Info', icon: Database, badge: null },
  { id: 'upload', label: 'Model Manager', icon: Upload, badge: 'Colab' },
  { id: 'about', label: 'About Project', icon: Info, badge: null }
];

export default function Sidebar({ activeSection, setActiveSection, collapsed, setCollapsed, isMobileOpen, setIsMobileOpen }) {
  const sidebarWidth = collapsed ? 'w-20' : 'w-64';

  const content = (
    <div className="h-full flex flex-col justify-between py-5 px-3">
      {/* Brand Header */}
      <div>
        <div className="flex items-center justify-between px-3 mb-8">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#2F5BFF] to-blue-700 flex items-center justify-center shrink-0 shadow-lg shadow-blue-500/30 border border-blue-400/30">
              <ShieldAlert className="w-6 h-6 text-white" />
            </div>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2 }}
                className="whitespace-nowrap"
              >
                <h1 className="font-bold text-white tracking-wide text-base leading-tight">AquaShield <span className="text-[#FFD600] font-black">AI</span></h1>
                <p className="text-xs text-slate-400 font-mono">Flood Risk Analytics</p>
              </motion.div>
            )}
          </div>

          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden md:flex p-1.5 rounded-lg bg-slate-800/60 hover:bg-slate-700/80 text-slate-300 hover:text-white transition-colors border border-white/5"
            title={collapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>
        </div>

        {/* Nav Links */}
        <nav className="space-y-1.5">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveSection(item.id);
                  if (isMobileOpen) setIsMobileOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-3 rounded-xl font-medium text-sm transition-all duration-200 group relative ${
                  isActive
                    ? 'bg-gradient-to-r from-[#2F5BFF] to-blue-600 text-white shadow-lg shadow-blue-600/30 border border-blue-400/30'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-5 h-5 shrink-0 transition-transform duration-200 ${isActive ? 'scale-110 text-white' : 'group-hover:scale-110 group-hover:text-white'}`} />
                  {!collapsed && (
                    <span className="truncate">{item.label}</span>
                  )}
                </div>

                {!collapsed && item.badge && (
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    item.badge === 'Live'
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : item.badge === 'Colab'
                      ? 'bg-[#FFD600]/20 text-[#FFD600] border border-[#FFD600]/40'
                      : 'bg-slate-700 text-slate-300'
                  }`}>
                    {item.badge}
                  </span>
                )}

                {/* Active Indicator Bar */}
                {isActive && (
                  <motion.div
                    layoutId="activeBar"
                    className="absolute left-0 top-2 bottom-2 w-1 bg-[#FFD600] rounded-r"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer Info Box */}
      {!collapsed && (
        <div className="p-3.5 rounded-2xl bg-gradient-to-br from-slate-900/90 to-slate-800/80 border border-white/10 shadow-inner">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-300">Model Engine</span>
            <span className="text-[10px] font-mono text-emerald-400 px-1.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">v2.4 Ready</span>
          </div>
          <p className="text-[11px] text-slate-400 leading-tight">Colab Trained ML Models (.pkl / .joblib)</p>
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className={`hidden md:block fixed top-0 left-0 bottom-0 z-40 ${sidebarWidth} transition-all duration-300 bg-slate-950/80 backdrop-blur-2xl border-r border-white/10 shadow-2xl`}>
        {content}
      </aside>

      {/* Mobile Drawer Overlay */}
      {isMobileOpen && (
        <div
          className="md:hidden fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
          onClick={() => setIsMobileOpen(false)}
        >
          <motion.div
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="w-72 h-full bg-slate-950 border-r border-white/10"
            onClick={(e) => e.stopPropagation()}
          >
            {content}
          </motion.div>
        </div>
      )}
    </>
  );
}
