import React, { useState } from 'react';
import {
  Scale,
  ArrowRight,
  CheckCircle2,
  Clock,
  DollarSign,
  AlertCircle,
  TrendingDown,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { MetricCard } from '../common/MetricCard';
import { ConfirmationModal } from '../common/ConfirmationModal';

export const SettlementView: React.FC = () => {
  const {
    currentGroup,
    members,
    expenses,
    totalGroupExpenses,
    totalGroupPendingAmount,
    getSimplifiedDebts,
    markSplitPaid,
    addToast,
    isLoading,
  } = useApp();

  const debts = getSimplifiedDebts();
  const [selectedDebtToSettle, setSelectedDebtToSettle] = useState<{
    fromUserId: string;
    fromUserName: string;
    toUserId: string;
    toUserName: string;
    amount: number;
  } | null>(null);

  const totalSettledAmount = Math.max(0, totalGroupExpenses - totalGroupPendingAmount);
  const settlementPercentage =
    totalGroupExpenses > 0
      ? Math.round((totalSettledAmount / totalGroupExpenses) * 100)
      : 100;

  const handleConfirmDebtSettlement = async () => {
    if (!selectedDebtToSettle) return;

    // Find first pending split for this debtor in current group expenses
    const matchingExpense = expenses.find((e) =>
      e.splits.some(
        (s) => s.userId === selectedDebtToSettle.fromUserId && s.status === 'pending'
      )
    );

    if (matchingExpense) {
      const split = matchingExpense.splits.find(
        (s) => s.userId === selectedDebtToSettle.fromUserId && s.status === 'pending'
      );
      if (split) {
        await markSplitPaid(matchingExpense.id, split.splitId, split.userId);
      }
    } else {
      addToast({
        type: 'success',
        title: 'Settlement Recorded',
        message: `${selectedDebtToSettle.fromUserName} payment of ${
          currentGroup.currencySymbol
        }${selectedDebtToSettle.amount.toFixed(2)} to ${
          selectedDebtToSettle.toUserName
        } recorded.`,
      });
    }

    setSelectedDebtToSettle(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-base font-semibold text-slate-900 tracking-tight">
          Settlement Matrix & Payouts
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Automated debt simplification calculating minimum transactions needed to zero out all
          balances in {currentGroup.name}.
        </p>
      </div>

      {/* Metrics Row */}
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
          value={`${currentGroup.currencySymbol}${totalGroupPendingAmount.toFixed(2)}`}
          variant={totalGroupPendingAmount > 0 ? 'warning' : 'default'}
          subValue={debts.length > 0 ? `${debts.length} active balance transfer(s)` : 'All clear!'}
        />
      </div>

      {/* Progress Bar */}
      <div className="p-4 bg-white border border-slate-200 rounded-xl space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-slate-900">Group Settlement Health</span>
          <span className="font-mono text-slate-600 font-medium">{settlementPercentage}% Settled</span>
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

      {/* Simplified Debts / Actionable Transfers */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-semibold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
            <Scale className="w-3.5 h-3.5 text-slate-500" />
            Suggested Simplified Settlements
          </h3>
          <span className="text-[11px] text-slate-500">
            {debts.length === 0 ? 'No open debts' : `${debts.length} payment(s) to settle all`}
          </span>
        </div>

        {debts.length === 0 ? (
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
            {debts.map((debt, idx) => (
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
                  <button
                    type="button"
                    onClick={() => setSelectedDebtToSettle(debt)}
                    className="px-2.5 py-1 text-xs font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200/80 rounded-lg transition-colors"
                  >
                    Confirm Paid
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Member Balance Breakdown Ledger */}
      <div className="space-y-2">
        <h3 className="text-xs font-semibold text-slate-900 uppercase tracking-wider">
          Individual Balance Status
        </h3>

        <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden bg-white">
          {members.map((m) => (
            <div
              key={m.userId}
              className="p-3.5 flex items-center justify-between gap-3 text-xs"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-slate-700 text-xs">
                  {m.name.charAt(0)}
                </div>
                <div>
                  <div className="font-medium text-slate-900">{m.name}</div>
                  <div className="text-[11px] text-slate-400">{m.email}</div>
                </div>
              </div>

              <div className="text-right">
                {m.balance > 0.01 ? (
                  <span className="font-mono font-semibold text-rose-600">
                    Owes {currentGroup.currencySymbol}
                    {m.balance.toFixed(2)}
                  </span>
                ) : m.balance < -0.01 ? (
                  <span className="font-mono font-semibold text-emerald-600">
                    Gets back {currentGroup.currencySymbol}
                    {Math.abs(m.balance).toFixed(2)}
                  </span>
                ) : (
                  <span className="font-mono text-slate-400">Settled (₱0.00)</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Settlement Confirmation Modal */}
      <ConfirmationModal
        isOpen={!!selectedDebtToSettle}
        onClose={() => setSelectedDebtToSettle(null)}
        onConfirm={handleConfirmDebtSettlement}
        title="Confirm Payment Settlement"
        description={`Record that ${selectedDebtToSettle?.fromUserName} has settled ${
          currentGroup.currencySymbol
        }${selectedDebtToSettle?.amount.toFixed(2)} with ${
          selectedDebtToSettle?.toUserName
        }? This updates group balances and reflects in payment history.`}
        confirmLabel="Record Settlement"
        variant="primary"
        isLoading={isLoading}
      />
    </div>
  );
};
