import React from 'react';
import { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  label: string;
  value: string | number;
  subValue?: string;
  icon?: LucideIcon;
  variant?: 'default' | 'positive' | 'warning' | 'negative' | 'accent';
  onClick?: () => void;
  badgeText?: string;
  id?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  label,
  value,
  subValue,
  icon: Icon,
  variant = 'default',
  onClick,
  badgeText,
  id,
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'positive':
        return {
          cardBg: 'bg-emerald-50/40 border-emerald-200/80',
          valueColor: 'text-emerald-700',
          iconColor: 'text-emerald-600 bg-emerald-100/70',
        };
      case 'negative':
        return {
          cardBg: 'bg-rose-50/40 border-rose-200/80',
          valueColor: 'text-rose-700',
          iconColor: 'text-rose-600 bg-rose-100/70',
        };
      case 'warning':
        return {
          cardBg: 'bg-amber-50/40 border-amber-200/80',
          valueColor: 'text-amber-800',
          iconColor: 'text-amber-600 bg-amber-100/70',
        };
      case 'accent':
        return {
          cardBg: 'bg-slate-900 border-slate-800 text-white',
          valueColor: 'text-white',
          iconColor: 'text-slate-200 bg-slate-800',
        };
      default:
        return {
          cardBg: 'bg-white border-slate-200',
          valueColor: 'text-slate-900',
          iconColor: 'text-slate-500 bg-slate-100',
        };
    }
  };

  const styles = getVariantStyles();

  return (
    <div
      id={id}
      onClick={onClick}
      className={`rounded-xl border p-4 transition-all duration-150 ${styles.cardBg} ${
        onClick ? 'cursor-pointer hover:border-slate-300 hover:shadow-xs' : ''
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <span
          className={`text-xs font-medium tracking-tight ${
            variant === 'accent' ? 'text-slate-400' : 'text-slate-500'
          }`}
        >
          {label}
        </span>
        {Icon && (
          <div className={`p-1.5 rounded-lg ${styles.iconColor}`}>
            <Icon className="w-4 h-4" />
          </div>
        )}
      </div>

      <div className="mt-2 flex items-baseline gap-2">
        <div className={`text-2xl font-semibold tracking-tight font-mono ${styles.valueColor}`}>
          {value}
        </div>
        {badgeText && (
          <span className="text-[11px] font-medium px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-600">
            {badgeText}
          </span>
        )}
      </div>

      {subValue && (
        <div
          className={`mt-1.5 text-xs truncate ${
            variant === 'accent' ? 'text-slate-400' : 'text-slate-500'
          }`}
        >
          {subValue}
        </div>
      )}
    </div>
  );
};
