/** Generate per-result AI recommendation copy from parsed query + vibe */

const REASON_TEMPLATES = {
  ja: {
    area: (area) => `${area}エリアで今の条件にぴったり`,
    category: (cat) => `「${cat}」の雰囲気がしっくりきます`,
    rain: '雨の日でも快適に過ごせる屋内スポット',
    clear: '晴れた日にぴったりの開放的な雰囲気',
    date: 'デートにちょうどいい距離感とムード',
    solo: '一人でも入りやすく、ゆっくり過ごせます',
    local: '地元の人にも愛される、ガイドブックにない一軒',
    traveler: '海外の友達を連れて行きやすい安心感',
    budget: 'コスパが良く、気軽に楽しめます',
    quiet: '落ち着いた空間で会話もはずみます',
    popular: '今まさに話題 — SNSでも人気のスポット',
    lateNight: '終電までゆっくり楽しめる',
    walk: (min) => `現在地から徒歩${min}分 — サクッと行けます`,
    aiPick: 'AIが今夜のあなたに強くおすすめ',
    default: 'あなたの検索条件にマッチする東京の一瞬',
  },
  en: {
    area: (area) => `A perfect fit in ${area} for what you asked`,
    category: (cat) => `The ${cat} vibe matches your mood`,
    rain: 'Cozy indoor pick — great on rainy days',
    clear: 'Open, airy atmosphere for clear skies',
    date: 'Just the right mood and pace for a date',
    solo: 'Easy to enjoy solo without feeling awkward',
    local: 'Beloved by locals — not in the guidebooks',
    traveler: 'Easy to bring international friends',
    budget: 'Great value without compromising the experience',
    quiet: 'Calm enough for real conversation',
    popular: 'Buzzing right now — social-media favorite',
    lateNight: 'You can linger until last train',
    walk: (min) => `${min}-min walk from you — quick to reach`,
    aiPick: 'AI strongly recommends this for you tonight',
    default: 'A Tokyo moment that matches your search',
  },
};

export function buildSearchReason(vibe, parsed, ctx) {
  const locale = ctx.locale ?? 'ja';
  const t = REASON_TEMPLATES[locale] ?? REASON_TEMPLATES.ja;
  const parts = [];

  if (parsed.areas.length && parsed.areas.includes(vibe.area)) {
    parts.push(t.area(vibe.area));
  } else if (vibe.area === ctx.location) {
    parts.push(t.area(vibe.area));
  }

  if (parsed.categories.includes(vibe.category)) {
    parts.push(t.category(vibe.categoryLabel ?? vibe.category));
  }

  if (parsed.indoor || ctx.weather === 'rain') parts.push(t.rain);
  else if (parsed.outdoor || ctx.weather === 'clear') parts.push(t.clear);

  if (parsed.intents?.date || parsed.companion === 'couple') parts.push(t.date);
  if (parsed.companion === 'solo') parts.push(t.solo);
  if (parsed.local) parts.push(t.local);
  if (parsed.traveler) parts.push(t.traveler);
  if (parsed.budgetLevel === 'low' || parsed.budgetMax) parts.push(t.budget);
  if (parsed.quiet) parts.push(t.quiet);
  if (parsed.popular) parts.push(t.popular);
  if (parsed.lateNight) parts.push(t.lateNight);

  if (vibe.walkMinutes != null && vibe.walkMinutes <= 10) {
    parts.push(t.walk(vibe.walkMinutes));
  }

  if (vibe.aiPick && parts.length < 2) parts.push(t.aiPick);

  const unique = [...new Set(parts)];
  return unique.slice(0, 2).join(' — ') || t.default;
}

export function buildSearchAiMessage(query, results, parsed, ctx) {
  const locale = ctx.locale ?? 'ja';
  const count = results.length;
  const isEn = locale === 'en';

  if (!count) {
    return isEn
      ? `I couldn't find a perfect match for "${query}". Try a filter below or broaden your area.`
      : `「${query}」にぴったりのスポットが見つかりませんでした。下のフィルターで条件を変えてみてください。`;
  }

  const areaHint = parsed.areas[0] ?? ctx.location;
  const weatherHint =
    parsed.indoor || ctx.weather === 'rain'
      ? isEn
        ? 'Indoor picks for the weather'
        : '天気を考えて屋内中心に'
      : null;

  if (isEn) {
    return weatherHint
      ? `${count} spots in ${areaHint} — ${weatherHint}. Tap a card to explore.`
      : `${count} curated spots for "${query}" in ${areaHint}. Each one is picked for your mood, not just keywords.`;
  }

  return weatherHint
    ? `${areaHint}で${count}件 — ${weatherHint}セレクトしました。カードをタップで詳細へ。`
    : `「${query}」に合う${count}件を${areaHint}周辺から厳選。キーワードではなく、あなたの気分に合わせて選びました。`;
}
