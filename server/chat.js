import OpenAI from 'openai';
import { MOODS } from '../src/data/moods.js';
import { AREAS } from '../src/data/spots.js';
import { createApiError } from './openaiError.js';

const MOOD_LABELS = MOODS.map((m) => m.labelJa);
const FREE_TIME_OPTIONS = ['30分', '1時間', '2時間', '終電まで', '半日'];
const COMPANIONS = ['solo', 'couple', 'friends', 'family', 'business', 'backpacker'];

const SYSTEM_PROMPT = `You are the Tokyo Moment Vibes AI assistant — a lifestyle guide for discovering authentic Tokyo moments.

Help users discover spots, explain vibes, and adjust their evening plan when they ask to change conditions.

Always respond in valid JSON with this shape:
{
  "reply": "your conversational message in the user's language",
  "action": "none" | "regenerate_plan",
  "updates": {
    "location": "area name or null",
    "freeTime": "30分|1時間|2時間|終電まで|半日 or null",
    "mood": "exact mood label or null",
    "experienceMode": "local|traveler or null",
    "companion": "solo|couple|friends|family|business|backpacker or null",
    "nextPlan": "string or null"
  }
}

Set action to "regenerate_plan" when the user wants to change location, time, mood/vibe, companion, experience mode, or asks for a new/updated plan.
Only include non-null fields in updates that should change.
Use exact mood labels from the allowed list when updating mood.
Be concise, warm, and practical.`;

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
  } = context;

  return `
Current user context:
- Language: ${locale === 'en' ? 'English' : 'Japanese'}
- Experience mode: ${experienceMode}
- Companion: ${companion}
- Mood: ${mood}
- Location: ${location}
- Available time: ${freeTime}
- Next plan: ${nextPlan}
- Weather: ${weather}

Allowed areas: ${AREAS.join(', ')}
Allowed moods: ${MOOD_LABELS.join(' | ')}
Allowed freeTime: ${FREE_TIME_OPTIONS.join(', ')}
Allowed companions: ${COMPANIONS.join(', ')}`;
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
      (m) => m.labelJa === updates.mood || m.labelEn === updates.mood
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
      temperature: 0.7,
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: SYSTEM_PROMPT + buildContextBlock(context) },
        ...messages.map((m) => ({ role: m.role, content: m.content })),
      ],
    });

    const raw = completion.choices[0]?.message?.content;
    if (!raw) throw new Error('Empty response from OpenAI');

    const parsed = JSON.parse(raw);
    const updates = normalizeUpdates(parsed.updates);
    const shouldRegeneratePlan =
      parsed.action === 'regenerate_plan' && Object.keys(updates).length > 0;

    return {
      reply: parsed.reply ?? raw,
      shouldRegeneratePlan,
      updates,
      model,
    };
  } catch (error) {
    throw createApiError(error, { step: 'chat' });
  }
}
