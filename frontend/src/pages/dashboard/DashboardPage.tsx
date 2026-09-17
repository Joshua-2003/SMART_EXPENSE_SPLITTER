import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Receipt,
  Users,
  AlertTriangle,
  Plus,
  ArrowRight,
  Clock,
  ArrowUpRight,
  ArrowDownLeft,
  ShieldAlert,
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { addToast, setCreateExpenseOpen, setAddMemberOpen } from '../../store/slices/uiSlice';
import { getGroupDashboard } from '../../services/dashboard.service';
import { setDashboard } from '../../store/slices/dashboardSlice';
import { MetricCard } from '../../components/common/MetricCard';
import { StatusBadge } from '../../components/common/StatusBadge';
import { PageHeader } from '../../components/common/PageHeader';
import { Button } from '../../components/ui/Button';
import { ROUTES } from '../../constants/routes';

interface RecentExpenseItem {
  id: string;
  description: string;
  createdByName: string;
  amount: number;
  createdAt: string;
  splits?: Array<{ paymentStatus?: string }>;
}

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { currentGroup, members, settlement } = useAppSelector((state) => state.groups);
  const { expenses } = useAppSelector((state) => state.expenses);
  const { currentUser } = useAppSelector((state) => state.auth);
  const { reliabilityScores, overdueThresholdDays } = useAppSelector(
    (state) => state.accountability
  );
  const { data: dashboardData } = useAppSelector((state) => state.dashboard);

  useEffect(() => {
    let cancelled = false;

    getGroupDashboard(currentGroup.id)
      .then((data) => {
        if (cancelled) return;
        dispatch(setDashboard(data));
      })
      .catch((error: Error) => {
        if (cancelled) return;
        dispatch(
          addToast({
            type: 'error',
            title: 'Dashboard Load Failed',
            message: error.message || 'Unable to load dashboard data.',
          })
        );
      });

    return () => {
      cancelled = true;
    };
  }, [currentGroup.id, dispatch]);

  // Derived metrics — prefer backend dashboard data, fall back to local computation
  const totalExpenses =
    dashboardData?.totalExpenses ??
    settlement?.totalGroupExpenses ??
    expenses.reduce((sum, e) => sum + e.amount, 0);

  const pendingSplits = expenses.flatMap((e) =>
    e.splits
      .filter((s) => s.paymentStatus === 'pending')
      .map((s) => ({
        ...s,
        expenseId: e.id,
        expenseDescription: e.description,
        createdAt: e.createdAt,
      }))
  );

  const totalPendingAmount = dashboardData
    ? dashboardData.memberBalances.reduce((sum, m) => sum + m.totalOwes, 0)
    : settlement?.members.reduce((sum, m) => sum + m.pendingPayments, 0) ??
      pendingSplits.reduce((sum, s) => sum + s.assignedAmount, 0);

  const pendingSplitCount = dashboardData
    ? dashboardData.memberBalances.reduce((sum, m) => sum + m.pendingPayments, 0)
    : pendingSplits.length;

  const balanceRows = dashboardData?.memberBalances?.length
    ? dashboardData.memberBalances.map((m) => ({
        userId: m.userId,
        name: m.name,
        role: m.role,
        netBalance: m.totalOwes - m.totalReceives,
        reliabilityIndicator: m.reliabilityIndicator,
      }))
    : members.map((m) => ({
        userId: m.userId,
        name: m.name,
        role: m.role,
        netBalance: m.balance,
        reliabilityIndicator: reliabilityScores[m.userId]?.indicator ?? 'Reliable',
      }));

  // Current user balance in group
  const userBalance = balanceRows.find((m) => m.userId === currentUser.id)?.netBalance ?? 0;

  // Overdue calculations (> overdueThresholdDays)
  const now = new Date().getTime();
  const overdueSplits = pendingSplits.filter((s) => {
    const diffDays = (now - new Date(s.createdAt).getTime()) / (1000 * 60 * 60 * 24);
    return diffDays >= overdueThresholdDays;
  });

  const overdueCount = dashboardData
    ? dashboardData.overdueAlerts.length
    : overdueSplits.length;

  const overdueTotalAmount = dashboardData
    ? dashboardData.overdueAlerts.reduce((sum, a) => sum + a.totalOverdueAmount, 0)
    : overdueSplits.reduce((sum, s) => sum + s.assignedAmount, 0);

  const recentExpenseItems: RecentExpenseItem[] = dashboardData?.recentExpenses?.length
    ? dashboardData.recentExpenses.map((e) => ({
        id: e.expenseId,
        description: e.description,
        createdByName: e.createdBy,
        amount: e.amount,
        createdAt: e.createdAt,
      }))
    : expenses.slice(0, 5);

  const expenseTotalCount = dashboardData?.expenseCount ?? expenses.length;

  return (
    <div className="space-y-6">
      {/* Top Hero Banner */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 to-slate-800 text-white border border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1 max-w-xl">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              {currentGroup.name}
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs text-slate-300">
              Admin: {currentGroup.adminId === currentUser.id ? 'You' : (dashboardData?.groupAdmin ?? 'Group Admin')}
            </span>
          </div>
          <h2 className="text-xl font-bold tracking-tight text-white">
            Shared Balance & Accountability Dashboard
          </h2>
          <p className="text-xs text-slate-300 leading-relaxed">
            {currentGroup.description || 'Tracking shared expenses with real-time settlement transparency.'}
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <Button
            variant="primary"
            size="sm"
            onClick={() => dispatch(setCreateExpenseOpen(true))}
            leftIcon={<Plus className="w-4 h-4" />}
          >
            Add Expense
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => dispatch(setAddMemberOpen(true))}
            leftIcon={<Users className="w-3.5 h-3.5" />}
          >
            Invite
          </Button>
        </div>
      </div>

      {/* Overdue Warning Alert */}
      {overdueCount > 0 && (
        <div className="p-4 rounded-xl border border-rose-200 bg-rose-50/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-rose-100 text-rose-700 shrink-0">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-semibold text-rose-900 flex items-center gap-2">
                <span>Accountability Warning: {overdueCount} Overdue Payment Split(s)</span>
                <span className="font-mono text-rose-700">
                  ({currentGroup.currencySymbol}
                  {overdueTotalAmount.toFixed(2)})
                </span>
              </div>
              <p className="text-[11px] text-rose-700 mt-0.5 leading-snug">
                One or more members have unpaid splits exceeding the {overdueThresholdDays}-day grace period.
              </p>
            </div>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(ROUTES.ACCOUNTABILITY)}
            rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
            className="border-rose-200 text-rose-800 hover:bg-rose-50 shrink-0"
          >
            Review Overdue Log
          </Button>
        </div>
      )}

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Personal Balance */}
        <div className="rounded-xl border border-slate-200 bg-white p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs font-medium text-slate-500">
            <span>Your Personal Balance</span>
            <span className="text-[10px] text-slate-400 font-mono">({currentUser.name})</span>
          </div>

          <div className="my-2">
            {userBalance > 0.01 ? (
              <div>
                <div className="text-xl font-bold font-mono text-rose-600 flex items-center gap-1">
                  <ArrowUpRight className="w-4 h-4" />
                  {currentGroup.currencySymbol}
                  {userBalance.toFixed(2)}
                </div>
                <div className="text-[11px] text-rose-600 font-medium mt-0.5">
                  You owe the group
                </div>
              </div>
            ) : userBalance < -0.01 ? (
              <div>
                <div className="text-xl font-bold font-mono text-emerald-600 flex items-center gap-1">
                  <ArrowDownLeft className="w-4 h-4" />
                  {currentGroup.currencySymbol}
                  {Math.abs(userBalance).toFixed(2)}
                </div>
                <div className="text-[11px] text-emerald-600 font-medium mt-0.5">
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
            onClick={() => navigate(ROUTES.SETTLEMENT)}
            className="text-[11px] font-medium text-slate-600 hover:text-slate-900 inline-flex items-center gap-1 pt-2 border-t border-slate-100"
          >
            <span>View settlements</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        <MetricCard
          label="Total Group Spending"
          value={`${currentGroup.currencySymbol}${totalExpenses.toFixed(2)}`}
          subValue={`${expenseTotalCount} recorded expenses`}
          icon={Receipt}
          onClick={() => navigate(ROUTES.EXPENSES)}
        />

        <MetricCard
          label="Unsettled Shares"
          value={`${currentGroup.currencySymbol}${totalPendingAmount.toFixed(2)}`}
          variant={totalPendingAmount > 0 ? 'warning' : 'default'}
          subValue={`${pendingSplitCount} pending split(s)`}
          icon={Clock}
          onClick={() => navigate(ROUTES.SETTLEMENT)}
        />

        <MetricCard
          label="Group Members"
          value={dashboardData?.memberCount ?? members.length}
          subValue={
            overdueCount > 0
              ? `${overdueCount} split(s) overdue`
              : '100% on schedule'
          }
          icon={Users}
          onClick={() => navigate(ROUTES.MEMBERS)}
        />
      </div>

      {/* Main 2-Column Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Expenses Feed */}
        <div className="lg:col-span-2 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-semibold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <Receipt className="w-3.5 h-3.5 text-slate-500" />
              Recent Shared Expenses
            </h3>
            <button
              type="button"
              onClick={() => navigate(ROUTES.EXPENSES)}
              className="text-xs text-emerald-600 hover:text-emerald-700 font-medium inline-flex items-center gap-0.5"
            >
              <span>View all ({expenseTotalCount})</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden bg-white">
            {recentExpenseItems.map((exp) => {
              const total = exp.splits?.length ?? 0;
              const paid = exp.splits?.filter((s) => s.paymentStatus === 'completed').length ?? 0;
              const isSettled = total > 0 && paid === total;

              return (
                <div
                  key={exp.id}
                  onClick={() => navigate(ROUTES.EXPENSES)}
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
                      {exp.splits && exp.splits.length > 0 && (
                        <StatusBadge status={isSettled ? 'completed' : 'pending'} size="sm" />
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Member Balances */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-semibold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-slate-500" />
              Member Balances
            </h3>
            <button
              type="button"
              onClick={() => navigate(ROUTES.MEMBERS)}
              className="text-xs text-emerald-600 hover:text-emerald-700 font-medium inline-flex items-center gap-0.5"
            >
              <span>Manage</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden bg-white">
            {balanceRows.map((m) => (
              <div
                key={m.userId}
                onClick={() => navigate(ROUTES.MEMBERS)}
                className="p-3 flex items-center justify-between gap-2.5 text-xs hover:bg-slate-50 cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-700 shrink-0 text-[10px]">
                    {m.name.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <div className="font-medium text-slate-900 truncate">{m.name}</div>
                      <StatusBadge reliability={m.reliabilityIndicator} size="sm" />
                    </div>
                    <div className="text-[10px] text-slate-400 capitalize">{m.role}</div>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  {m.netBalance > 0.01 ? (
                    <span className="font-mono font-semibold text-rose-600 text-xs">
                      +{currentGroup.currencySymbol}
                      {m.netBalance.toFixed(2)}
                    </span>
                  ) : m.netBalance < -0.01 ? (
                    <span className="font-mono font-semibold text-emerald-600 text-xs">
                      -{currentGroup.currencySymbol}
                      {Math.abs(m.netBalance).toFixed(2)}
                    </span>
                  ) : (
                    <span className="font-mono text-slate-400 text-xs">₱0.00</span>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/70 text-xs space-y-1">
            <div className="font-semibold text-slate-800 flex items-center gap-1.5 text-xs">
              <ShieldAlert className="w-3.5 h-3.5 text-emerald-600" />
              Accountability Tracking
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Splits pending for more than {overdueThresholdDays} days automatically trigger alerts and update member reliability scores.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
