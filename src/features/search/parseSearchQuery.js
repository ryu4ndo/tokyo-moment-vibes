import { TOKYO_AREAS } from '@/data/areas';

const CATEGORY_KEYWORDS = [
  { cats: ['food'], ja: ['焼鳥', '焼き鳥', '居酒屋', 'ラーメン', '寿司', 'すし', 'グルメ', '食事', 'ディナー', 'ランチ', '食べ歩き', '和食', 'イタリアン', '焼肉', '串', 'izakaya', 'ramen', 'sushi', 'yakitori', 'dinner', 'lunch', 'food'] },
  { cats: ['cafe', 'chill'], ja: ['カフェ', 'コーヒー', 'ティー', 'チル', 'cafe', 'coffee', 'tea', 'chill'] },
  { cats: ['bar'], ja: ['バー', 'ワイン', 'カクテル', '飲み', 'bar', 'wine', 'cocktail', 'drinks'] },
  { cats: ['nightview', 'rooftop'], ja: ['夜景', 'テラス', 'ルーフトップ', 'night view', 'rooftop', 'terrace', 'view'] },
  { cats: ['music', 'culture'], ja: ['美術館', '博物館', 'ライブ', 'ジャズ', 'museum', 'gallery', 'culture', 'music', 'jazz'] },
  { cats: ['walk'], ja: ['散歩', '公園', 'walk', 'park', 'stroll'] },
];

const INTENT_PATTERNS = [
  { key: 'indoor', patterns: ['雨', '屋内', '室内', 'rain', 'indoor', 'inside'] },
  { key: 'outdoor', patterns: ['晴れ', '屋外', 'テラス', '公園', 'outdoor', 'sunny', 'park'] },
  { key: 'lateNight', patterns: ['終電', '深夜', '夜遅く', 'last train', 'late night', 'midnight'] },
  { key: 'quiet', patterns: ['静か', 'ゆっくり', '落ち着', 'quiet', 'calm', 'chill out'] },
  { key: 'popular', patterns: ['人気', '話題', 'sns', 'インスタ', 'trending', 'popular', 'instagram'] },
  { key: 'local', patterns: ['地元', 'ローカル', '穴場', 'local', 'hidden gem', 'off the beaten'] },
  { key: 'traveler', patterns: ['外国人', '友達', 'visitor', 'foreign', 'traveler', 'english menu'] },
  { key: 'date', patterns: ['デート', '誕生日', '記念日', '彼女', '彼氏', 'date', 'birthday', 'anniversary', 'romantic'] },
  { key: 'solo', patterns: ['一人', 'ひとり', 'ソロ', 'solo', 'alone', 'by myself'] },
  { key: 'budget', patterns: ['コスパ', '安い', 'リーズナブル', 'budget', 'cheap', 'affordable', 'value'] },
  { key: 'premium', patterns: ['高級', '特別', '贅沢', 'premium', 'luxury', 'fancy', 'splurge'] },
];

function matchAreas(text) {
  const lower = text.toLowerCase();
  const found = [];
  for (const area of TOKYO_AREAS) {
    if (text.includes(area.id) || lower.includes(area.en.toLowerCase())) {
      found.push(area.id);
    }
  }
  return found;
}

function matchCategories(text) {
  const lower = text.toLowerCase();
  const cats = new Set();
  for (const group of CATEGORY_KEYWORDS) {
    if (group.ja.some((kw) => text.includes(kw) || lower.includes(kw.toLowerCase()))) {
      group.cats.forEach((c) => cats.add(c));
    }
  }
  return [...cats];
}

function matchIntents(text) {
  const lower = text.toLowerCase();
  const intents = {};
  for (const { key, patterns } of INTENT_PATTERNS) {
    if (patterns.some((p) => text.includes(p) || lower.includes(p))) {
      intents[key] = true;
    }
  }
  return intents;
}

function parseBudget(text) {
  const yenMatch = text.match(/(\d{3,5})\s*円/);
  if (yenMatch) return { maxYen: Number(yenMatch[1]) };
  if (/¥{1,4}|budget.*\d/i.test(text)) {
    const m = text.match(/(\d{3,5})/);
    if (m) return { maxYen: Number(m[1]) };
  }
  return {};
}

function parseWalkMax(text) {
  const m = text.match(/徒歩\s*(\d+)\s*分/);
  if (m) return Number(m[1]);
  const en = text.match(/(\d+)\s*min(?:ute)?\s*walk/i);
  if (en) return Number(en[1]);
  return null;
}

/** Parse natural-language search into structured signals */
export function parseSearchQuery(query = '') {
  const text = query.trim();
  const intents = matchIntents(text);
  const budget = parseBudget(text);

  return {
    raw: text,
    areas: matchAreas(text),
    categories: matchCategories(text),
    intents,
    companion: intents.date ? 'couple' : intents.solo ? 'solo' : null,
    budgetMax: budget.maxYen ?? null,
    budgetLevel: intents.budget ? 'low' : intents.premium ? 'high' : null,
    indoor: intents.indoor,
    outdoor: intents.outdoor,
    lateNight: intents.lateNight,
    quiet: intents.quiet,
    popular: intents.popular,
    local: intents.local,
    traveler: intents.traveler,
    walkMax: parseWalkMax(text),
    freeTime: intents.lateNight ? '終電まで' : null,
  };
}

/** Merge active AI filter chips into parsed query */
export function applySearchFilters(parsed, filterIds = []) {
  const next = { ...parsed, intents: { ...parsed.intents } };
  for (const id of filterIds) {
    if (id === 'quieter') next.quiet = true;
    if (id === 'cheaper') next.budgetLevel = 'low';
    if (id === 'walk10') next.walkMax = 10;
    if (id === 'locals') next.local = true;
    if (id === 'sns') next.popular = true;
    if (id === 'date') {
      next.intents.date = true;
      next.companion = 'couple';
    }
  }
  return next;
}
