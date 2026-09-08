import React, { useState, useEffect } from 'react';
import { X, DollarSign, Calculator, AlertCircle } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { addExpense } from '../../store/slices/expensesSlice';
import { updateMemberBalances } from '../../store/slices/groupsSlice';
import { addNotification } from '../../store/slices/accountabilitySlice';
import { addToast } from '../../store/slices/uiSlice';
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
  const [splitType, setSplitType] = useState<'equal' | 'manual'>('equal');
  const [manualShares, setManualShares] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize manual splits when opening
  useEffect(() => {
    if (isOpen) {
      setDescription('');
      setAmount('');
      setSplitType('equal');
      setError(null);
      const initial: Record<string, string> = {};
      members.forEach((m) => {
        initial[m.userId] = '';
      });
      setManualShares(initial);
    }
  }, [isOpen, members]);

  if (!isOpen) return null;

  const parsedTotal = parseFloat(amount) || 0;

  const manualSum: number = Object.values(manualShares).reduce<number>(
    (sum: number, val: string) => sum + (parseFloat(val) || 0),
    0
  );
  const difference: number = Math.round((parsedTotal - manualSum) * 100) / 100;

  const handleManualShareChange = (userId: string, val: string) => {
    setManualShares((prev) => ({
      ...prev,
      [userId]: val,
    }));
  };

  const distributeEquallyToManual = () => {
    if (parsedTotal <= 0) return;
    const count = members.length;
    const base = Math.floor((parsedTotal / count) * 100) / 100;
    const remainder = Math.round((parsedTotal - base * count) * 100) / 100;

    const distributed: Record<string, string> = {};
    members.forEach((m, idx) => {
      distributed[m.userId] = (idx === 0 ? base + remainder : base).toFixed(2);
    });
    setManualShares(distributed);
  };

  const handleSubmit = (e: React.FormEvent) => {
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

    if (splitType === 'manual' && Math.abs(difference) > 0.01) {
      setError(
        `The sum of individual shares (${currentGroup.currencySymbol}${manualSum.toFixed(
          2
        )}) must match the total (${currentGroup.currencySymbol}${parsedTotal.toFixed(
          2
        )}). Difference: ${currentGroup.currencySymbol}${difference.toFixed(2)}.`
      );
      return;
    }

    setIsSubmitting(true);

    let calculatedSplits: ExpenseSplit[] = [];
    const count = members.length;

    const expenseId = `exp-${Date.now()}`;

    if (splitType === 'equal') {
      const base = Math.floor((parsedTotal / count) * 100) / 100;
      const remainder = Math.round((parsedTotal - base * count) * 100) / 100;

      calculatedSplits = members.map((m, idx) => {
        const assigned = idx === 0 ? base + remainder : base;
        const isPayer = m.userId === currentUser.id;
        const statusVal: PaymentStatus = isPayer ? 'completed' : 'pending';
        return {
          splitId: `split-${Date.now()}-${idx}`,
          expenseId,
          userId: m.userId,
          userName: m.name,
          userEmail: m.email,
          assignedAmount: assigned,
          paymentStatus: statusVal,
          status: statusVal,
          paidAt: isPayer ? new Date().toISOString() : null,
        };
      });
    } else {
      calculatedSplits = members.map((m, idx) => {
        const assigned = parseFloat(manualShares[m.userId]) || 0;
        const isPayer = m.userId === currentUser.id;
        const statusVal: PaymentStatus = isPayer ? 'completed' : 'pending';
        return {
          splitId: `split-${Date.now()}-${idx}`,
          expenseId,
          userId: m.userId,
          userName: m.name,
          userEmail: m.email,
          assignedAmount: assigned,
          paymentStatus: statusVal,
          status: statusVal,
          paidAt: isPayer ? new Date().toISOString() : null,
        };
      });
    }

    const newExpense: Expense = {
      id: expenseId,
      groupId: currentGroup.id,
      description: description.trim(),
      amount: parsedTotal,
      createdBy: currentUser.id,
      createdByName: currentUser.name,
      createdAt: new Date().toISOString(),
      splits: calculatedSplits,
    };

    // Calculate updated member balances
    const newBalances: Record<string, number> = {};
    members.forEach((m) => {
      const mySplit = calculatedSplits.find((s) => s.userId === m.userId)?.assignedAmount || 0;
      if (m.userId === currentUser.id) {
        // Payer paid total, owes mySplit -> net effect is -(total - mySplit)
        newBalances[m.userId] = m.balance - (parsedTotal - mySplit);
      } else {
        // Debtor owes mySplit
        newBalances[m.userId] = m.balance + mySplit;
      }
    });

    dispatch(addExpense(newExpense));
    dispatch(updateMemberBalances(newBalances));

    dispatch(
      addNotification({
        notificationId: `notif-${Date.now()}`,
        type: 'expense_created',
        groupId: currentGroup.id,
        groupName: currentGroup.name,
        message: `${currentUser.name} recorded "${newExpense.description}" for ${currentGroup.currencySymbol}${newExpense.amount.toFixed(2)}`,
        read: false,
        createdAt: new Date().toISOString(),
      })
    );

    dispatch(
      addToast({
        type: 'success',
        title: 'Expense Recorded',
        message: `Added "${newExpense.description}" (${currentGroup.currencySymbol}${newExpense.amount.toFixed(2)}).`,
      })
    );

    setIsSubmitting(false);
    onClose();
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

          {/* Split Type Selector */}
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1.5">
              Split Allocation Method
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setSplitType('equal')}
                className={`py-2 px-3 text-xs font-medium rounded-[10px] border flex items-center justify-center gap-1.5 transition-all ${
                  splitType === 'equal'
                    ? 'border-emerald-500 bg-emerald-50/50 text-emerald-800 shadow-2xs'
                    : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                }`}
              >
                <Calculator className="w-3.5 h-3.5" />
                <span>Equal Split</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setSplitType('manual');
                  distributeEquallyToManual();
                }}
                className={`py-2 px-3 text-xs font-medium rounded-[10px] border flex items-center justify-center gap-1.5 transition-all ${
                  splitType === 'manual'
                    ? 'border-emerald-500 bg-emerald-50/50 text-emerald-800 shadow-2xs'
                    : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                }`}
              >
                <DollarSign className="w-3.5 h-3.5" />
                <span>Manual Share</span>
              </button>
            </div>
          </div>

          {/* Equal Split Summary */}
          {splitType === 'equal' && (
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
          )}

          {/* Manual Splits Allocation List */}
          {splitType === 'manual' && (
            <div className="space-y-2.5 p-3 bg-slate-50 border border-slate-200 rounded-xl">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-800">
                <span>Custom Member Shares</span>
                <button
                  type="button"
                  onClick={distributeEquallyToManual}
                  className="text-[11px] text-emerald-600 hover:text-emerald-700 font-medium"
                >
                  Reset to Equal
                </button>
              </div>

              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {members.map((member) => (
                  <div key={member.userId} className="flex items-center justify-between gap-2">
                    <span className="text-xs text-slate-700 truncate max-w-[160px]">
                      {member.name}
                    </span>
                    <div className="relative w-28">
                      <span className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none text-[11px] text-slate-400 font-mono">
                        {currentGroup.currencySymbol}
                      </span>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={manualShares[member.userId] || ''}
                        onChange={(e) => handleManualShareChange(member.userId, e.target.value)}
                        placeholder="0.00"
                        className="w-full bg-white border border-slate-200 text-slate-900 font-mono text-xs rounded-lg pl-6 pr-2 py-1 focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-xs">
                <span className="text-slate-500">Allocated Sum:</span>
                <span
                  className={`font-mono font-semibold ${
                    Math.abs(difference) <= 0.01 ? 'text-emerald-600' : 'text-rose-600'
                  }`}
                >
                  {currentGroup.currencySymbol}
                  {manualSum.toFixed(2)} / {currentGroup.currencySymbol}
                  {parsedTotal.toFixed(2)}
                </span>
              </div>
            </div>
          )}

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
