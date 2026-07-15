import { useCallback, useContext, useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { isSupabaseEnabled } from '@/services/auth';
import * as profileService from '@/services/profile';
import { ServiceError } from '@/types/api';
import type { Profile, ProfileMode } from '@/types/database';
import { useToast } from '@/contexts/ToastContext';

export function useProfile() {
  const { user, isAuthenticated } = useAuth();
  const { showToast } = useToast();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ServiceError | null>(null);

  const refresh = useCallback(async () => {
    if (!isSupabaseEnabled || !isAuthenticated || !user?.id) {
      setProfile(null);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await profileService.fetchProfile(user.id);
      setProfile(data);
    } catch (e) {
      const svcError = e instanceof ServiceError ? e : new ServiceError('Failed to load profile');
      setError(svcError);
      if (svcError.code === 'AUTH') showToast({ message: svcError.message, type: 'error' });
    } finally {
      setLoading(false);
    }
  }, [user?.id, isAuthenticated, showToast]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const updateProfile = useCallback(
    async (patch: { name?: string; avatar?: string; mode?: ProfileMode }) => {
      if (!user?.id) return null;
      setLoading(true);
      setError(null);
      try {
        const data = await profileService.upsertProfile(user.id, patch);
        setProfile(data);
        return data;
      } catch (e) {
        const svcError = e instanceof ServiceError ? e : new ServiceError('Failed to update profile');
        setError(svcError);
        showToast({ message: svcError.message, type: 'error' });
        return null;
      } finally {
        setLoading(false);
      }
    },
    [user?.id, showToast],
  );

  return { profile, loading, error, refresh, updateProfile };
}
