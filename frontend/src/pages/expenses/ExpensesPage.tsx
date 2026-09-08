import React, { useState, useMemo } from 'react';
import { Plus, Filter, Calendar, CheckCircle2, Clock } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { setSelectedExpense } from '../../store/slices/expensesSlice';
import { setCreateExpenseOpen } from '../../store/slices/uiSlice';
import { Expense } from '../../types';
import { DataTable, Column } from '../../components/common/DataTable';
import { FilterBar } from '../../components/common/FilterBar';
import { PageHeader } from '../../components/common/PageHeader';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Button } from '../../components/ui/Button';
import { ExpenseDetailModal } from '../../components/expenses/ExpenseDetailModal';

export const ExpensesPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { expenses, selectedExpense } = useAppSelector((state) => state.expenses);
  const { currentGroup } = useAppSelector((state) => state.groups);

  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'date' | 'amount'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const filteredExpenses = useMemo(() => {
    return expenses
      .filter((exp) => {
        const matchesSearch =
          exp.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          exp.createdByName.toLowerCase().includes(searchQuery.toLowerCase());

        if (!matchesSearch) return false;

        const isFullyPaid = exp.splits.every((s) => s.paymentStatus === 'completed');
        if (filterStatus === 'settled') return isFullyPaid;
        if (filterStatus === 'pending') return !isFullyPaid;
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'amount') {
          return sortOrder === 'asc' ? a.amount - b.amount : b.amount - a.amount;
        }
        return sortOrder === 'asc'
          ? new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
  }, [expenses, searchQuery, filterStatus, sortBy, sortOrder]);

  const columns: Column<Expense>[] = [
    {
      key: 'description',
      header: 'Expense Item',
      render: (exp) => (
        <div>
          <div className="font-semibold text-slate-900">{exp.description}</div>
          <div className="text-[11px] text-slate-400 mt-0.5">
            Paid by <span className="text-slate-600 font-medium">{exp.createdByName}</span>
          </div>
        </div>
      ),
    },
    {
      key: 'amount',
      header: 'Total Amount',
      align: 'right',
      render: (exp) => (
        <span className="font-mono font-semibold text-slate-900 text-xs">
          {currentGroup.currencySymbol}
          {exp.amount.toFixed(2)}
        </span>
      ),
    },
    {
      key: 'splits',
      header: 'Split Progress',
      render: (exp) => {
        const total = exp.splits.length;
        const paid = exp.splits.filter((s) => s.paymentStatus === 'completed').length;
        const percent = Math.round((paid / total) * 100);

        return (
          <div className="w-36 space-y-1">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-slate-500">
                {paid} of {total} settled
              </span>
              <span className="font-mono text-slate-600 font-medium">{percent}%</span>
            </div>
            <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-300 ${
                  paid === total ? 'bg-emerald-500' : 'bg-amber-400'
                }`}
                style={{ width: `${percent}%` }}
              />
            </div>
          </div>
        );
      },
    },
    {
      key: 'status',
      header: 'Status',
      render: (exp) => {
        const isSettled = exp.splits.every((s) => s.paymentStatus === 'completed');
        return <StatusBadge status={isSettled ? 'completed' : 'pending'} size="sm" />;
      },
    },
    {
      key: 'createdAt',
      header: 'Date Recorded',
      align: 'right',
      render: (exp) => (
        <span className="text-[11px] text-slate-500 font-mono">
          {new Date(exp.createdAt).toLocaleDateString()}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <PageHeader
        title="Shared Expenses"
        description={`All shared transactions and split allocations for ${currentGroup.name}.`}
        actions={
          <Button
            variant="primary"
            size="sm"
            onClick={() => dispatch(setCreateExpenseOpen(true))}
            leftIcon={<Plus className="w-4 h-4" />}
          >
            Add Shared Expense
          </Button>
        }
      />

      <FilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search description or payer..."
        filterValue={filterStatus}
        onFilterChange={setFilterStatus}
        filterOptions={[
          { value: 'all', label: 'All Statuses' },
          { value: 'pending', label: 'Pending Shares' },
          { value: 'settled', label: 'Fully Settled' },
        ]}
        onReset={() => {
          setSearchQuery('');
          setFilterStatus('all');
        }}
      />

      <DataTable
        columns={columns}
        data={filteredExpenses}
        keyExtractor={(exp) => exp.id}
        onRowClick={(exp) => dispatch(setSelectedExpense(exp))}
        emptyTitle="No expenses found"
        emptyDescription="Try adjusting your search criteria or record a new expense."
      />

      {/* Expense Detail Modal */}
      <ExpenseDetailModal
        expense={selectedExpense}
        onClose={() => dispatch(setSelectedExpense(null))}
      />
    </div>
  );
};
