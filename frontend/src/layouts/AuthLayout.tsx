import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { ShieldCheck, Receipt } from 'lucide-react';
import { ROUTES } from '../constants/routes';

export const AuthLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans antialiased text-slate-900">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-2">
        <Link
          to={ROUTES.HOME}
          className="inline-flex items-center gap-2 text-slate-900 hover:opacity-90 transition-opacity"
        >
          <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white shadow-xs">
            <Receipt className="w-4 h-4" />
          </div>
          <span className="text-base font-bold tracking-tight">Smart Expense Splitter</span>
        </Link>
        <p className="text-xs text-slate-500">
          Shared group expense management with real payment accountability
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-sm border border-slate-200 sm:rounded-xl sm:px-10">
          <Outlet />
        </div>

        <div className="mt-6 text-center text-xs text-slate-400 flex items-center justify-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Enterprise-grade data consistency & accountability metrics</span>
        </div>
      </div>
    </div>
  );
};
