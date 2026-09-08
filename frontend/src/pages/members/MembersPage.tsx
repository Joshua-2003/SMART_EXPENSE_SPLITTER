import React, { useState, useMemo } from 'react';
import { UserPlus, Bell, Trash2, ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { removeMember } from '../../store/slices/groupsSlice';
import { addNotification } from '../../store/slices/accountabilitySlice';
import { addToast, setAddMemberOpen } from '../../store/slices/uiSlice';
import { GroupMember } from '../../types';
import { DataTable, Column } from '../../components/common/DataTable';
import { FilterBar } from '../../components/common/FilterBar';
import { PageHeader } from '../../components/common/PageHeader';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Button } from '../../components/ui/Button';
import { MemberAccountabilityModal } from '../../components/members/MemberAccountabilityModal';
import { ConfirmationModal } from '../../components/common/ConfirmationModal';

export const MembersPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { currentGroup, members } = useAppSelector((state) => state.groups);
  const { currentUser } = useAppSelector((state) => state.auth);
  const { reliabilityScores } = useAppSelector((state) => state.accountability);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMember, setSelectedMember] = useState<GroupMember | null>(null);
  const [memberToRemove, setMemberToRemove] = useState<GroupMember | null>(null);

  const isCurrentUserAdmin = currentGroup.adminId === currentUser.id;

  const filteredMembers = useMemo(() => {
    if (!searchQuery.trim()) return members;
    const q = searchQuery.toLowerCase();
    return members.filter(
      (m) => m.name.toLowerCase().includes(q) || m.email.toLowerCase().includes(q)
    );
  }, [members, searchQuery]);

  const handleSendReminder = (m: GroupMember) => {
    dispatch(
      addNotification({
        notificationId: `notif-${Date.now()}`,
        type: 'payment_reminder',
        groupId: currentGroup.id,
        groupName: currentGroup.name,
        message: `Gentle reminder sent to ${m.name} for ${currentGroup.currencySymbol}${m.balance.toFixed(2)}`,
        read: false,
        createdAt: new Date().toISOString(),
      })
    );
    dispatch(
      addToast({
        type: 'info',
        title: 'Reminder Dispatched',
        message: `A gentle reminder has been logged for ${m.name}.`,
      })
    );
  };

  const handleConfirmRemove = () => {
    if (memberToRemove) {
      dispatch(removeMember(memberToRemove.userId));
      dispatch(
        addToast({
          type: 'success',
          title: 'Member Removed',
          message: `${memberToRemove.name} has been removed from ${currentGroup.name}.`,
        })
      );
      setMemberToRemove(null);
    }
  };

  const columns: Column<GroupMember>[] = [
    {
      key: 'name',
      header: 'Member',
      render: (m) => (
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-slate-700 shrink-0 text-xs">
            {m.avatarUrl ? (
              <img
                src={m.avatarUrl}
                alt={m.name}
                referrerPolicy="no-referrer"
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              m.name.charAt(0)
            )}
          </div>
          <div>
            <div className="font-semibold text-slate-900 flex items-center gap-1.5">
              <span>{m.name}</span>
              {m.userId === currentUser.id && (
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-100 text-slate-600">
                  You
                </span>
              )}
            </div>
            <div className="text-[11px] text-slate-400 font-mono">{m.email}</div>
          </div>
        </div>
      ),
    },
    {
      key: 'role',
      header: 'Role',
      render: (m) => <StatusBadge role={m.role} size="sm" />,
    },
    {
      key: 'reliability',
      header: 'Reliability Index',
      render: (m) => {
        const rel = reliabilityScores[m.userId] || {
          indicator: 'Reliable',
          score: 85,
        };
        return (
          <div className="flex items-center gap-2">
            <StatusBadge reliability={rel.indicator} size="sm" />
            <span className="text-[11px] text-slate-400 font-mono">{rel.score}/100</span>
          </div>
        );
      },
    },
    {
      key: 'balance',
      header: 'Net Balance',
      align: 'right',
      render: (m) => {
        if (m.balance > 0.01) {
          return (
            <div className="text-right">
              <span className="font-mono font-semibold text-rose-600 inline-flex items-center gap-0.5">
                <ArrowUpRight className="w-3.5 h-3.5" />
                Owes {currentGroup.currencySymbol}
                {m.balance.toFixed(2)}
              </span>
              <div className="text-[10px] text-slate-400">Payment pending</div>
            </div>
          );
        } else if (m.balance < -0.01) {
          return (
            <div className="text-right">
              <span className="font-mono font-semibold text-emerald-600 inline-flex items-center gap-0.5">
                <ArrowDownLeft className="w-3.5 h-3.5" />
                Gets {currentGroup.currencySymbol}
                {Math.abs(m.balance).toFixed(2)}
              </span>
              <div className="text-[10px] text-slate-400">To receive</div>
            </div>
          );
        } else {
          return (
            <div className="text-right">
              <span className="font-mono font-medium text-slate-400">Settled (₱0.00)</span>
            </div>
          );
        }
      },
    },
    {
      key: 'actions',
      header: '',
      align: 'right',
      render: (m) => (
        <div className="flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
          {m.balance > 0.01 && (
            <button
              type="button"
              onClick={() => handleSendReminder(m)}
              className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-md transition-colors"
              title="Send gentle payment reminder"
            >
              <Bell className="w-3.5 h-3.5" />
            </button>
          )}

          {isCurrentUserAdmin && m.userId !== currentGroup.adminId && (
            <button
              type="button"
              onClick={() => setMemberToRemove(m)}
              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors"
              title="Remove member from group"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <PageHeader
        title="Group Members & Balances"
        description={`Member accountability directory and net balance status for ${currentGroup.name}.`}
        actions={
          isCurrentUserAdmin && (
            <Button
              variant="primary"
              size="sm"
              onClick={() => dispatch(setAddMemberOpen(true))}
              leftIcon={<UserPlus className="w-4 h-4" />}
            >
              Invite Member
            </Button>
          )
        }
      />

      <FilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Filter members by name or email..."
        onReset={() => setSearchQuery('')}
      >
        <span className="text-xs text-slate-400 hidden sm:inline">
          Click any row to inspect payment behavior.
        </span>
      </FilterBar>

      <DataTable
        columns={columns}
        data={filteredMembers}
        keyExtractor={(m) => m.userId}
        onRowClick={(m) => setSelectedMember(m)}
        emptyTitle="No members found"
        emptyDescription="No members match the entered search filter."
      />

      {/* Member Accountability Modal */}
      <MemberAccountabilityModal
        member={selectedMember}
        onClose={() => setSelectedMember(null)}
      />

      {/* Remove Member Confirmation */}
      <ConfirmationModal
        isOpen={!!memberToRemove}
        onClose={() => setMemberToRemove(null)}
        onConfirm={handleConfirmRemove}
        title="Remove Member from Group"
        description={`Are you sure you want to remove ${memberToRemove?.name} from ${currentGroup.name}?`}
        confirmLabel="Remove Member"
        variant="danger"
      />
    </div>
  );
};
