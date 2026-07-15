import { postApi } from './apiClient.js';

export async function generatePlanFromText({
  text,
  defaultLocation,
  freeTime,
  mood,
  planPurpose,
  planBudget,
  experienceMode,
  companion,
  locale,
  localLevel,
}) {
  const data = await postApi('/api/plan-from-text', {
    text,
    defaultLocation,
    freeTime,
    mood,
    planPurpose,
    planBudget,
    experienceMode,
    companion,
    locale,
    localLevel,
  });

  return {
    extracted: data.extracted,
    plans: data.plans ?? [],
  };
}
