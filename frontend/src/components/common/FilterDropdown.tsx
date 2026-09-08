import React from 'react';
import { Filter } from 'lucide-react';

interface FilterOption {
  label: string;
  value: string;
}

interface FilterDropdownProps {
  label?: string;
  options: FilterOption[];
  selectedValue: string;
  onSelect: (val: string) => void;
  id?: string;
}

export const FilterDropdown: React.FC<FilterDropdownProps> = ({
  options,
  selectedValue,
  onSelect,
  id,
}) => {
  return (
    <div className="relative inline-flex items-center">
      <div className="relative">
        <select
          id={id}
          value={selectedValue}
          onChange={(e) => onSelect(e.target.value)}
          className="appearance-none bg-white border border-slate-200 text-slate-700 text-xs font-medium rounded-[10px] pl-8 pr-7 py-2 cursor-pointer hover:bg-slate-50 focus:outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-400 transition-colors"
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <Filter className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        <span className="text-slate-400 text-[10px] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none">
          ▼
        </span>
      </div>
    </div>
  );
};
