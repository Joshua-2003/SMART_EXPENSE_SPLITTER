import React from 'react';
import { ReliabilityIndicator, PaymentStatus } from '../../types';

interface StatusBadgeProps {
  status?: PaymentStatus | 'overdue' | 'active';
  reliability?: ReliabilityIndicator;
  role?: 'admin' | 'member';
  size?: 'sm' | 'md';
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  reliability,
  role,
  size = 'sm',
  className = '',
}) => {
  const sizeClasses = size === 'sm' ? 'text-xs px-2 py-0.5' : 'text-xs px-2.5 py-1 font-medium';

  // Reliability Indicator (PRD core feature)
  if (reliability) {
    switch (reliability) {
      case 'Reliable':
        return (
          <span
            className={`inline-flex items-center gap-1.5 font-medium rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/80 ${sizeClasses} ${className}`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Reliable
          </span>
        );
      case 'At Risk':
        return (
          <span
            className={`inline-flex items-center gap-1.5 font-medium rounded-full bg-amber-50 text-amber-700 border border-amber-200/80 ${sizeClasses} ${className}`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            At Risk
          </span>
        );
      case 'Unreliable':
        return (
          <span
            className={`inline-flex items-center gap-1.5 font-medium rounded-full bg-rose-50 text-rose-700 border border-rose-200/80 ${sizeClasses} ${className}`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
            Unreliable
          </span>
        );
    }
  }

  // Payment Status
  if (status) {
    switch (status) {
      case 'completed':
        return (
          <span
            className={`inline-flex items-center gap-1 font-medium rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200/60 ${sizeClasses} ${className}`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            Paid
          </span>
        );
      case 'pending':
        return (
          <span
            className={`inline-flex items-center gap-1 font-medium rounded-md bg-slate-100 text-slate-700 border border-slate-200 ${sizeClasses} ${className}`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
            Pending
          </span>
        );
      case 'overdue':
        return (
          <span
            className={`inline-flex items-center gap-1 font-medium rounded-md bg-rose-50 text-rose-700 border border-rose-200 ${sizeClasses} ${className}`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
            Overdue
          </span>
        );
      case 'active':
        return (
          <span
            className={`inline-flex items-center font-medium rounded-md bg-blue-50 text-blue-700 border border-blue-200 ${sizeClasses} ${className}`}
          >
            Active
          </span>
        );
    }
  }

  // Role
  if (role) {
    return role === 'admin' ? (
      <span
        className={`inline-flex items-center font-medium rounded-md bg-slate-900 text-slate-100 ${sizeClasses} ${className}`}
      >
        Admin
      </span>
    ) : (
      <span
        className={`inline-flex items-center font-medium rounded-md bg-slate-100 text-slate-600 border border-slate-200 ${sizeClasses} ${className}`}
      >
        Member
      </span>
    );
  }

  return null;
};
