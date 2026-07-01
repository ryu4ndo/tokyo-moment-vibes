import { postApi } from './apiClient.js';

export async function generatePlanFromText({
  text,
  defaultLocation,
  experienceMode,
  companion,
  locale,
  localLevel,
}) {
  const data = await postApi('/api/plan-from-text', {
    text,
    defaultLocation,
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
