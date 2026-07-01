import { extractPlanIntent } from './extractPlanIntent.js';
import { generatePlansWithOpenAI } from './generatePlan.js';

export async function generatePlanFromText({
  text,
  defaultLocation,
  experienceMode,
  companion,
  locale,
  localLevel,
}) {
  const extracted = await extractPlanIntent(text, defaultLocation);
  const plans = await generatePlansWithOpenAI({
    location: extracted.location,
    freeTime: extracted.freeTime,
    nextPlan: extracted.nextPlan,
    localLevel: localLevel ?? extracted.localLevel,
    mood: extracted.mood,
    purpose: extracted.purpose,
    purposeTime: extracted.purposeTime,
    experienceMode,
    companion,
    locale,
  });

  return { extracted, plans };
}
