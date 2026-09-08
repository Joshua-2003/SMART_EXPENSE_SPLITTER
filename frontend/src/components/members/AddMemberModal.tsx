import React, { useState } from 'react';
import { X, UserPlus, AlertCircle } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { addMember } from '../../store/slices/groupsSlice';
import { addNotification } from '../../store/slices/accountabilitySlice';
import { addToast } from '../../store/slices/uiSlice';
import { GroupMember } from '../../types';

interface AddMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddMemberModal: React.FC<AddMemberModalProps> = ({ isOpen, onClose }) => {
  const dispatch = useAppDispatch();
  const { currentGroup, members } = useAppSelector((state) => state.groups);
  const { allUsers } = useAppSelector((state) => state.auth);

  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  // Find users who aren't in this group yet
  const availableUsers = allUsers.filter(
    (u) => !members.some((m) => m.userId === u.id || m.email.toLowerCase() === u.email.toLowerCase())
  );

  const handleAddMember = (userEmail: string) => {
    setError(null);
    const clean = userEmail.trim().toLowerCase();
    if (!clean) {
      setError('Please enter an email address.');
      return;
    }

    if (members.some((m) => m.email.toLowerCase() === clean)) {
      setError('This user is already a member of this group.');
      return;
    }

    setIsSubmitting(true);

    const existingUser = allUsers.find((u) => u.email.toLowerCase() === clean);
    const memberName = existingUser
      ? existingUser.name
      : clean.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

    const newMember: GroupMember = {
      userId: existingUser ? existingUser.id : `user-${Date.now()}`,
      name: memberName,
      email: clean,
      role: 'member',
      balance: 0,
      joinedAt: new Date().toISOString(),
      avatarUrl: existingUser?.avatarUrl,
    };

    dispatch(addMember(newMember));

    dispatch(
      addNotification({
        notificationId: `notif-${Date.now()}`,
        type: 'member_joined',
        groupId: currentGroup.id,
        groupName: currentGroup.name,
        message: `${newMember.name} was added to ${currentGroup.name}`,
        read: false,
        createdAt: new Date().toISOString(),
      })
    );

    dispatch(
      addToast({
        type: 'success',
        title: 'Member Added',
        message: `${newMember.name} joined ${currentGroup.name}.`,
      })
    );

    setEmail('');
    setIsSubmitting(false);
    onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleAddMember(email);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
      <div className="relative w-full max-w-md bg-white rounded-xl border border-slate-200 shadow-2xl overflow-hidden p-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-emerald-100 text-emerald-700">
              <UserPlus className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-slate-900">Add Group Member</h2>
              <p className="text-xs text-slate-500">Adding to {currentGroup.name}</p>
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
            <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Member Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. friend@example.com"
              className="w-full bg-white border border-slate-200 text-slate-900 text-xs rounded-[10px] px-3 py-2 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
              required
            />
          </div>

          {availableUsers.length > 0 && (
            <div>
              <label className="block text-[11px] font-medium text-slate-500 uppercase tracking-wider mb-1.5">
                Or pick from directory
              </label>
              <div className="space-y-1 max-h-36 overflow-y-auto border border-slate-100 rounded-xl p-1 bg-slate-50/50">
                {availableUsers.map((user) => (
                  <button
                    key={user.id}
                    type="button"
                    onClick={() => handleAddMember(user.email)}
                    className="w-full text-left p-1.5 rounded-lg hover:bg-white text-xs flex items-center justify-between transition-colors"
                  >
                    <div>
                      <div className="font-semibold text-slate-800">{user.name}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{user.email}</div>
                    </div>
                    <span className="text-[10px] font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                      + Add
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

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
              <span>Add Member</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
