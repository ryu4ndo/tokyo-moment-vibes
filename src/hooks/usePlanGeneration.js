import { useCallback, useState } from 'react';
import { generateTokyoPlans } from '@/features/plan/generateTokyoPlans';
import { generatePlansWithAI, ApiError } from '@/services/planService';

export function usePlanGeneration(planInput) {
  const [aiPlans, setAiPlans] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [planError, setPlanError] = useState(null);
  const [planErrorDetail, setPlanErrorDetail] = useState(null);
  const [planSyncKey, setPlanSyncKey] = useState(0);

  const generateAI = useCallback(async (input = planInput) => {
    setIsGenerating(true);
    setPlanError(null);
    setPlanErrorDetail(null);
    try {
      const plans = await generatePlansWithAI(input);
      setAiPlans(plans);
      return plans;
    } catch (error) {
      const fallback = generateTokyoPlans(input);
      setAiPlans(fallback);
      setPlanError(error instanceof ApiError ? error.message : error.message);
      setPlanErrorDetail(error instanceof ApiError ? error.detail : null);
      return fallback;
    } finally {
      setIsGenerating(false);
    }
  }, [planInput]);

  const regenerateFromChat = useCallback(
    async (updates, baseInput) => {
      const nextInput = { ...baseInput, ...updates };
      setIsGenerating(true);
      setPlanError(null);
      try {
        const plans = await generatePlansWithAI(nextInput);
        setAiPlans(plans);
        setPlanSyncKey((k) => k + 1);
        return plans;
      } catch (error) {
        const fallback = generateTokyoPlans(nextInput);
        setAiPlans(fallback);
        setPlanError(error instanceof ApiError ? error.message : error.message);
        return fallback;
      } finally {
        setIsGenerating(false);
      }
    },
    []
  );

  return {
    aiPlans,
    isGenerating,
    planError,
    planErrorDetail,
    planSyncKey,
    generateAI,
    regenerateFromChat,
    setAiPlans,
  };
}
