import React from 'react';

interface LoadingSkeletonProps {
  rows?: number;
  className?: string;
  type?: 'table' | 'card' | 'line';
}

export const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({
  rows = 4,
  className = '',
  type = 'table',
}) => {
  if (type === 'card') {
    return (
      <div className={`grid grid-cols-1 md:grid-cols-3 gap-4 ${className}`}>
        {Array.from({ length: rows }).map((_, i) => (
          <div
            key={i}
            className="rounded-xl border border-slate-200 p-4 bg-white animate-pulse"
          >
            <div className="h-3 bg-slate-200 rounded-sm w-24 mb-3" />
            <div className="h-6 bg-slate-200 rounded-md w-36 mb-2" />
            <div className="h-2.5 bg-slate-100 rounded-sm w-48" />
          </div>
        ))}
      </div>
    );
  }

  if (type === 'line') {
    return (
      <div className={`space-y-2.5 ${className}`}>
        {Array.from({ length: rows }).map((_, i) => (
          <div
            key={i}
            className="h-3 bg-slate-200 rounded-sm animate-pulse"
            style={{ width: `${85 - (i % 3) * 15}%` }}
          />
        ))}
      </div>
    );
  }

  // Table skeleton
  return (
    <div className={`w-full rounded-xl border border-slate-200 bg-white overflow-hidden ${className}`}>
      <div className="h-10 bg-slate-50 border-b border-slate-200 px-4 flex items-center gap-4 animate-pulse">
        <div className="h-3.5 bg-slate-200 rounded-sm w-32" />
        <div className="h-3.5 bg-slate-200 rounded-sm w-24 ml-auto" />
        <div className="h-3.5 bg-slate-200 rounded-sm w-20" />
      </div>
      <div className="divide-y divide-slate-100">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="p-4 flex items-center gap-4 animate-pulse">
            <div className="w-8 h-8 rounded-full bg-slate-200 shrink-0" />
            <div className="space-y-1.5 flex-1">
              <div className="h-3.5 bg-slate-200 rounded-sm w-44" />
              <div className="h-2.5 bg-slate-100 rounded-sm w-28" />
            </div>
            <div className="h-3.5 bg-slate-200 rounded-sm w-20" />
            <div className="h-6 bg-slate-200 rounded-md w-16" />
          </div>
        ))}
      </div>
    </div>
  );
};
