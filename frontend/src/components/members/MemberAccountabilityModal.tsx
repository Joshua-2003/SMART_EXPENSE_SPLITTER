import React from 'react';
import {
  X,
  Clock,
  CheckCircle,
  AlertTriangle,
  Bell,
  History,
} from 'lucide-react';
import { GroupMember } from '../../types';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { addNotification } from '../../store/slices/accountabilitySlice';
import { addToast } from '../../store/slices/uiSlice';
import { StatusBadge } from '../common/StatusBadge';
import { mockHistory } from '../../mock/history';

interface MemberAccountabilityModalProps {
  member: GroupMember | null;
  onClose: () => void;
}

export const MemberAccountabilityModal: React.FC<MemberAccountabilityModalProps> = ({
  member,
  onClose,
}) => {
  const dispatch = useAppDispatch();
  const { currentGroup } = useAppSelector((state) => state.groups);
  const { reliabilityScores } = useAppSelector((state) => state.accountability);

  if (!member) return null;

  const reliability = reliabilityScores[member.userId] || {
    indicator: 'Reliable',
    score: 85,
    metrics: {
      totalPayments: 5,
      completedOnTime: 4,
      completedLate: 1,
      stillPending: 0,
      completionRate: 80,
    },
  };

  const history = mockHistory.filter((h) => h.userId === member.userId);

  const handleSendGentleReminder = () => {
    dispatch(
      addNotification({
        notificationId: `notif-${Date.now()}`,
        type: 'payment_reminder',
        groupId: currentGroup.id,
        groupName: currentGroup.name,
        message: `Gentle reminder sent to ${member.name} for ${currentGroup.currencySymbol}${member.balance.toFixed(2)}`,
        read: false,
        createdAt: new Date().toISOString(),
      })
    );
    dispatch(
      addToast({
        type: 'info',
        title: 'Reminder Logged',
        message: `Payment reminder sent to ${member.name}.`,
      })
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
      <div className="relative w-full max-w-xl bg-white rounded-xl border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-slate-800 text-sm">
              {member.avatarUrl ? (
                <img
                  src={member.avatarUrl}
                  alt={member.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                member.name.charAt(0)
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-semibold text-slate-900">{member.name}</h2>
                <StatusBadge role={member.role} size="sm" />
                <StatusBadge reliability={reliability.indicator} size="sm" />
              </div>
              <p className="text-xs text-slate-500 font-mono mt-0.5">{member.email}</p>
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
        <div className="p-6 space-y-5 overflow-y-auto flex-1">
          {/* Reliability Score Card */}
          <div className="p-4 bg-slate-50/70 border border-slate-200 rounded-xl space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-slate-900">
                  Reliability Indicator & Score
                </span>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Calculated from on-time payment consistency across shared splits.
                </p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold font-mono text-slate-900">
                  {reliability.score}
                  <span className="text-xs font-normal text-slate-400">/100</span>
                </div>
                <div className="text-[10px] text-slate-500 font-medium">Accountability Score</div>
              </div>
            </div>

            {/* Score Progress Bar */}
            <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  reliability.indicator === 'Reliable'
                    ? 'bg-emerald-500'
                    : reliability.indicator === 'At Risk'
                    ? 'bg-amber-500'
                    : 'bg-rose-500'
                }`}
                style={{ width: `${Math.min(100, Math.max(10, reliability.score))}%` }}
              />
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
              <div className="p-2 bg-white rounded-lg border border-slate-200/80">
                <div className="text-[10px] text-slate-500 font-medium">On-Time Rate</div>
                <div className="text-xs font-semibold font-mono text-slate-900 mt-0.5">
                  {reliability.metrics.completionRate}%
                </div>
              </div>
              <div className="p-2 bg-white rounded-lg border border-slate-200/80">
                <div className="text-[10px] text-slate-500 font-medium">On-Time Paid</div>
                <div className="text-xs font-semibold font-mono text-emerald-700 mt-0.5">
                  {reliability.metrics.completedOnTime}
                </div>
              </div>
              <div className="p-2 bg-white rounded-lg border border-slate-200/80">
                <div className="text-[10px] text-slate-500 font-medium">Late Settled</div>
                <div className="text-xs font-semibold font-mono text-amber-700 mt-0.5">
                  {reliability.metrics.completedLate}
                </div>
              </div>
              <div className="p-2 bg-white rounded-lg border border-slate-200/80">
                <div className="text-[10px] text-slate-500 font-medium">Still Pending</div>
                <div className="text-xs font-semibold font-mono text-rose-700 mt-0.5">
                  {reliability.metrics.stillPending}
                </div>
              </div>
            </div>
          </div>

          {/* Current Balance & Reminder Action */}
          <div className="p-4 border border-slate-200 rounded-xl flex items-center justify-between gap-3 bg-white">
            <div>
              <div className="text-xs text-slate-500">Current Balance in {currentGroup.name}</div>
              <div className="text-lg font-bold font-mono mt-0.5">
                {member.balance > 0.01 ? (
                  <span className="text-rose-600">
                    Owes {currentGroup.currencySymbol}
                    {member.balance.toFixed(2)}
                  </span>
                ) : member.balance < -0.01 ? (
                  <span className="text-emerald-600">
                    Gets back {currentGroup.currencySymbol}
                    {Math.abs(member.balance).toFixed(2)}
                  </span>
                ) : (
                  <span className="text-slate-500">Settled (₱0.00)</span>
                )}
              </div>
            </div>

            {member.balance > 0.01 && (
              <button
                type="button"
                onClick={handleSendGentleReminder}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-200/80 rounded-[10px] transition-colors"
              >
                <Bell className="w-3.5 h-3.5 text-amber-600" />
                <span>Send Gentle Reminder</span>
              </button>
            )}
          </div>

          {/* Payment History Log */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-semibold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <History className="w-3.5 h-3.5 text-slate-500" />
                Payment Behavior History
              </h3>
              <span className="text-[11px] text-slate-400 font-mono">
                {history.length} record(s)
              </span>
            </div>

            {history.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-400 border border-dashed border-slate-200 rounded-xl">
                No past payment history records for this member yet.
              </div>
            ) : (
              <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden bg-white">
                {history.map((hist) => (
                  <div
                    key={hist.paymentHistoryId}
                    className="p-3 text-xs flex items-center justify-between gap-3"
                  >
                    <div>
                      <div className="font-medium text-slate-900">{hist.expenseDescription}</div>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        Recorded {new Date(hist.createdAt).toLocaleDateString()}
                        {hist.completedAt &&
                          ` • Settled ${new Date(hist.completedAt).toLocaleDateString()}`}
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="font-mono font-semibold text-slate-900">
                        {currentGroup.currencySymbol}
                        {hist.assignedAmount.toFixed(2)}
                      </div>
                      <div className="mt-0.5">
                        {hist.status === 'completed' ? (
                          <span className="text-emerald-700 text-[11px] font-medium inline-flex items-center gap-1">
                            <CheckCircle className="w-3 h-3 text-emerald-500" /> Paid on time
                          </span>
                        ) : hist.daysOverdue && hist.daysOverdue > 7 ? (
                          <span className="text-rose-700 text-[11px] font-medium inline-flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3 text-rose-500" /> {hist.daysOverdue}d
                            overdue
                          </span>
                        ) : (
                          <span className="text-slate-500 text-[11px] font-medium inline-flex items-center gap-1">
                            <Clock className="w-3 h-3 text-slate-400" /> Pending
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs text-slate-500">
          <span>Joined: {member.joinedAt ? new Date(member.joinedAt).toLocaleDateString() : 'Active Member'}</span>
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
