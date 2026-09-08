import React, { useEffect, useState } from 'react';
import { Mail, User, UserCog, ShieldCheck, Save } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { updateCurrentUser } from '../../store/slices/authSlice';
import { addToast } from '../../store/slices/uiSlice';
import { getProfile, updateProfile } from '../../services/user.service';
import { PageHeader } from '../../components/common/PageHeader';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import type { ProfileResult } from '../../types/auth';

export const ProfilePage: React.FC = () => {
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector((state) => state.auth.currentUser);

  const [profile, setProfile] = useState<ProfileResult | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [updatedAt, setUpdatedAt] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const loadProfile = async () => {
      try {
        const result = await getProfile();
        if (cancelled) return;
        setProfile(result);
        setName(result.name);
        setEmail(result.email);
      } catch (err) {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : 'Failed to load profile.');
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    loadProfile();

    return () => {
      cancelled = true;
    };
  }, []);

  const isDirty = profile !== null && (name.trim() !== profile.name || email.trim() !== profile.email);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim() || !email.trim()) {
      setError('Please provide both name and email.');
      return;
    }

    setIsSaving(true);

    try {
      const result = await updateProfile(currentUser.id, {
        name: name.trim(),
        email: email.trim(),
      });

      dispatch(
        updateCurrentUser({
          name: result.name,
          email: result.email,
        })
      );
      dispatch(
        addToast({
          type: 'success',
          title: 'Profile updated',
          message: 'Your account details have been saved.',
        })
      );

      setProfile({
        userId: result.userId,
        email: result.email,
        name: result.name,
        createdAt: profile?.createdAt ?? '',
      });
      setUpdatedAt(result.updatedAt);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update profile.');
    } finally {
      setIsSaving(false);
    }
  };

  const formatDate = (iso: string | undefined): string =>
    iso
      ? new Date(iso).toLocaleDateString(undefined, {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })
      : '—';

  return (
    <div className="space-y-6">
      <PageHeader
        title="Profile & Settings"
        description="View and update the account details used across your shared expense spaces."
      />

      <div className="grid grid-cols-1 gap-6">
        {isLoading ? (
          <div className="p-8 text-center text-xs text-slate-400">Loading profile...</div>
        ) : (
          <>
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-lg font-bold text-slate-700 shrink-0">
                  {(profile?.name.charAt(0) ?? '?').toUpperCase()}
                </div>
                <div className="min-w-0">
                  <h3 className="text-sm font-semibold text-slate-900 truncate">
                    {profile?.name}
                  </h3>
                  <p className="text-xs text-slate-500 font-mono truncate">{profile?.email}</p>
                </div>
              </div>

              <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="flex items-center gap-2 text-slate-600">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Member since</span>
                  <span className="font-medium text-slate-900 ml-auto">
                    {formatDate(profile?.createdAt)}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                  <Save className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Last updated</span>
                  <span className="font-medium text-slate-900 ml-auto">{formatDate(updatedAt ?? undefined)}</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <div className="flex items-center gap-2 mb-1">
                <UserCog className="w-4 h-4 text-emerald-600" />
                <h3 className="text-sm font-semibold text-slate-900">Edit Account Details</h3>
              </div>
              <p className="text-xs text-slate-500 mb-5">
                Update your display name or email address. Your email must be unique.
              </p>

              {error && (
                <div className="p-3 mb-4 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-lg">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  label="Full name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  leftIcon={<User className="w-3.5 h-3.5" />}
                  placeholder="Your full name"
                />

                <Input
                  label="Email address"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  leftIcon={<Mail className="w-3.5 h-3.5" />}
                  placeholder="you@example.com"
                />

                <div className="pt-2 flex items-center justify-end gap-2">
                  <Button
                    type="submit"
                    variant="primary"
                    size="sm"
                    isLoading={isSaving}
                    disabled={!isDirty || isSaving}
                    leftIcon={<Save className="w-3.5 h-3.5" />}
                  >
                    Save Changes
                  </Button>
                </div>
              </form>
            </div>
          </>
        )}
      </div>
    </div>
  );
};