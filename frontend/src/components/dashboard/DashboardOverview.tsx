import React from 'react';
import {
  Receipt,
  Users,
  Scale,
  ShieldAlert,
  AlertTriangle,
  Plus,
  ArrowRight,
  TrendingUp,
  Clock,
  CheckCircle2,
  Calendar,
  Sparkles,
  ArrowUpRight,
  ArrowDownLeft,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { MetricCard } from '../common/MetricCard';
import { StatusBadge } from '../common/StatusBadge';
import { ActiveTab } from '../layout/Sidebar';

interface DashboardOverviewProps {
  setActiveTab: (tab: ActiveTab) => void;
  onOpenNewExpense: () => void;
  onOpenAddMember: () => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  setActiveTab,
  onOpenNewExpense,
  onOpenAddMember,
}) => {
  const {
    currentGroup,
    currentUser,
    members,
    expenses,
    totalGroupExpenses,
    totalGroupPendingAmount,
    currentUserBalance,
    getOverdueSplits,
    getMemberReliability,
    isCurrentUserAdmin,
  } = useApp();

  const overdueSplits = getOverdueSplits(7);
  const overdueTotalAmount = overdueSplits.reduce((sum, s) => sum + s.amount, 0);

  // Recent 5 expenses
  const recentExpenses = expenses.slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Top Banner / Hero Context */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 to-slate-800 text-white border border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1 max-w-xl">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              {currentGroup.name}
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs text-slate-300">
              Admin: {currentGroup.adminId === currentUser.id ? 'You' : 'Alex Rivera'}
            </span>
          </div>
          <h2 className="text-xl font-bold tracking-tight text-white">
            Shared Balance & Accountability Dashboard
          </h2>
          <p className="text-xs text-slate-300 leading-relaxed">
            {currentGroup.description || 'Tracking shared expenses with real-time settlement transparency.'}
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={onOpenNewExpense}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-slate-900 bg-emerald-400 hover:bg-emerald-300 rounded-[10px] shadow-sm transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Expense</span>
          </button>
          {isCurrentUserAdmin && (
            <button
              type="button"
              onClick={onOpenAddMember}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-[10px] transition-colors"
            >
              <Users className="w-3.5 h-3.5" />
              <span>Invite</span>
            </button>
          )}
        </div>
      </div>

      {/* Overdue Alert Banner if overdue splits exist */}
      {overdueSplits.length > 0 && (
        <div className="p-4 rounded-xl border border-rose-200 bg-rose-50/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-in fade-in">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-rose-100 text-rose-700 shrink-0">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-semibold text-rose-900 flex items-center gap-2">
                <span>Accountability Warning: {overdueSplits.length} Overdue Payment Split(s)</span>
                <span className="font-mono text-rose-700">
                  ({currentGroup.currencySymbol}
                  {overdueTotalAmount.toFixed(2)})
                </span>
              </div>
              <p className="text-[11px] text-rose-700 mt-0.5 leading-snug">
                One or more members have unpaid splits exceeding the 7-day grace period. Review
                accountability logs to keep the group transparent.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setActiveTab('accountability')}
            className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-rose-800 bg-white border border-rose-200 hover:bg-rose-50 rounded-[10px] shadow-2xs transition-colors shrink-0"
          >
            <span>Review Overdue Log</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Metric 1: Personal Balance */}
        <div className="rounded-xl border border-slate-200 bg-white p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs font-medium text-slate-500">
            <span>Your Personal Balance</span>
            <span className="text-[10px] text-slate-400 font-mono">({currentUser.name})</span>
          </div>

          <div className="my-2">
            {currentUserBalance > 0.01 ? (
              <div>
                <div className="text-xl font-bold font-mono text-rose-600 flex items-center gap-1">
                  <ArrowUpRight className="w-4 h-4" />
                  {currentGroup.currencySymbol}
                  {currentUserBalance.toFixed(2)}
                </div>
                <div className="text-[11px] text-rose-600/90 font-medium mt-0.5">
                  You owe the group
                </div>
              </div>
            ) : currentUserBalance < -0.01 ? (
              <div>
                <div className="text-xl font-bold font-mono text-emerald-600 flex items-center gap-1">
                  <ArrowDownLeft className="w-4 h-4" />
                  {currentGroup.currencySymbol}
                  {Math.abs(currentUserBalance).toFixed(2)}
                </div>
                <div className="text-[11px] text-emerald-600/90 font-medium mt-0.5">
                  Group owes you
                </div>
              </div>
            ) : (
              <div>
                <div className="text-xl font-bold font-mono text-slate-700">Settled (₱0.00)</div>
                <div className="text-[11px] text-slate-400 mt-0.5">You are all squared up</div>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={() => setActiveTab('settlement')}
            className="text-[11px] font-medium text-slate-600 hover:text-slate-900 inline-flex items-center gap-1 pt-2 border-t border-slate-100"
          >
            <span>View settlements</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        {/* Metric 2: Total Group Expenses */}
        <MetricCard
          label="Total Group Spending"
          value={`${currentGroup.currencySymbol}${totalGroupExpenses.toFixed(2)}`}
          subValue={`${expenses.length} recorded expenses`}
          icon={Receipt}
          onClick={() => setActiveTab('expenses')}
        />

        {/* Metric 3: Pending Balances */}
        <MetricCard
          label="Unsettled Shares"
          value={`${currentGroup.currencySymbol}${totalGroupPendingAmount.toFixed(2)}`}
          variant={totalGroupPendingAmount > 0 ? 'warning' : 'default'}
          subValue={`${Math.max(
            0,
            expenses.reduce(
              (acc, e) => acc + e.splits.filter((s) => s.status === 'pending').length,
              0
            )
          )} pending split(s)`}
          icon={Clock}
          onClick={() => setActiveTab('settlement')}
        />

        {/* Metric 4: Members & Reliability */}
        <MetricCard
          label="Group Members"
          value={members.length}
          subValue={
            overdueSplits.length > 0
              ? `${overdueSplits.length} split(s) overdue`
              : '100% on schedule'
          }
          icon={Users}
          onClick={() => setActiveTab('members')}
        />
      </div>

      {/* Main 2-Column Section: Recent Expenses & Member Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Recent Expenses Feed */}
        <div className="lg:col-span-2 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-semibold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <Receipt className="w-3.5 h-3.5 text-slate-500" />
              Recent Shared Expenses
            </h3>
            <button
              type="button"
              onClick={() => setActiveTab('expenses')}
              className="text-xs text-emerald-600 hover:text-emerald-700 font-medium inline-flex items-center gap-0.5"
            >
              <span>View all ({expenses.length})</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          {recentExpenses.length === 0 ? (
            <div className="p-8 text-center bg-white border border-dashed border-slate-200 rounded-xl">
              <p className="text-xs text-slate-500">No expenses recorded yet in this group.</p>
              <button
                type="button"
                onClick={onOpenNewExpense}
                className="mt-2.5 px-3 py-1.5 text-xs font-medium text-white bg-emerald-600 rounded-[10px]"
              >
                Record First Expense
              </button>
            </div>
          ) : (
            <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden bg-white">
              {recentExpenses.map((exp) => {
                const total = exp.splits.length;
                const paid = exp.splits.filter((s) => s.status === 'completed').length;
                const isSettled = paid === total;

                return (
                  <div
                    key={exp.id}
                    onClick={() => setActiveTab('expenses')}
                    className="p-3.5 flex items-center justify-between gap-3 text-xs hover:bg-slate-50 cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-700 shrink-0 font-medium text-xs">
                        ₱
                      </div>
                      <div className="min-w-0">
                        <div className="font-semibold text-slate-900 truncate">
                          {exp.description}
                        </div>
                        <div className="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5">
                          <span>Paid by {exp.createdByName}</span>
                          <span>•</span>
                          <span>{new Date(exp.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="font-mono font-semibold text-slate-900">
                        {currentGroup.currencySymbol}
                        {exp.amount.toFixed(2)}
                      </div>
                      <div className="mt-0.5">
                        <StatusBadge status={isSettled ? 'completed' : 'pending'} size="sm" />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Col: Member Balances Quick Overview */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-semibold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-slate-500" />
              Member Balances
            </h3>
            <button
              type="button"
              onClick={() => setActiveTab('members')}
              className="text-xs text-emerald-600 hover:text-emerald-700 font-medium inline-flex items-center gap-0.5"
            >
              <span>Manage</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden bg-white">
            {members.map((m) => {
              const rel = getMemberReliability(m.userId);
              return (
                <div
                  key={m.userId}
                  onClick={() => setActiveTab('members')}
                  className="p-3 flex items-center justify-between gap-2.5 text-xs hover:bg-slate-50 cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-700 shrink-0 text-[10px]">
                      {m.name.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <div className="font-medium text-slate-900 truncate">{m.name}</div>
                      <div className="text-[10px] text-slate-400">
                        <StatusBadge reliability={rel.indicator} size="sm" />
                      </div>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    {m.balance > 0.01 ? (
                      <span className="font-mono font-semibold text-rose-600 text-xs">
                        +{currentGroup.currencySymbol}
                        {m.balance.toFixed(2)}
                      </span>
                    ) : m.balance < -0.01 ? (
                      <span className="font-mono font-semibold text-emerald-600 text-xs">
                        -{currentGroup.currencySymbol}
                        {Math.abs(m.balance).toFixed(2)}
                      </span>
                    ) : (
                      <span className="font-mono text-slate-400 text-xs">₱0.00</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Accountability tip */}
          <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/70 text-xs space-y-1">
            <div className="font-semibold text-slate-800 flex items-center gap-1.5 text-xs">
              <ShieldAlert className="w-3.5 h-3.5 text-emerald-600" />
              Accountability Note
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Splits pending for more than 7 days automatically trigger accountability flags and
              reduce the member's reliability index.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
