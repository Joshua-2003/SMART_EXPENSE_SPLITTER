import React, { useState } from 'react';
import { Scale, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { markSplitCompleted } from '../../store/slices/expensesSlice';
import { updateMemberBalances } from '../../store/slices/groupsSlice';
import { addToast } from '../../store/slices/uiSlice';
import { MetricCard } from '../../components/common/MetricCard';
import { PageHeader } from '../../components/common/PageHeader';
import { ConfirmationModal } from '../../components/common/ConfirmationModal';
import { Button } from '../../components/ui/Button';
import { calculateSimplifiedDebts } from '../../utils/debtSimplifier';
import { SimplifiedDebt } from '../../types';

export const SettlementPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { currentGroup, members } = useAppSelector((state) => state.groups);
  const { expenses } = useAppSelector((state) => state.expenses);

  const [selectedDebt, setSelectedDebt] = useState<SimplifiedDebt | null>(null);

  // Compute metrics
  const totalGroupExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  const pendingSplits = expenses.flatMap((e) =>
    e.splits.filter((s) => s.paymentStatus === 'pending')
  );
  const totalPendingAmount = pendingSplits.reduce((sum, s) => sum + s.assignedAmount, 0);
  const totalSettledAmount = Math.max(0, totalGroupExpenses - totalPendingAmount);
  const settlementPercentage =
    totalGroupExpenses > 0
      ? Math.round((totalSettledAmount / totalGroupExpenses) * 100)
      : 100;

  const simplifiedDebts = calculateSimplifiedDebts(members);

  const handleConfirmSettlement = () => {
    if (!selectedDebt) return;

    // Find first pending split for this debtor
    const matchingExpense = expenses.find((e) =>
      e.splits.some(
        (s) => s.userId === selectedDebt.fromUserId && s.paymentStatus === 'pending'
      )
    );

    if (matchingExpense) {
      const split = matchingExpense.splits.find(
        (s) => s.userId === selectedDebt.fromUserId && s.paymentStatus === 'pending'
      );
      if (split) {
        dispatch(
          markSplitCompleted({
            expenseId: matchingExpense.id,
            splitId: split.splitId,
          })
        );
      }
    }

    // Update balances
    const newBalances: Record<string, number> = {};
    members.forEach((m) => {
      if (m.userId === selectedDebt.fromUserId) {
        newBalances[m.userId] = Math.max(0, m.balance - selectedDebt.amount);
      } else if (m.userId === selectedDebt.toUserId) {
        newBalances[m.userId] = Math.min(0, m.balance + selectedDebt.amount);
      }
    });
    dispatch(updateMemberBalances(newBalances));

    dispatch(
      addToast({
        type: 'success',
        title: 'Settlement Confirmed',
        message: `${selectedDebt.fromUserName} payment of ${currentGroup.currencySymbol}${selectedDebt.amount.toFixed(
          2
        )} to ${selectedDebt.toUserName} recorded.`,
      })
    );

    setSelectedDebt(null);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Settlement Matrix & Payouts"
        description={`Algorithmic debt simplification minimizing total transactions needed to settle ${currentGroup.name}.`}
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <MetricCard
          label="Total Recorded Expenses"
          value={`${currentGroup.currencySymbol}${totalGroupExpenses.toFixed(2)}`}
          subValue={`Across ${expenses.length} shared items`}
        />
        <MetricCard
          label="Settled & Paid"
          value={`${currentGroup.currencySymbol}${totalSettledAmount.toFixed(2)}`}
          variant="positive"
          badgeText={`${settlementPercentage}% complete`}
        />
        <MetricCard
          label="Awaiting Settlement"
          value={`${currentGroup.currencySymbol}${totalPendingAmount.toFixed(2)}`}
          variant={totalPendingAmount > 0 ? 'warning' : 'default'}
          subValue={
            simplifiedDebts.length > 0
              ? `${simplifiedDebts.length} active balance transfer(s)`
              : 'All clear!'
          }
        />
      </div>

      {/* Progress Bar */}
      <div className="p-4 bg-white border border-slate-200 rounded-xl space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-slate-900">Group Settlement Progress</span>
          <span className="font-mono text-slate-600 font-medium">
            {settlementPercentage}% Settled
          </span>
        </div>
        <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden flex">
          <div
            className="bg-emerald-500 h-full transition-all duration-500"
            style={{ width: `${settlementPercentage}%` }}
          />
          <div
            className="bg-amber-400 h-full transition-all duration-500"
            style={{ width: `${100 - settlementPercentage}%` }}
          />
        </div>
        <div className="flex items-center justify-between text-[11px] text-slate-400 pt-0.5">
          <span className="flex items-center gap-1 text-emerald-700">
            <span className="w-2 h-2 rounded-full bg-emerald-500" /> Paid shares
          </span>
          <span className="flex items-center gap-1 text-amber-700">
            <span className="w-2 h-2 rounded-full bg-amber-400" /> Pending splits
          </span>
        </div>
      </div>

      {/* Simplified Debts Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-semibold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
            <Scale className="w-3.5 h-3.5 text-slate-500" />
            Suggested Simplified Settlements
          </h3>
          <span className="text-[11px] text-slate-500">
            {simplifiedDebts.length === 0
              ? 'No open debts'
              : `${simplifiedDebts.length} payment(s) to settle all`}
          </span>
        </div>

        {simplifiedDebts.length === 0 ? (
          <div className="p-8 text-center bg-white border border-dashed border-slate-200 rounded-xl">
            <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-2">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <h4 className="text-xs font-semibold text-slate-900">Group is completely settled!</h4>
            <p className="text-[11px] text-slate-500 mt-1">
              Everyone is square. No pending transfers required at this time.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {simplifiedDebts.map((debt, idx) => (
              <div
                key={idx}
                className="p-4 bg-white border border-slate-200 rounded-xl flex items-center justify-between gap-3 shadow-2xs hover:border-slate-300 transition-all"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-full bg-rose-50 border border-rose-200 text-rose-700 flex items-center justify-center font-bold text-xs shrink-0">
                    {debt.fromUserName.charAt(0)}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 text-xs">
                      <span className="font-semibold text-slate-900 truncate">
                        {debt.fromUserName}
                      </span>
                      <ArrowRight className="w-3 h-3 text-slate-400 shrink-0" />
                      <span className="font-semibold text-slate-900 truncate">
                        {debt.toUserName}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5">
                      Direct debt reimbursement
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 shrink-0">
                  <span className="font-mono font-bold text-sm text-slate-900">
                    {currentGroup.currencySymbol}
                    {debt.amount.toFixed(2)}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedDebt(debt)}
                    className="border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                  >
                    Confirm Paid
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={!!selectedDebt}
        onClose={() => setSelectedDebt(null)}
        onConfirm={handleConfirmSettlement}
        title="Confirm Payment Settlement"
        description={`Record that ${selectedDebt?.fromUserName} has paid ${
          currentGroup.currencySymbol
        }${selectedDebt?.amount.toFixed(2)} to ${selectedDebt?.toUserName}?`}
        confirmLabel="Record Settlement"
        variant="primary"
      />
    </div>
  );
};
