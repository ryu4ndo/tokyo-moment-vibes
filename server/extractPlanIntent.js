import OpenAI from 'openai';
import { AREAS } from '../src/data/spots.js';
import { createApiError } from './openaiError.js';

const MOODS = [
  '🌃 深夜東京を感じたい',
  '🍷 しっぽり飲みたい',
  '☕ 一人で落ち着きたい',
  '🚶 雨の夜を歩きたい',
  '✨ ローカル東京を感じたい',
];

const FREE_TIME_OPTIONS = ['30分', '1時間', '2時間', '3時間', '終電まで', '半日'];
const LOCAL_LEVELS = [
  'Tourist Friendly',
  'Semi Local',
  'Hidden Local',
  'Tokyo Native Level',
];

function normalizeFreeTime(value) {
  if (!value) return '2時間';
  const text = String(value);
  if (FREE_TIME_OPTIONS.includes(text)) return text;
  if (text.includes('30')) return '30分';
  if (/^1\s*時間|1時間/.test(text)) return '1時間';
  if (/^2\s*時間|2時間/.test(text)) return '2時間';
  if (/^3\s*時間|3時間/.test(text)) return '3時間';
  if (/4\s*時間|半日/.test(text)) return '半日';
  if (/45\s*分/.test(text)) return '30分';
  if (text.includes('終電')) return '終電まで';
  return '2時間';
}

function normalizeMood(value) {
  if (MOODS.includes(value)) return value;
  const text = String(value ?? '');
  if (text.includes('ワイン') || text.includes('飲')) return '🍷 しっぽり飲みたい';
  if (text.includes('雨') || text.includes('歩')) return '🚶 雨の夜を歩きたい';
  if (text.includes('落ち着') || text.includes('一人') || text.includes('カフェ')) {
    return '☕ 一人で落ち着きたい';
  }
  if (text.includes('ローカル') || text.includes('地元')) return '✨ ローカル東京を感じたい';
  return '🌃 深夜東京を感じたい';
}

function normalizeLocation(value, defaultLocation) {
  if (AREAS.includes(value)) return value;
  const text = String(value ?? '');
  const found = AREAS.find((area) => text.includes(area));
  return found ?? defaultLocation;
}

export async function extractPlanIntent(text, defaultLocation = '渋谷') {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY が設定されていません。.env を確認してください。');
  }

  const model = process.env.OPENAI_MODEL || 'gpt-4.1-mini';
  const client = new OpenAI({ apiKey });

  let completion;
  try {
    completion = await client.chat.completions.create({
    model,
    temperature: 0.2,
    response_format: { type: 'json_object' },
    messages: [
      {
        role: 'system',
        content:
          'あなたは東京の空き時間プランナーです。ユーザーは予定の合間の空き時間を有効活用したい（例: ライブまで2時間、チェックインまで1時間半、仕事終わりに2時間）。自然文から空き時間の条件を抽出し、JSONのみ返してください。旅行全体の計画ではなく、その場の空き時間に焦点を当ててください。',
      },
      {
        role: 'user',
        content: `以下の自然文から、東京体験プランの条件を抽出してください。

【入力文】
${text}

【デフォルト現在地】
${defaultLocation}

【選択肢】
- 現在地 location: ${AREAS.join(' / ')}
- 空き時間 freeTime: ${FREE_TIME_OPTIONS.join(' / ')}（「3時間」などは最も近い値に丸める）
- 気分 mood: ${MOODS.join(' / ')}
- LOCAL LEVEL localLevel: ${LOCAL_LEVELS.join(' / ')}

【ルール】
- purpose はユーザーの目的・次の予定（例: 20時に会食）
- nextPlan は purpose を短くした移動先ラベル（例: 会食へ）
- purposeTime は目的の時刻があれば HH:MM 形式（例: 20:00）
- 現在地が文中に無ければ defaultLocation を使う

JSON形式:
{
  "location": "渋谷",
  "freeTime": "半日",
  "mood": "🍷 しっぽり飲みたい",
  "purpose": "20時に会食",
  "nextPlan": "会食へ",
  "purposeTime": "20:00",
  "localLevel": "Semi Local"
}`,
      },
    ],
    });
  } catch (error) {
    throw createApiError(error, { step: 'extract-plan-intent' });
  }

  const content = completion.choices[0]?.message?.content;
  if (!content) {
    throw new Error('条件抽出の応答が空でした。');
  }

  const parsed = JSON.parse(content);

  return {
    location: normalizeLocation(parsed.location, defaultLocation),
    freeTime: normalizeFreeTime(parsed.freeTime),
    mood: normalizeMood(parsed.mood),
    purpose: parsed.purpose ?? parsed.nextPlan ?? '予定なし',
    nextPlan: parsed.nextPlan ?? parsed.purpose ?? '予定なし',
    purposeTime: parsed.purposeTime ?? null,
    localLevel: LOCAL_LEVELS.includes(parsed.localLevel)
      ? parsed.localLevel
      : 'Semi Local',
  };
}
