import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export default function Toast({ toast, onClose }) {
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        onClose();
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [toast, onClose]);

  if (!toast) return null;

  const isSuccess = toast.type === 'success';
  const isError = toast.type === 'error';

  return (
    <AnimatePresence>
      <div className="fixed top-20 right-6 z-50 max-w-sm">
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.9 }}
          className={`flex items-center gap-3 p-4 rounded-2xl border shadow-2xl backdrop-blur-xl ${
            isSuccess
              ? 'bg-slate-950/90 border-emerald-500/40 text-emerald-300'
              : isError
              ? 'bg-slate-950/90 border-red-500/40 text-red-300'
              : 'bg-slate-950/90 border-blue-500/40 text-blue-300'
          }`}
        >
          {isSuccess && <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />}
          {isError && <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />}
          {!isSuccess && !isError && <Info className="w-5 h-5 text-blue-400 shrink-0" />}

          <div className="text-xs font-semibold flex-1 leading-tight">
            {toast.message}
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white transition-colors"
          >
            <X size={14} />
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
