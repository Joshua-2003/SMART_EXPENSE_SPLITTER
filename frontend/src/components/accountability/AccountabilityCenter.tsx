import React, { useState } from 'react';
import {
  ShieldAlert,
  AlertTriangle,
  Bell,
  Clock,
  CheckCircle,
  Calendar,
  Filter,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { StatusBadge } from '../common/StatusBadge';
import { MemberAccountabilityModal } from '../members/MemberAccountabilityModal';
import { GroupMember } from '../../types';

export const AccountabilityCenter: React.FC = () => {
  const {
    currentGroup,
    members,
    getOverdueSplits,
    getMemberReliability,
    sendGentleReminder,
    addToast,
  } = useApp();

  const [thresholdDays, setThresholdDays] = useState<number>(7);
  const [selectedMember, setSelectedMember] = useState<GroupMember | null>(null);

  const overdueSplits = getOverdueSplits(thresholdDays);

  const handleRemindAllOverdue = () => {
    if (overdueSplits.length === 0) return;
    const notifiedUserIds = new Set<string>();

    overdueSplits.forEach((split) => {
      if (!notifiedUserIds.has(split.memberId)) {
        sendGentleReminder(split.memberId, split.expenseDescription, split.amount);
        notifiedUserIds.add(split.memberId);
      }
    });

    addToast({
      type: 'info',
      title: 'Batch Reminders Dispatched',
      message: `Gentle reminders delivered to ${notifiedUserIds.size} member(s) with overdue shares.`,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-semibold text-slate-900 tracking-tight">
              Accountability & Overdue Center
            </h2>
            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-medium">
              Core Differentiator
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Transparent tracking of payment behaviors, delinquency alerts, and member reliability.
          </p>
        </div>

        {/* Threshold selector */}
        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-500">Overdue threshold:</span>
          <select
            value={thresholdDays}
            onChange={(e) => setThresholdDays(Number(e.target.value))}
            className="bg-white border border-slate-200 text-slate-800 text-xs font-medium rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-slate-400"
          >
            <option value={3}>3+ days</option>
            <option value={7}>7+ days (Default)</option>
            <option value={14}>14+ days</option>
          </select>
        </div>
      </div>

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
                Pending splits exceeding the {thresholdDays}-day grace threshold
              </p>
            </div>
          </div>

          {overdueSplits.length > 0 && (
            <button
              type="button"
              onClick={handleRemindAllOverdue}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-200/80 rounded-[10px] transition-colors"
            >
              <Bell className="w-3.5 h-3.5 text-amber-600" />
              <span>Remind All Overdue Members</span>
            </button>
          )}
        </div>

        {overdueSplits.length === 0 ? (
          <div className="py-8 text-center text-xs text-slate-500">
            <CheckCircle className="w-6 h-6 text-emerald-500 mx-auto mb-1.5" />
            <div className="font-semibold text-slate-800">No overdue balances</div>
            <div className="text-[11px] text-slate-400 mt-0.5">
              All member splits are either completed or within the {thresholdDays}-day window.
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
                      {split.memberName}
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
                    {split.amount.toFixed(2)}
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      sendGentleReminder(split.memberId, split.expenseDescription, split.amount)
                    }
                    className="mt-2 inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-medium text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-200/80 rounded-lg transition-colors"
                  >
                    <Bell className="w-3 h-3 text-amber-600" />
                    <span>Nudge</span>
                  </button>
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
            Based on historical promptness, completion rate, and overdue payment occurrences.
          </p>
        </div>

        <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden bg-white">
          {members.map((m) => {
            const rel = getMemberReliability(m.userId);
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
                      {rel.completedOnTime} on-time • {rel.completedLate} late •{' '}
                      {rel.stillPending} pending
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <div className="text-right">
                    <div className="font-mono font-bold text-slate-900">{rel.score}/100</div>
                    <div className="text-[10px] text-slate-400">{rel.completionRate}% on-time</div>
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
