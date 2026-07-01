import OpenAI from 'openai';
import { spots } from '../src/data/spots.js';
import { createApiError } from './openaiError.js';
import {
  pickSpotsForPlan,
  matchSpotsFromSchedule,
  buildPlanAiReason,
  rankSpotsForContext,
} from './planScoring.js';

function getStartTime() {
  const now = new Date();
  const minutes = now.getMinutes();
  const rounded = Math.ceil(minutes / 15) * 15;
  now.setMinutes(rounded, 0, 0);
  return now.toLocaleTimeString('ja-JP', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
}

function buildSpotListForPrompt(rankedSpots, locale) {
  return rankedSpots
    .map((spot) => {
      const desc = locale === 'en' ? spot.description : spot.description;
      return `- [${spot.id}] ${spot.name} (${spot.category}): ${desc}`;
    })
    .join('\n');
}

export async function generatePlansWithOpenAI(input) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY が設定されていません。.env を確認してください。');
  }

  const {
    location,
    freeTime,
    nextPlan,
    localLevel,
    mood,
    purpose,
    purposeTime,
    experienceMode = 'local',
    companion = 'solo',
    locale = 'ja',
  } = input;

  const areaSpots = spots.filter((spot) => spot.area === location);
  const model = process.env.OPENAI_MODEL || 'gpt-4.1-mini';
  const startTime = getStartTime();
  const experienceLabel = experienceMode === 'traveler' ? 'Traveler Mode' : 'Local Mode';
  const companionLabel = companion ?? 'solo';
  const languageLabel = locale === 'en' ? 'English' : 'Japanese';
  const moodLabel = mood?.replace(/^.\s*/, '') ?? mood;

  const rankedSpots = rankSpotsForContext({
    location,
    mood,
    experienceMode,
    companion,
    limit: 15,
  });

  const spotList = buildSpotListForPrompt(rankedSpots, locale);

  const client = new OpenAI({ apiKey });

  let completion;
  try {
    completion = await client.chat.completions.create({
      model,
      temperature: 0.75,
      response_format: { type: 'json_object' },
      messages: [
        {
          role: 'system',
          content:
            'You are a Tokyo experience planner for Tokyo Moment Vibes. Return valid JSON only. Use exact spot names from the provided list when scheduling visits.',
        },
        {
          role: 'user',
          content: `Create 3 distinct Tokyo experience plans.

[User context — weight all factors equally]
- Location area: ${location}
- Available time: ${freeTime}
- Next destination after plan: ${nextPlan}
- Local level: ${localLevel}
- Mood / Vibe: ${mood}
- Experience mode: ${experienceLabel} — ${
            experienceMode === 'traveler'
              ? 'prioritize English menu, cashless, easy access, iconic yet authentic'
              : 'prioritize local favorites, value, late-night, hidden gems'
          }
- Companion: ${companionLabel} — tailor pace and spot types for this group
- Language: ${languageLabel} — write title, summary, activities in this language
${purpose ? `- Purpose: ${purpose}` : ''}
${purposeTime ? `- Must finish before: ${purposeTime}` : ''}
- Approximate start: ${startTime}

[Available spots — USE EXACT NAMES from this list in schedule activities]
${spotList || '- Explore nearby streets, cafes, bars'}

[Rules]
- Return exactly 3 plans in "plans" array
- Each plan: id, title, summary, aiReason, schedule
- schedule items: { "time": "HH:MM", "activity": "Spot name or short action" }
- Use spot names EXACTLY as listed when visiting a spot
- Realistic 15–60 min intervals between stops
- End heading toward "${nextPlan}"
- aiReason: 1 sentence why this plan fits mood + mode + companion
- Reflect mood "${moodLabel}" in every plan

JSON:
{
  "plans": [
    {
      "id": "plan-1",
      "title": "...",
      "summary": "...",
      "aiReason": "...",
      "schedule": [{ "time": "17:00", "activity": "..." }]
    }
  ]
}`,
        },
      ],
    });
  } catch (error) {
    throw createApiError(error, { step: 'generate-plan' });
  }

  const content = completion.choices[0]?.message?.content;
  if (!content) {
    throw new Error('OpenAI からの応答が空でした。');
  }

  const parsed = JSON.parse(content);
  const usedIds = new Set();

  return (parsed.plans ?? []).slice(0, 3).map((plan, index) => {
    const schedule = plan.schedule ?? [];
    const preferred = pickSpotsForPlan({
      location,
      mood,
      experienceMode,
      companion,
      freeTime,
      variant: index,
      usedIds,
    });
    let matchedSpots = matchSpotsFromSchedule(schedule, areaSpots, preferred);

    if (matchedSpots.length === 0 && preferred.length > 0) {
      matchedSpots = preferred;
    } else if (matchedSpots.length === 0 && areaSpots.length > 0) {
      matchedSpots = areaSpots.slice(0, Math.min(3, areaSpots.length));
    }

    const aiReason =
      plan.aiReason ??
      buildPlanAiReason({ location, mood, experienceMode, companion, locale });

    return {
      id: plan.id ?? `plan-${index}`,
      title: plan.title ?? (locale === 'en' ? `Plan ${index + 1}` : `プラン ${index + 1}`),
      summary: plan.summary ?? `${location} · ${moodLabel}`,
      aiReason,
      schedule,
      spots: matchedSpots,
      steps: schedule.map((item) => `${item.time} ${item.activity}`),
      experienceMode,
      companion,
      locale,
    };
  });
}
