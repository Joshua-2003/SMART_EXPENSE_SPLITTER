import React from 'react';
import { Search, Filter, RotateCcw } from 'lucide-react';
import { cn } from '../../utils/cn';

export interface FilterOption {
  value: string;
  label: string;
}

export interface FilterBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  searchPlaceholder?: string;
  filterValue?: string;
  onFilterChange?: (val: string) => void;
  filterOptions?: FilterOption[];
  filterLabel?: string;
  onReset?: () => void;
  children?: React.ReactNode;
  className?: string;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  searchQuery,
  onSearchChange,
  searchPlaceholder = 'Search records...',
  filterValue,
  onFilterChange,
  filterOptions,
  filterLabel = 'Status',
  onReset,
  children,
  className,
}) => {
  return (
    <div
      className={cn(
        'flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-1',
        className
      )}
    >
      <div className="flex flex-1 items-center gap-2.5 min-w-0">
        {/* Search input */}
        <div className="relative flex-1 max-w-sm rounded-[10px] shadow-2xs">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Search className="w-3.5 h-3.5" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={searchPlaceholder}
            className="w-full bg-white border border-slate-200 text-slate-900 text-xs rounded-[10px] pl-9 pr-3 py-2 placeholder:text-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
          />
        </div>

        {/* Status Dropdown */}
        {filterOptions && onFilterChange && (
          <div className="relative shrink-0">
            <select
              value={filterValue}
              onChange={(e) => onFilterChange(e.target.value)}
              className="bg-white border border-slate-200 text-slate-800 text-xs rounded-[10px] pl-3 pr-8 py-2 focus:outline-none focus:border-emerald-500 cursor-pointer shadow-2xs"
            >
              {filterOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Reset button if filter is active */}
        {onReset && (searchQuery || (filterValue && filterValue !== 'all')) && (
          <button
            type="button"
            onClick={onReset}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
            title="Reset active filters"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {children && <div className="flex items-center gap-2 shrink-0">{children}</div>}
    </div>
  );
};
