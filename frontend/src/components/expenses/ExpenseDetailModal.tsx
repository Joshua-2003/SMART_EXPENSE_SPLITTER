import React from 'react';
import { X, Calendar, User, CheckCircle2, Clock, Bell } from 'lucide-react';
import { Expense } from '../../types';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { markSplitCompleted } from '../../store/slices/expensesSlice';
import { updateMemberBalances } from '../../store/slices/groupsSlice';
import { addNotification } from '../../store/slices/accountabilitySlice';
import { addToast } from '../../store/slices/uiSlice';
import { StatusBadge } from '../common/StatusBadge';

interface ExpenseDetailModalProps {
  expense: Expense | null;
  onClose: () => void;
}

export const ExpenseDetailModal: React.FC<ExpenseDetailModalProps> = ({ expense, onClose }) => {
  const dispatch = useAppDispatch();
  const { currentGroup, members } = useAppSelector((state) => state.groups);
  const { currentUser } = useAppSelector((state) => state.auth);

  if (!expense) return null;

  const isCurrentUserAdmin = currentGroup.adminId === currentUser.id;
  const paidSplitsCount = expense.splits.filter((s) => s.paymentStatus === 'completed').length;
  const isFullySettled = paidSplitsCount === expense.splits.length;

  const formattedDate = new Date(expense.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  const handleMarkPaid = (splitId: string, debtorUserId: string, assignedAmount: number) => {
    dispatch(
      markSplitCompleted({
        expenseId: expense.id,
        splitId,
      })
    );

    // Update member balance: debtor paid off `assignedAmount`, payer gets back `assignedAmount`
    const newBalances: Record<string, number> = {};
    members.forEach((m) => {
      if (m.userId === debtorUserId) {
        newBalances[m.userId] = Math.max(0, m.balance - assignedAmount);
      } else if (m.userId === expense.createdBy) {
        newBalances[m.userId] = Math.min(0, m.balance + assignedAmount);
      }
    });
    dispatch(updateMemberBalances(newBalances));

    dispatch(
      addToast({
        type: 'success',
        title: 'Share Settled',
        message: `Marked share of ${currentGroup.currencySymbol}${assignedAmount.toFixed(2)} as paid.`,
      })
    );
  };

  const handleSendReminder = (userName: string, amt: number) => {
    dispatch(
      addNotification({
        notificationId: `notif-${Date.now()}`,
        type: 'payment_reminder',
        groupId: currentGroup.id,
        groupName: currentGroup.name,
        message: `Reminder sent to ${userName} for ${currentGroup.currencySymbol}${amt.toFixed(2)} (${expense.description})`,
        read: false,
        createdAt: new Date().toISOString(),
      })
    );
    dispatch(
      addToast({
        type: 'info',
        title: 'Reminder Sent',
        message: `Notified ${userName} about their pending share.`,
      })
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
      <div className="relative w-full max-w-lg bg-white rounded-xl border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-200 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-semibold text-slate-900">{expense.description}</h2>
              {isFullySettled ? (
                <StatusBadge status="completed" size="sm" />
              ) : (
                <StatusBadge status="pending" size="sm" />
              )}
            </div>
            <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                {formattedDate}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <User className="w-3.5 h-3.5" />
                Paid by {expense.createdByName}
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:text-slate-600 focus:outline-none"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4 overflow-y-auto flex-1">
          {/* Total Overview banner */}
          <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-xl flex items-center justify-between">
            <div>
              <div className="text-xs text-slate-500">Total Expense Amount</div>
              <div className="text-xl font-bold font-mono text-slate-900 mt-0.5">
                {currentGroup.currencySymbol}
                {expense.amount.toFixed(2)}
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs text-slate-500">Settlement Progress</div>
              <div className="text-xs font-semibold text-slate-700 mt-0.5">
                {paidSplitsCount} of {expense.splits.length} shares settled
              </div>
            </div>
          </div>

          {/* Member Splits List */}
          <div>
            <h3 className="text-xs font-semibold text-slate-900 mb-2 uppercase tracking-wider">
              Individual Member Shares
            </h3>
            <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden bg-white">
              {expense.splits.map((split) => {
                const isPayer = split.userId === expense.createdBy;
                const canMarkPaid =
                  split.paymentStatus === 'pending' &&
                  (isCurrentUserAdmin ||
                    currentUser.id === expense.createdBy ||
                    currentUser.id === split.userId);

                return (
                  <div
                    key={split.splitId}
                    className="p-3.5 flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-7 h-7 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-slate-700 shrink-0 text-xs">
                        {split.userName.charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <div className="font-semibold text-slate-900 flex items-center gap-1.5 truncate">
                          <span>{split.userName}</span>
                          {isPayer && (
                            <span className="text-[10px] text-slate-500 font-normal">
                              (Original Payer)
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <div className="text-right">
                        <div className="font-mono font-semibold text-slate-900">
                          {currentGroup.currencySymbol}
                          {split.assignedAmount.toFixed(2)}
                        </div>
                        <div className="text-[10px]">
                          {split.paymentStatus === 'completed' ? (
                            <span className="text-emerald-600 font-medium inline-flex items-center gap-0.5">
                              <CheckCircle2 className="w-3 h-3" /> Paid
                            </span>
                          ) : (
                            <span className="text-slate-400 inline-flex items-center gap-0.5">
                              <Clock className="w-3 h-3" /> Pending
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Action buttons */}
                      {split.paymentStatus === 'pending' && (
                        <div className="flex items-center gap-1">
                          {canMarkPaid && (
                            <button
                              type="button"
                              onClick={() =>
                                handleMarkPaid(
                                  split.splitId,
                                  split.userId,
                                  split.assignedAmount
                                )
                              }
                              className="px-2.5 py-1 text-xs font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200/80 rounded-lg transition-colors cursor-pointer"
                              title="Mark this split as completed"
                            >
                              Mark Paid
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() =>
                              handleSendReminder(split.userName, split.assignedAmount)
                            }
                            className="p-1 text-slate-400 hover:text-amber-600 rounded-lg hover:bg-slate-100 transition-colors"
                            title="Send gentle payment reminder"
                          >
                            <Bell className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs text-slate-500">
          <span>Expense ID: {expense.id}</span>
          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-[10px] shadow-xs transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
