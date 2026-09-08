import React, { useState } from 'react';
import { X, FolderPlus } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { addGroup, setCurrentGroup } from '../../store/slices/groupsSlice';
import { addToast } from '../../store/slices/uiSlice';
import { Group } from '../../types';

interface CreateGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateGroupModal: React.FC<CreateGroupModalProps> = ({ isOpen, onClose }) => {
  const dispatch = useAppDispatch();
  const { currentUser } = useAppSelector((state) => state.auth);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please provide a group name.');
      return;
    }

    setIsSubmitting(true);

    const newGroup: Group = {
      id: `group-${Date.now()}`,
      name: name.trim(),
      description: description.trim(),
      currencySymbol: '₱',
      adminId: currentUser.id,
      memberCount: 1,
      createdAt: new Date().toISOString(),
    };

    dispatch(addGroup(newGroup));
    dispatch(setCurrentGroup(newGroup));
    dispatch(
      addToast({
        type: 'success',
        title: 'Group Created',
        message: `Successfully created "${newGroup.name}" with you as admin.`,
      })
    );

    setName('');
    setDescription('');
    setIsSubmitting(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
      <div className="relative w-full max-w-md bg-white rounded-xl border border-slate-200 shadow-2xl overflow-hidden p-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-emerald-100 text-emerald-700">
              <FolderPlus className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-slate-900">Create Expense Group</h2>
              <p className="text-xs text-slate-500">Organize costs for trips, flats, or events</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 rounded-md focus:outline-none"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-3.5">
          {error && (
            <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Group Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Boracay Vacation, Apartment 4B, Work Hackathon"
              className="w-full bg-white border border-slate-200 text-slate-900 text-xs rounded-[10px] px-3 py-2 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Description (Optional)
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief note about the purpose or dates of this expense group..."
              className="w-full bg-white border border-slate-200 text-slate-900 text-xs rounded-[10px] px-3 py-2 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 rounded-[10px] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 text-xs font-medium text-white bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 rounded-[10px] shadow-xs transition-colors flex items-center gap-1.5"
            >
              {isSubmitting && (
                <span className="w-3 h-3 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              )}
              <span>Create Group</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
