import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { isSupabaseEnabled } from '@/services/auth';
import * as plansService from '@/services/plans';
import { ServiceError } from '@/types/api';
import type { Plan, PlanInsert } from '@/types/database';
import { useToast } from '@/contexts/ToastContext';

export function usePlans() {
  const { user, isAuthenticated } = useAuth();
  const { showToast } = useToast();
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ServiceError | null>(null);

  const refresh = useCallback(async () => {
    if (!isSupabaseEnabled || !isAuthenticated || !user?.id) {
      setPlans([]);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await plansService.listPlans(user.id);
      setPlans(data);
    } catch (e) {
      const svcError = e instanceof ServiceError ? e : new ServiceError('Failed to load plans');
      setError(svcError);
    } finally {
      setLoading(false);
    }
  }, [user?.id, isAuthenticated]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const create = useCallback(
    async (input: PlanInsert) => {
      if (!user?.id) return null;
      setLoading(true);
      try {
        const plan = await plansService.createPlan(user.id, input);
        setPlans((prev) => [plan, ...prev]);
        showToast({ message: 'Plan saved', type: 'success' });
        return plan;
      } catch (e) {
        const msg = e instanceof ServiceError ? e.message : 'Failed to save plan';
        showToast({ message: msg, type: 'error' });
        return null;
      } finally {
        setLoading(false);
      }
    },
    [user?.id, showToast],
  );

  const remove = useCallback(
    async (planId: string) => {
      if (!user?.id) return false;
      setLoading(true);
      try {
        await plansService.deletePlan(user.id, planId);
        setPlans((prev) => prev.filter((p) => p.id !== planId));
        return true;
      } catch (e) {
        const msg = e instanceof ServiceError ? e.message : 'Failed to delete plan';
        showToast({ message: msg, type: 'error' });
        return false;
      } finally {
        setLoading(false);
      }
    },
    [user?.id, showToast],
  );

  return { plans, loading, error, refresh, create, remove };
}
