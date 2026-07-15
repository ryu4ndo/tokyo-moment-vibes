import { extractPlanIntent } from './extractPlanIntent.js';
import { generatePlansWithOpenAI } from './generatePlan.js';

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
  const extracted = await extractPlanIntent(text, defaultLocation);
  const plans = await generatePlansWithOpenAI({
    location: defaultLocation || extracted.location,
    freeTime: freeTime || extracted.freeTime,
    nextPlan: extracted.nextPlan,
    localLevel: localLevel ?? extracted.localLevel,
    mood: mood || extracted.mood,
    purpose: planPurpose || extracted.purpose,
    purposeTime: extracted.purposeTime,
    planBudget,
    experienceMode,
    companion,
    locale,
  });

  return {
    extracted: {
      ...extracted,
      location: defaultLocation || extracted.location,
      freeTime: freeTime || extracted.freeTime,
    },
    plans,
  };
}
