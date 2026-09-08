import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Users, ChevronRight, Edit2, X } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import {
  setCurrentGroup,
  updateGroupDetails,
} from '../../store/slices/groupsSlice';
import { setCreateGroupOpen, addToast } from '../../store/slices/uiSlice';
import { Group } from '../../types';
import { PageHeader } from '../../components/common/PageHeader';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { ROUTES } from '../../constants/routes';

export const GroupsPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { groups, currentGroup } = useAppSelector((state) => state.groups);
  const { currentUser } = useAppSelector((state) => state.auth);

  const [editingGroup, setEditingGroup] = useState<Group | null>(null);
  const [editName, setEditName] = useState('');
  const [editDesc, setEditDesc] = useState('');

  const handleSelectGroup = (g: Group) => {
    dispatch(setCurrentGroup(g));
    dispatch(
      addToast({
        type: 'info',
        title: 'Group Switched',
        message: `Switched active workspace to ${g.name}.`,
      })
    );
    navigate(ROUTES.DASHBOARD);
  };

  const handleStartEdit = (e: React.MouseEvent, g: Group) => {
    e.stopPropagation();
    setEditingGroup(g);
    setEditName(g.name);
    setEditDesc(g.description || '');
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingGroup && editName.trim()) {
      dispatch(
        updateGroupDetails({
          id: editingGroup.id,
          name: editName.trim(),
          description: editDesc.trim(),
        })
      );
      dispatch(
        addToast({
          type: 'success',
          title: 'Group Updated',
          message: `Changes to ${editName} saved successfully.`,
        })
      );
      setEditingGroup(null);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Your Groups"
        description="Manage shared expense spaces for trips, households, and collaborative projects."
        actions={
          <Button
            variant="primary"
            size="sm"
            onClick={() => dispatch(setCreateGroupOpen(true))}
            leftIcon={<Plus className="w-4 h-4" />}
          >
            Create New Group
          </Button>
        }
      />

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
      <Modal
        isOpen={!!editingGroup}
        onClose={() => setEditingGroup(null)}
        title="Edit Group Details"
        description="Update the name or description for this expense space."
      >
        <form onSubmit={handleSaveEdit} className="space-y-3.5">
          <Input
            label="Group Name"
            required
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
          />

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1.5">
              Description
            </label>
            <textarea
              rows={3}
              value={editDesc}
              onChange={(e) => setEditDesc(e.target.value)}
              className="w-full bg-white border border-slate-200 text-slate-900 text-xs rounded-[10px] px-3 py-2 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setEditingGroup(null)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm">
              Save Changes
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
