import React, { useEffect } from 'react';
import { CheckCircle2, AlertTriangle, Info, X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  type: 'success' | 'warning' | 'info' | 'error';
  title: string;
  message?: string;
}

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastProps> = ({ toasts, onDismiss }) => {
  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm pointer-events-none">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </div>
  );
};

export const Toast = ToastContainer;

const ToastItem: React.FC<{ toast: ToastMessage; onDismiss: (id: string) => void }> = ({
  toast,
  onDismiss,
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss(toast.id);
    }, 4500);
    return () => clearTimeout(timer);
  }, [toast.id, onDismiss]);

  const getIcon = () => {
    switch (toast.type) {
      case 'success':
        return <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />;
      case 'error':
        return <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />;
      default:
        return <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />;
    }
  };

  return (
    <div className="pointer-events-auto flex items-start gap-2.5 p-3 bg-white border border-slate-200 rounded-xl shadow-lg shadow-slate-900/5 transition-all animate-in fade-in slide-in-from-bottom-2">
      {getIcon()}
      <div className="flex-1 min-w-0 pr-1">
        <div className="text-xs font-semibold text-slate-900">{toast.title}</div>
        {toast.message && (
          <div className="text-[11px] text-slate-500 mt-0.5 leading-snug">{toast.message}</div>
        )}
      </div>
      <button
        type="button"
        onClick={() => onDismiss(toast.id)}
        className="p-1 text-slate-400 hover:text-slate-600 rounded-md focus:outline-none"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
