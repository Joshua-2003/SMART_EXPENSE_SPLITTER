import React from 'react';
import { Receipt } from 'lucide-react';

export const AppLoader: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center gap-3 font-sans antialiased text-slate-900">
      <div className="w-9 h-9 rounded-lg bg-emerald-600 flex items-center justify-center text-white shadow-xs">
        <Receipt className="w-5 h-5" />
      </div>
      <div className="flex items-center gap-2 text-xs text-slate-500">
        <span className="w-3.5 h-3.5 border-2 border-slate-300 border-t-slate-600 rounded-full animate-spin" />
        Restoring your session...
      </div>
    </div>
  );
};
