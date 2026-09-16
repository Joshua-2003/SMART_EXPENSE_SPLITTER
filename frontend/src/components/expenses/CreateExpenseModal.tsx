import React, { useState, useEffect } from 'react';
import { X, AlertCircle } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { addExpense } from '../../store/slices/expensesSlice';
import { updateMemberBalances } from '../../store/slices/groupsSlice';
import { addToast } from '../../store/slices/uiSlice';
import { createExpense } from '../../services/expense.service';
import { Expense, ExpenseSplit, PaymentStatus } from '../../types';

interface CreateExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateExpenseModal: React.FC<CreateExpenseModalProps> = ({ isOpen, onClose }) => {
  const dispatch = useAppDispatch();
  const { currentGroup, members } = useAppSelector((state) => state.groups);
  const { currentUser } = useAppSelector((state) => state.auth);

  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize form when opening
  useEffect(() => {
    if (isOpen) {
      setDescription('');
      setAmount('');
      setError(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const parsedTotal = parseFloat(amount) || 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!description.trim()) {
      setError('Please provide an expense description.');
      return;
    }

    if (parsedTotal <= 0) {
      setError('Amount must be greater than zero.');
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await createExpense(currentGroup.id, {
        description: description.trim(),
        amount: parsedTotal,
        splitType: 'equal',
      });

      const splits: ExpenseSplit[] = result.splits.map((split) => {
        const member = members.find((m) => m.userId === split.userId);
        const isPayer = split.userId === currentUser.id;
        const statusVal: PaymentStatus = isPayer ? 'completed' : 'pending';
        return {
          splitId: split.splitId,
          expenseId: result.expenseId,
          userId: split.userId,
          userName: member?.name ?? 'Unknown',
          userEmail: member?.email,
          assignedAmount: split.assignedAmount,
          paymentStatus: statusVal,
          status: statusVal,
          paidAt: isPayer ? new Date().toISOString() : null,
        };
      });

      const newExpense: Expense = {
        id: result.expenseId,
        groupId: result.groupId,
        description: result.description,
        amount: result.amount,
        createdBy: result.createdBy,
        createdByName: currentUser.name,
        createdAt: result.createdAt,
        splits,
      };

      // Calculate updated member balances
      const newBalances: Record<string, number> = {};
      members.forEach((m) => {
        const mySplit = splits.find((s) => s.userId === m.userId)?.assignedAmount || 0;
        if (m.userId === currentUser.id) {
          // Payer paid total, owes mySplit -> net effect is -(total - mySplit)
          newBalances[m.userId] = m.balance - (newExpense.amount - mySplit);
        } else {
          // Debtor owes mySplit
          newBalances[m.userId] = m.balance + mySplit;
        }
      });

      dispatch(addExpense(newExpense));
      dispatch(updateMemberBalances(newBalances));

      dispatch(
        addToast({
          type: 'success',
          title: 'Expense Recorded',
          message: `Added "${newExpense.description}" (${currentGroup.currencySymbol}${newExpense.amount.toFixed(2)}).`,
        })
      );

      setDescription('');
      setAmount('');
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create expense.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
      <div className="relative w-full max-w-lg bg-white rounded-xl border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold text-slate-900">Add Shared Expense</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Recording in <span className="font-medium text-slate-700">{currentGroup.name}</span>
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:text-slate-600 focus:outline-none"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 overflow-y-auto flex-1">
          {error && (
            <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <div>{error}</div>
            </div>
          )}

          {/* Description */}
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Description <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Hotel accommodation, Baguio bus tickets, Dinner"
              className="w-full bg-white border border-slate-200 text-slate-900 text-xs rounded-[10px] px-3 py-2 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
              required
            />
          </div>

          {/* Total Amount */}
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Total Amount ({currentGroup.currencySymbol}) <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 text-xs font-mono font-bold">
                {currentGroup.currencySymbol}
              </div>
              <input
                type="number"
                step="0.01"
                min="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="w-full bg-white border border-slate-200 text-slate-900 font-mono text-xs rounded-[10px] pl-8 pr-3 py-2 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
                required
              />
            </div>
          </div>

          {/* Equal Split Summary */}
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
            <div className="flex items-center justify-between text-xs text-slate-600">
              <span>Split evenly across:</span>
              <span className="font-semibold text-slate-800">{members.length} members</span>
            </div>
            <div className="flex items-center justify-between text-xs text-slate-600">
              <span>Share per member:</span>
              <span className="font-mono font-bold text-slate-900">
                {currentGroup.currencySymbol}
                {(parsedTotal / Math.max(1, members.length)).toFixed(2)}
              </span>
            </div>
          </div>

          {/* Footer actions */}
          <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-3.5 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 rounded-[10px] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 text-xs font-medium text-white bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 rounded-[10px] shadow-xs transition-colors flex items-center gap-1.5"
            >
              {isSubmitting && (
                <span className="w-3 h-3 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              )}
              <span>Record Expense</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};