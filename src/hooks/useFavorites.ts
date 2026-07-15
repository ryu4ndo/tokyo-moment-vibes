import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { isSupabaseEnabled } from '@/services/auth';
import * as favoritesService from '@/services/favorites';
import { ServiceError } from '@/types/api';
import type { Favorite } from '@/types/database';
import { useToast } from '@/contexts/ToastContext';

export function useFavorites() {
  const { user, isAuthenticated } = useAuth();
  const { showToast } = useToast();
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ServiceError | null>(null);

  const spotIds = favorites.map((f) => f.spot_id);

  const refresh = useCallback(async () => {
    if (!isSupabaseEnabled || !isAuthenticated || !user?.id) {
      setFavorites([]);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await favoritesService.listFavorites(user.id);
      setFavorites(data);
    } catch (e) {
      const svcError = e instanceof ServiceError ? e : new ServiceError('Failed to load favorites');
      setError(svcError);
    } finally {
      setLoading(false);
    }
  }, [user?.id, isAuthenticated]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const add = useCallback(
    async (spotId: string) => {
      if (!user?.id) return false;
      setLoading(true);
      try {
        await favoritesService.addFavorite(user.id, spotId);
        await refresh();
        return true;
      } catch (e) {
        const msg = e instanceof ServiceError ? e.message : 'Failed to save';
        showToast({ message: msg, type: 'error' });
        return false;
      } finally {
        setLoading(false);
      }
    },
    [user?.id, refresh, showToast],
  );

  const remove = useCallback(
    async (spotId: string) => {
      if (!user?.id) return false;
      setLoading(true);
      try {
        await favoritesService.removeFavorite(user.id, spotId);
        await refresh();
        return true;
      } catch (e) {
        const msg = e instanceof ServiceError ? e.message : 'Failed to remove';
        showToast({ message: msg, type: 'error' });
        return false;
      } finally {
        setLoading(false);
      }
    },
    [user?.id, refresh, showToast],
  );

  const toggle = useCallback(
    async (spotId: string) => (spotIds.includes(spotId) ? remove(spotId) : add(spotId)),
    [spotIds, add, remove],
  );

  return { favorites, spotIds, loading, error, refresh, add, remove, toggle };
}
