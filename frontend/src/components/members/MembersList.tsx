import React, { useState, useMemo } from 'react';
import { UserPlus, Search, Bell, Shield, Trash2, ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import { GroupMember } from '../../types';
import { useApp } from '../../context/AppContext';
import { DataTable, Column } from '../common/DataTable';
import { SearchBar } from '../common/SearchBar';
import { StatusBadge } from '../common/StatusBadge';
import { MemberAccountabilityModal } from './MemberAccountabilityModal';
import { AddMemberModal } from './AddMemberModal';
import { ConfirmationModal } from '../common/ConfirmationModal';

export const MembersList: React.FC = () => {
  const {
    currentGroup,
    members,
    isCurrentUserAdmin,
    currentUser,
    getMemberReliability,
    removeMemberFromGroup,
    sendGentleReminder,
    isLoading,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMember, setSelectedMember] = useState<GroupMember | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [memberToRemove, setMemberToRemove] = useState<GroupMember | null>(null);

  const filteredMembers = useMemo(() => {
    if (!searchQuery.trim()) return members;
    const q = searchQuery.toLowerCase();
    return members.filter(
      (m) => m.name.toLowerCase().includes(q) || m.email.toLowerCase().includes(q)
    );
  }, [members, searchQuery]);

  const handleConfirmRemove = async () => {
    if (memberToRemove) {
      await removeMemberFromGroup(memberToRemove.userId);
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
      header: 'Reliability',
      render: (m) => {
        const rel = getMemberReliability(m.userId);
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
              onClick={() => sendGentleReminder(m.userId)}
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
      {/* Subheader */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold text-slate-900 tracking-tight">
            Group Members & Balances
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time balance breakdown and payment accountability tracking for {currentGroup.name}.
          </p>
        </div>

        {isCurrentUserAdmin && (
          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 text-xs font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-[10px] shadow-xs transition-colors shrink-0"
          >
            <UserPlus className="w-4 h-4" />
            <span>Invite Member</span>
          </button>
        )}
      </div>

      {/* Search Filter */}
      <div className="flex items-center gap-3">
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Filter members by name or email..."
          className="w-full sm:w-80"
        />
        <div className="text-xs text-slate-400 hidden sm:block">
          Click any member row to view detailed payment history & reliability metrics.
        </div>
      </div>

      {/* DataTable */}
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

      {/* Add Member Modal */}
      <AddMemberModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />

      {/* Remove Member Confirmation */}
      <ConfirmationModal
        isOpen={!!memberToRemove}
        onClose={() => setMemberToRemove(null)}
        onConfirm={handleConfirmRemove}
        title="Remove Member from Group"
        description={`Are you sure you want to remove ${memberToRemove?.name} from ${currentGroup.name}? This action can be reversed by re-inviting.`}
        confirmLabel="Remove Member"
        variant="danger"
        isLoading={isLoading}
      />
    </div>
  );
};
