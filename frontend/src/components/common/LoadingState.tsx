import React from 'react';

export interface LoadingStateProps {
  rows?: number;
  type?: 'table' | 'card';
}

export const LoadingState: React.FC<LoadingStateProps> = ({ rows = 5, type = 'table' }) => {
  if (type === 'card') {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 animate-pulse">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-24 bg-slate-100 rounded-xl border border-slate-200" />
        ))}
      </div>
    );
  }

  return (
    <div className="w-full bg-white border border-slate-200 rounded-xl overflow-hidden animate-pulse">
      <div className="h-10 bg-slate-50 border-b border-slate-100" />
      <div className="divide-y divide-slate-100 p-2">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="py-3 px-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 w-1/3">
              <div className="w-8 h-8 rounded-full bg-slate-100 shrink-0" />
              <div className="space-y-1.5 flex-1">
                <div className="h-3.5 bg-slate-100 rounded-md w-3/4" />
                <div className="h-2.5 bg-slate-100 rounded-md w-1/2" />
              </div>
            </div>
            <div className="h-3 bg-slate-100 rounded-md w-24 hidden sm:block" />
            <div className="h-3.5 bg-slate-100 rounded-md w-16" />
          </div>
        ))}
      </div>
    </div>
  );
};
