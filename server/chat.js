import OpenAI from 'openai';
import { MOODS } from '../src/data/moods.js';
import { AREAS } from '../src/data/spots.js';
import { ENRICHED_VIBES } from '../src/data/vibes.js';
import { createApiError } from './openaiError.js';
import {
  buildSpotCatalog,
  rankConciergeVibes,
  toRecommendationPayload,
} from './conciergeRank.js';

const MOOD_LABELS = MOODS.map((m) => m.labelJa);
const FREE_TIME_OPTIONS = ['30分', '1時間', '2時間', '終電まで', '半日'];
const COMPANIONS = ['solo', 'couple', 'friends', 'family', 'business', 'backpacker'];
const PAGES = ['HOME', 'FOOD', 'VIBES', 'PLAN', 'SAVED'];

const SYSTEM_PROMPT = `You are the Tokyo-exclusive AI Concierge for "Tokyo Moment Vibes" — NOT a generic ChatGPT.
You help international visitors and Japanese locals discover authentic Tokyo moments through mood, context, and taste.

Your personality: warm, refined, concise — like a luxury hotel concierge who knows hidden Tokyo.
You ask clarifying follow-up questions when needed to improve recommendations (budget, walking distance, after-meal plans, etc.).
You never dump long lists — curate 1-3 spots max per turn.

Always respond in valid JSON:
{
  "reply": "conversational message in user's language (2-4 sentences max)",
  "followUpQuestions": ["optional question 1", "optional question 2"],
  "recommendationSpotIds": ["spotId from catalog only, 0-3 items"],
  "recommendationReasons": { "spotId": "one-line why it fits" },
  "action": "none" | "regenerate_plan" | "create_plan" | "navigate",
  "navigateTo": "HOME" | "FOOD" | "VIBES" | "PLAN" | "SAVED" | null,
  "updates": {
    "location": "area or null",
    "freeTime": "30分|1時間|2時間|終電まで|半日 or null",
    "mood": "exact mood label or null",
    "experienceMode": "local|traveler or null",
    "companion": "solo|couple|friends|family|business|backpacker or null",
    "nextPlan": "string or null"
  },
  "excludeSpotIds": ["spotIds to avoid when showing alternatives"]
}

Rules:
- Use spotIds ONLY from the provided spot catalog. Never invent spots.
- Include followUpQuestions when you need budget, walking tolerance, or post-meal plans.
- Set action "create_plan" or "regenerate_plan" when user wants a full route/itinerary.
- Set action "navigate" with navigateTo when user should open a specific tab.
- For rain/indoor requests, prefer cafe, bar, food, music categories.
- For date/nightview requests, prefer nightview, rooftop, bar, wine.
- For "local izakaya" requests, prefer food/bar in local mode.
- Be conversational — this is multi-turn, not one-shot.`;

function buildContextBlock(context) {
  const {
    locale = 'ja',
    experienceMode = 'local',
    companion = 'solo',
    mood = '',
    location = '渋谷',
    freeTime = '2時間',
    nextPlan = 'ホテルへ',
    weather = 'clear',
    weatherSnapshot = null,
    events = [],
    currentPage = 'HOME',
    dayOfWeek = '',
    timeOfDay = '',
    savedSpotIds = [],
    recentlyViewedIds = [],
    profile = {},
    detailSpotName = null,
  } = context;

  const condition = weatherSnapshot?.condition ?? weather;
  const temp = weatherSnapshot?.temperatureC;
  const precip = weatherSnapshot?.precipitationProbability;
  const weatherLine =
    temp != null
      ? `${condition} · ${temp}°C · ${precip ?? 0}% rain`
      : condition;

  const eventsBlock =
    events.length > 0
      ? `
Active events (${events.length}):
${events
  .slice(0, 5)
  .map((e) => `- ${e.titleEn ?? e.titleJa ?? e.nameEn ?? e.nameJa} (${e.type ?? 'event'}) in ${e.area}`)
  .join('\n')}`
      : '\nActive events: none today';

  const profileBlock = profile.hasData
    ? `
AI Profile (learned taste):
- Top categories: ${(profile.topCategories ?? []).map((c) => c.id).join(', ') || '—'}
- Top areas: ${(profile.topAreas ?? []).map((a) => a.id).join(', ') || '—'}
- Budget: ${profile.budgetLabel ?? '—'}
- Walk preference: ${profile.walkPreference ?? '—'}
- Time of day: ${profile.timeOfDay ?? '—'}
- Interests: ${(profile.activeInterests ?? []).map((i) => i.id).join(', ') || '—'}
- Signals learned: ${profile.signalCount ?? 0}`
    : '\nAI Profile: not enough data yet — ask 1-2 preference questions.';

  return `
Current context:
- Language: ${locale === 'en' ? 'English' : 'Japanese'}
- Current page: ${currentPage}
- Experience mode: ${experienceMode} (${experienceMode === 'traveler' ? 'visitor' : 'local'})
- Companion: ${companion}
- Mood: ${mood || 'not set'}
- Location: ${location}
- Available time: ${freeTime}
- Next plan: ${nextPlan}
- Weather: ${weatherLine} (prefer indoor for rain/snow; parks & terraces when clear)
- Day: ${dayOfWeek}
- Local time: ${timeOfDay}
- Saved spots (${savedSpotIds.length}): ${savedSpotIds.slice(0, 8).join(', ') || 'none'}
- Recently viewed: ${recentlyViewedIds.slice(0, 5).join(', ') || 'none'}
${detailSpotName ? `- Currently viewing spot: ${detailSpotName}` : ''}
${eventsBlock}
${profileBlock}

Allowed areas: ${AREAS.join(', ')}
Allowed moods: ${MOOD_LABELS.join(' | ')}
Allowed freeTime: ${FREE_TIME_OPTIONS.join(', ')}
Allowed companions: ${COMPANIONS.join(', ')}
Allowed pages: ${PAGES.join(', ')}

Spot catalog (use spotId exactly):
${JSON.stringify(buildSpotCatalog().slice(0, 40))}`;
}

function normalizeUpdates(updates = {}) {
  const normalized = {};
  if (updates.location && AREAS.includes(updates.location)) {
    normalized.location = updates.location;
  }
  if (updates.freeTime && FREE_TIME_OPTIONS.includes(updates.freeTime)) {
    normalized.freeTime = updates.freeTime;
  }
  if (updates.mood) {
    const match = MOODS.find(
      (m) => m.labelJa === updates.mood || m.labelEn === updates.mood,
    );
    if (match) normalized.mood = match.labelJa;
  }
  if (updates.experienceMode === 'local' || updates.experienceMode === 'traveler') {
    normalized.experienceMode = updates.experienceMode;
  }
  if (updates.companion && COMPANIONS.includes(updates.companion)) {
    normalized.companion = updates.companion;
  }
  if (updates.nextPlan && typeof updates.nextPlan === 'string') {
    normalized.nextPlan = updates.nextPlan;
  }
  return normalized;
}

function resolveRecommendations(parsed, context) {
  const validIds = new Set(ENRICHED_VIBES.map((v) => v.spotId));
  const reasons = parsed.recommendationReasons ?? {};
  const requested = (parsed.recommendationSpotIds ?? []).filter((id) => validIds.has(id));

  let vibes;
  const allExcluded = [
    ...(parsed.excludeSpotIds ?? []),
    ...(context.excludeSpotIds ?? []),
  ];
  if (requested.length > 0) {
    vibes = requested
      .map((spotId) => ENRICHED_VIBES.find((v) => v.spotId === spotId))
      .filter(Boolean);
  } else {
    vibes = rankConciergeVibes(context, {
      limit: 3,
      excludeSpotIds: allExcluded,
    });
  }

  return vibes.map((v) =>
    toRecommendationPayload(v, reasons[v.spotId] ?? parsed.reply?.slice(0, 80) ?? ''),
  );
}

export async function chatWithAI({ messages = [], context = {} }) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY is not configured.');
  }

  const client = new OpenAI({ apiKey });
  const model = process.env.OPENAI_MODEL || 'gpt-4.1-mini';

  try {
    const completion = await client.chat.completions.create({
      model,
      temperature: 0.72,
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: SYSTEM_PROMPT + buildContextBlock(context) },
        ...messages.map((m) => ({
          role: m.role,
          content: typeof m.content === 'string' ? m.content : m.content,
        })),
      ],
    });

    const raw = completion.choices[0]?.message?.content;
    if (!raw) throw new Error('Empty response from OpenAI');

    const parsed = JSON.parse(raw);
    const updates = normalizeUpdates(parsed.updates);
    const recommendations = resolveRecommendations(parsed, context);

    const shouldRegeneratePlan =
      (parsed.action === 'regenerate_plan' || parsed.action === 'create_plan') &&
      Object.keys(updates).length > 0;

    const shouldCreatePlan = parsed.action === 'create_plan';
    const shouldNavigate =
      parsed.action === 'navigate' && PAGES.includes(parsed.navigateTo);

    const mapCenter =
      recommendations.length > 0
        ? { lat: recommendations[0].lat, lng: recommendations[0].lng }
        : null;

    return {
      reply: parsed.reply ?? raw,
      followUpQuestions: (parsed.followUpQuestions ?? []).slice(0, 3),
      recommendations,
      mapCenter,
      shouldRegeneratePlan,
      shouldCreatePlan,
      shouldNavigate,
      navigateTo: shouldNavigate ? parsed.navigateTo : null,
      updates,
      excludeSpotIds: parsed.excludeSpotIds ?? [],
      model,
    };
  } catch (error) {
    throw createApiError(error, { step: 'chat' });
  }
}
