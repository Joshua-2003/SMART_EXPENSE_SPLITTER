import React, { useState } from 'react';
import {
  ShieldAlert,
  AlertTriangle,
  Bell,
  Clock,
  CheckCircle,
  Calendar,
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import {
  setOverdueThreshold,
  addNotification,
} from '../../store/slices/accountabilitySlice';
import { addToast } from '../../store/slices/uiSlice';
import { StatusBadge } from '../../components/common/StatusBadge';
import { PageHeader } from '../../components/common/PageHeader';
import { Button } from '../../components/ui/Button';
import { MemberAccountabilityModal } from '../../components/members/MemberAccountabilityModal';
import { GroupMember } from '../../types';

export const AccountabilityPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { currentGroup, members } = useAppSelector((state) => state.groups);
  const { expenses } = useAppSelector((state) => state.expenses);
  const { overdueThresholdDays, reliabilityScores } = useAppSelector(
    (state) => state.accountability
  );

  const [selectedMember, setSelectedMember] = useState<GroupMember | null>(null);

  // Compute overdue splits
  const now = new Date().getTime();
  const overdueSplits = expenses.flatMap((exp) =>
    exp.splits
      .filter((split) => split.paymentStatus === 'pending')
      .map((split) => {
        const diffDays = Math.floor(
          (now - new Date(exp.createdAt).getTime()) / (1000 * 60 * 60 * 24)
        );
        return {
          ...split,
          expenseDescription: exp.description,
          createdAt: exp.createdAt,
          daysOverdue: diffDays,
        };
      })
      .filter((s) => s.daysOverdue >= overdueThresholdDays)
  );

  const handleRemindSingle = (memberName: string, desc: string, amt: number) => {
    dispatch(
      addNotification({
        notificationId: `notif-${Date.now()}`,
        type: 'payment_reminder',
        groupId: currentGroup.id,
        groupName: currentGroup.name,
        message: `Gentle reminder sent to ${memberName} for ${currentGroup.currencySymbol}${amt.toFixed(2)} (${desc})`,
        read: false,
        createdAt: new Date().toISOString(),
      })
    );
    dispatch(
      addToast({
        type: 'info',
        title: 'Nudge Delivered',
        message: `A reminder was sent to ${memberName}.`,
      })
    );
  };

  const handleRemindAll = () => {
    if (overdueSplits.length === 0) return;
    const notified = new Set<string>();

    overdueSplits.forEach((s) => {
      if (!notified.has(s.userName)) {
        notified.add(s.userName);
        dispatch(
          addNotification({
            notificationId: `notif-${Date.now()}-${s.splitId}`,
            type: 'overdue_alert',
            groupId: currentGroup.id,
            groupName: currentGroup.name,
            message: `Overdue reminder sent to ${s.userName} for ${currentGroup.currencySymbol}${s.assignedAmount.toFixed(2)}`,
            read: false,
            createdAt: new Date().toISOString(),
          })
        );
      }
    });

    dispatch(
      addToast({
        type: 'success',
        title: 'Batch Reminders Sent',
        message: `Dispatched notifications to ${notified.size} overdue member(s).`,
      })
    );
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Accountability & Overdue Center"
        description="Delinquency monitoring, grace-period alerting, and member payment reliability tracking."
        badge={
          <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-medium">
            Core Differentiator
          </span>
        }
        actions={
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-500">Overdue threshold:</span>
            <select
              value={overdueThresholdDays}
              onChange={(e) => dispatch(setOverdueThreshold(Number(e.target.value)))}
              className="bg-white border border-slate-200 text-slate-800 text-xs font-medium rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-slate-400 cursor-pointer shadow-2xs"
            >
              <option value={3}>3+ days</option>
              <option value={7}>7+ days (Default)</option>
              <option value={14}>14+ days</option>
            </select>
          </div>
        }
      />

      {/* Overdue Splits Section */}
      <div className="p-5 bg-white border border-slate-200 rounded-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-rose-100 text-rose-700">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-semibold text-slate-900">
                Overdue Payment Splits ({overdueSplits.length})
              </h3>
              <p className="text-[11px] text-slate-500">
                Unsettled shares exceeding the {overdueThresholdDays}-day grace threshold
              </p>
            </div>
          </div>

          {overdueSplits.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleRemindAll}
              leftIcon={<Bell className="w-3.5 h-3.5 text-amber-600" />}
              className="border-amber-200 text-amber-800 hover:bg-amber-50"
            >
              Remind All Overdue Members
            </Button>
          )}
        </div>

        {overdueSplits.length === 0 ? (
          <div className="py-8 text-center text-xs text-slate-500">
            <CheckCircle className="w-6 h-6 text-emerald-500 mx-auto mb-1.5" />
            <div className="font-semibold text-slate-800">No overdue balances</div>
            <div className="text-[11px] text-slate-400 mt-0.5">
              All member splits are completed or within the {overdueThresholdDays}-day window.
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {overdueSplits.map((split) => (
              <div
                key={split.splitId}
                className="p-3.5 rounded-xl border border-rose-200 bg-rose-50/30 flex items-start justify-between gap-3 text-xs"
              >
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-900 truncate">
                      {split.userName}
                    </span>
                    <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-md bg-rose-100 text-rose-700">
                      {split.daysOverdue} days overdue
                    </span>
                  </div>

                  <div className="text-slate-600 font-medium truncate">
                    {split.expenseDescription}
                  </div>

                  <div className="text-[11px] text-slate-400 flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    Recorded on {new Date(split.createdAt).toLocaleDateString()}
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div className="font-mono font-bold text-sm text-rose-700">
                    {currentGroup.currencySymbol}
                    {split.assignedAmount.toFixed(2)}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      handleRemindSingle(
                        split.userName,
                        split.expenseDescription,
                        split.assignedAmount
                      )
                    }
                    leftIcon={<Bell className="w-3 h-3 text-amber-600" />}
                    className="mt-2 border-amber-200 text-amber-800 hover:bg-amber-50 text-[11px] py-1 px-2.5"
                  >
                    Nudge
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Member Reliability Leaderboard */}
      <div className="p-5 bg-white border border-slate-200 rounded-xl space-y-4">
        <div>
          <h3 className="text-xs font-semibold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
            <ShieldAlert className="w-3.5 h-3.5 text-slate-500" />
            Member Reliability Index
          </h3>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Calculated from historical on-time payment consistency and delinquency occurrences.
          </p>
        </div>

        <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden bg-white">
          {members.map((m) => {
            const rel = reliabilityScores[m.userId] || {
              indicator: 'Reliable',
              score: 85,
              metrics: {
                totalPayments: 6,
                completedOnTime: 5,
                completedLate: 1,
                stillPending: 0,
                completionRate: 83,
              },
            };

            return (
              <div
                key={m.userId}
                onClick={() => setSelectedMember(m)}
                className="p-3.5 flex items-center justify-between gap-3 text-xs hover:bg-slate-50/80 cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-slate-700 shrink-0 text-xs">
                    {m.name.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <div className="font-semibold text-slate-900 flex items-center gap-2 truncate">
                      <span>{m.name}</span>
                      <StatusBadge reliability={rel.indicator} size="sm" />
                    </div>
                    <div className="text-[11px] text-slate-400 truncate">
                      {rel.metrics.completedOnTime} on-time • {rel.metrics.completedLate} late •{' '}
                      {rel.metrics.stillPending} pending
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <div className="text-right">
                    <div className="font-mono font-bold text-slate-900">{rel.score}/100</div>
                    <div className="text-[10px] text-slate-400">
                      {rel.metrics.completionRate}% on-time
                    </div>
                  </div>
                  <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden hidden sm:block">
                    <div
                      className={`h-full rounded-full ${
                        rel.indicator === 'Reliable'
                          ? 'bg-emerald-500'
                          : rel.indicator === 'At Risk'
                          ? 'bg-amber-500'
                          : 'bg-rose-500'
                      }`}
                      style={{ width: `${rel.score}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Member Accountability Modal */}
      <MemberAccountabilityModal
        member={selectedMember}
        onClose={() => setSelectedMember(null)}
      />
    </div>
  );
};
