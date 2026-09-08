import React, { useState, useMemo } from 'react';
import { Plus, Receipt, ArrowUpDown, ChevronRight } from 'lucide-react';
import { Expense } from '../../types';
import { useApp } from '../../context/AppContext';
import { DataTable, Column } from '../common/DataTable';
import { SearchBar } from '../common/SearchBar';
import { FilterDropdown } from '../common/FilterDropdown';
import { StatusBadge } from '../common/StatusBadge';
import { ExpenseDetailModal } from './ExpenseDetailModal';

interface ExpenseListProps {
  onOpenNewExpense: () => void;
}

export const ExpenseList: React.FC<ExpenseListProps> = ({ onOpenNewExpense }) => {
  const { currentGroup, expenses } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortKey, setSortKey] = useState<'createdAt' | 'amount'>('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);

  const filteredExpenses = useMemo(() => {
    let list = [...expenses];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (e) =>
          e.description.toLowerCase().includes(q) ||
          e.createdByName.toLowerCase().includes(q)
      );
    }

    if (statusFilter === 'settled') {
      list = list.filter((e) => e.splits.every((s) => s.status === 'completed'));
    } else if (statusFilter === 'pending') {
      list = list.filter((e) => e.splits.some((s) => s.status === 'pending'));
    }

    list.sort((a, b) => {
      if (sortKey === 'createdAt') {
        const timeA = new Date(a.createdAt).getTime();
        const timeB = new Date(b.createdAt).getTime();
        return sortOrder === 'asc' ? timeA - timeB : timeB - timeA;
      } else {
        return sortOrder === 'asc' ? a.amount - b.amount : b.amount - a.amount;
      }
    });

    return list;
  }, [expenses, searchQuery, statusFilter, sortKey, sortOrder]);

  const handleSort = (key: string) => {
    if (key === 'createdAt' || key === 'amount') {
      if (sortKey === key) {
        setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
      } else {
        setSortKey(key);
        setSortOrder('desc');
      }
    }
  };

  const columns: Column<Expense>[] = [
    {
      key: 'description',
      header: 'Expense Description',
      sortable: false,
      render: (exp) => (
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
            <Receipt className="w-4 h-4" />
          </div>
          <div>
            <div className="font-semibold text-slate-900">{exp.description}</div>
            <div className="text-[11px] text-slate-500">
              Paid by <span className="font-medium text-slate-700">{exp.createdByName}</span>
            </div>
          </div>
        </div>
      ),
    },
    {
      key: 'amount',
      header: 'Amount',
      sortable: true,
      align: 'right',
      render: (exp) => (
        <div className="font-mono font-semibold text-slate-900 text-sm">
          {currentGroup.currencySymbol}
          {exp.amount.toFixed(2)}
        </div>
      ),
    },
    {
      key: 'createdAt',
      header: 'Recorded On',
      sortable: true,
      render: (exp) => (
        <div className="text-slate-500">
          {new Date(exp.createdAt).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          })}
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Split Status',
      sortable: false,
      render: (exp) => {
        const total = exp.splits.length;
        const paid = exp.splits.filter((s) => s.status === 'completed').length;
        const isSettled = paid === total;

        return (
          <div className="flex items-center gap-2">
            <StatusBadge status={isSettled ? 'completed' : 'pending'} size="sm" />
            <span className="text-[11px] text-slate-500 font-mono">
              ({paid}/{total} paid)
            </span>
          </div>
        );
      },
    },
    {
      key: 'actions',
      header: '',
      align: 'right',
      render: () => (
        <span className="text-slate-400 group-hover:text-slate-600">
          <ChevronRight className="w-4 h-4" />
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      {/* Subheader and Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold text-slate-900 tracking-tight">Shared Expenses</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            View, track, and inspect all recorded transactions in {currentGroup.name}.
          </p>
        </div>

        <button
          type="button"
          onClick={onOpenNewExpense}
          className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 text-xs font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-[10px] shadow-xs transition-colors shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add Expense</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-2.5">
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Filter by description or payer..."
          className="w-full sm:w-72"
        />

        <FilterDropdown
          selectedValue={statusFilter}
          onSelect={setStatusFilter}
          options={[
            { label: 'All Statuses', value: 'all' },
            { label: 'Pending Shares', value: 'pending' },
            { label: 'Fully Settled', value: 'settled' },
          ]}
        />
      </div>

      {/* Expenses Table */}
      <DataTable
        columns={columns}
        data={filteredExpenses}
        keyExtractor={(e) => e.id}
        sortKey={sortKey}
        sortOrder={sortOrder}
        onSort={handleSort}
        onRowClick={(e) => setSelectedExpense(e)}
        emptyTitle="No expenses found"
        emptyDescription="There are no expenses in this group matching your search criteria."
        emptyActionLabel="Record First Expense"
        onEmptyAction={onOpenNewExpense}
      />

      {/* Expense Detail Modal */}
      <ExpenseDetailModal
        expense={selectedExpense}
        onClose={() => setSelectedExpense(null)}
      />
    </div>
  );
};
