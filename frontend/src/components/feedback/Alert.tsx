import React from 'react';
import { AlertCircle, CheckCircle2, Info, AlertTriangle, X } from 'lucide-react';
import { cn } from '../../utils/cn';

export interface AlertProps {
  variant?: 'info' | 'success' | 'warning' | 'error';
  title?: string;
  children: React.ReactNode;
  onDismiss?: () => void;
  className?: string;
}

export const Alert: React.FC<AlertProps> = ({
  variant = 'info',
  title,
  children,
  onDismiss,
  className,
}) => {
  const styles = {
    info: 'bg-sky-50/80 border-sky-200 text-sky-900',
    success: 'bg-emerald-50/80 border-emerald-200 text-emerald-900',
    warning: 'bg-amber-50/80 border-amber-200 text-amber-900',
    error: 'bg-rose-50/80 border-rose-200 text-rose-900',
  };

  const icons = {
    info: <Info className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />,
    success: <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />,
    warning: <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />,
    error: <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />,
  };

  return (
    <div
      className={cn(
        'p-3.5 rounded-xl border flex items-start justify-between gap-3 text-xs leading-relaxed',
        styles[variant],
        className
      )}
      role="alert"
    >
      <div className="flex items-start gap-2.5">
        {icons[variant]}
        <div>
          {title && <h4 className="font-semibold mb-0.5">{title}</h4>}
          <div className="opacity-90">{children}</div>
        </div>
      </div>
      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          className="p-1 -mr-1 text-current opacity-60 hover:opacity-100 rounded-md transition-opacity"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
};
