import React, { useState } from 'react';
import {
  FolderKanban,
  Plus,
  Users,
  Calendar,
  ChevronRight,
  ShieldCheck,
  Check,
  Edit2,
  X,
} from 'lucide-react';
import { Group } from '../../types';
import { useApp } from '../../context/AppContext';
import { StatusBadge } from '../common/StatusBadge';

interface GroupsViewProps {
  onOpenNewGroup: () => void;
  onNavigateToDashboard: () => void;
}

export const GroupsView: React.FC<GroupsViewProps> = ({
  onOpenNewGroup,
  onNavigateToDashboard,
}) => {
  const { groups, currentGroup, setCurrentGroup, currentUser, updateGroup } = useApp();
  const [editingGroup, setEditingGroup] = useState<Group | null>(null);
  const [editName, setEditName] = useState('');
  const [editDesc, setEditDesc] = useState('');

  const handleSelectGroup = (g: Group) => {
    setCurrentGroup(g);
    onNavigateToDashboard();
  };

  const handleStartEdit = (e: React.MouseEvent, g: Group) => {
    e.stopPropagation();
    setEditingGroup(g);
    setEditName(g.name);
    setEditDesc(g.description || '');
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingGroup) {
      await updateGroup(editingGroup.id, editName, editDesc);
      setEditingGroup(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold text-slate-900 tracking-tight">Your Groups</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage your shared expense spaces for trips, households, and projects.
          </p>
        </div>

        <button
          type="button"
          onClick={onOpenNewGroup}
          className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 text-xs font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-[10px] shadow-xs transition-colors shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Group</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {groups.map((group) => {
          const isActive = group.id === currentGroup.id;
          const isAdmin = group.adminId === currentUser.id;

          return (
            <div
              key={group.id}
              onClick={() => handleSelectGroup(group)}
              className={`p-5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                isActive
                  ? 'bg-emerald-50/20 border-emerald-300 ring-1 ring-emerald-300 shadow-xs'
                  : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-xs'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 ${
                        isActive
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {group.name.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-sm font-semibold text-slate-900 truncate">
                        {group.name}
                      </h3>
                      <div className="text-[11px] text-slate-400">
                        {isAdmin ? 'You are Admin' : 'Member'}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    {isAdmin && (
                      <button
                        type="button"
                        onClick={(e) => handleStartEdit(e, group)}
                        className="p-1 text-slate-400 hover:text-slate-600 rounded-md hover:bg-slate-100"
                        title="Edit group details"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                    {isActive && (
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                        Active
                      </span>
                    )}
                  </div>
                </div>

                <p className="mt-3 text-xs text-slate-600 line-clamp-2 leading-relaxed">
                  {group.description || 'No description provided.'}
                </p>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span className="flex items-center gap-1">
                  <Users className="w-3.5 h-3.5 text-slate-400" />
                  {group.memberCount} member(s)
                </span>
                <span className="font-medium text-emerald-600 inline-flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                  Switch <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Edit Group Modal */}
      {editingGroup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="relative w-full max-w-md bg-white rounded-xl border border-slate-200 shadow-2xl p-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="text-sm font-semibold text-slate-900">Edit Group Details</h3>
              <button
                type="button"
                onClick={() => setEditingGroup(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-md"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="mt-4 space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Group Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full bg-white border border-slate-200 text-slate-900 text-xs rounded-[10px] px-3 py-2 focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Description</label>
                <textarea
                  rows={3}
                  value={editDesc}
                  onChange={(e) => setEditDesc(e.target.value)}
                  className="w-full bg-white border border-slate-200 text-slate-900 text-xs rounded-[10px] px-3 py-2 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingGroup(null)}
                  className="px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-100 rounded-[10px]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3.5 py-1.5 text-xs font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-[10px]"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
