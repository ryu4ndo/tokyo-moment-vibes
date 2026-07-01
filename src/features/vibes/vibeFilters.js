import { getCompanionCategories } from '@/data/companions';

import { TRAVELER_EXPERIENCES, LOCAL_PRIORITIES } from '@/data/experienceModes';

const TRAVELER_MODES = ['classic', 'hidden', 'traveler'];

const COMPANION_COMMENTS = {
  ja: {
    solo: ['一人でも入りやすい、静かな空間。', '読書や思索にぴったり。', 'カウンター席が心地よい。'],
    couple: ['デートに選ばれる夜景スポット。', '二人の会話がはずむ照明。', '記念日にもおすすめ。'],
    friends: ['友達との飲み歩きに最適。', 'シェアしやすいメニューが豊富。', '盛り上がる夜を演出。'],
    family: ['家族でも安心して楽しめる。', '子ども連れでも入りやすい雰囲気。', 'ゆったり過ごせる席。'],
    business: ['落ち着いた接客でビジネス利用も。', '会話がしやすい静かな空間。', '短時間でも楽しめる。'],
    backpacker: ['コスパ良く東京の夜を味わえる。', '旅人同士の交流も楽しめる。', '深夜まで開いている。'],
  },
  en: {
    solo: ['Easy to enjoy alone — no awkwardness.', 'Perfect for quiet reflection.', 'Counter seats feel welcoming.'],
    couple: ['A date-night favorite with great views.', 'Intimate lighting for conversation.', 'Memorable for special nights.'],
    friends: ['Ideal for a night out with friends.', 'Shareable plates and lively energy.', 'The kind of place groups love.'],
    family: ['Comfortable for families visiting Tokyo.', 'Welcoming even with kids.', 'Relaxed seating for everyone.'],
    business: ['Calm enough for a business chat.', 'Professional yet warm atmosphere.', 'Works for a quick evening stop.'],
    backpacker: ['Great value for travelers on a budget.', 'Meet other explorers here.', 'Open late for night owls.'],
  },
};

export function applyVibeFilters(vibes, {
  category,
  keywordId,
  quickFilters = [],
  experienceMode,
  companion,
  travelerExperience,
  localPriority,
}) {
  let result = [...vibes];

  if (experienceMode === 'traveler') {
    result = result.filter((v) =>
      v.experienceModes?.some((m) => TRAVELER_MODES.includes(m))
    );
    if (travelerExperience) {
      const exp = TRAVELER_EXPERIENCES.find((e) => e.id === travelerExperience);
      if (exp?.categories?.length) {
        result = result.filter((v) => exp.categories.includes(v.category));
      }
    }
  } else if (experienceMode === 'local') {
    result = result.filter((v) => v.experienceModes?.includes('local'));
    if (localPriority) {
      const pri = LOCAL_PRIORITIES.find((p) => p.id === localPriority);
      if (pri?.keywordId) {
        result = result.filter((v) => {
          const ids = [...(v.localKeywordIds ?? []), ...(v.keywordIds ?? [])];
          return ids.includes(pri.keywordId);
        });
      }
    }
  }

  if (companion) {
    result = result.filter((v) => v.companionFit?.includes(companion));
  }

  if (category && category !== 'all') {
    result = result.filter((v) => v.category === category);
  }

  if (keywordId) {
    result = result.filter((v) => {
      const ids =
        experienceMode === 'traveler'
          ? [...(v.travelerKeywordIds ?? []), ...(v.keywordIds ?? [])]
          : [...(v.localKeywordIds ?? []), ...(v.keywordIds ?? [])];
      return ids.includes(keywordId);
    });
  }

  for (const filterId of quickFilters) {
    switch (filterId) {
      case 'open':
        result = result.filter((v) => v.isOpen);
        break;
      case 'reservable':
        result = result.filter((v) => v.reservable);
        break;
      case 'date':
        result = result.filter((v) => v.suitableFor?.includes('date'));
        break;
      case 'solo':
        result = result.filter((v) => v.suitableFor?.includes('solo'));
        break;
      case 'lateNight':
        result = result.filter((v) => v.lateNight);
        break;
      case 'walk5':
        result = result.filter((v) => v.walkMinutes <= 5);
        break;
      case 'budget':
        result = result.filter((v) => v.priceRange === '¥' || v.priceRange === '¥¥');
        break;
      default:
        break;
    }
  }

  if (quickFilters.includes('popular')) {
    result.sort((a, b) => b.rating - a.rating);
  }

  return result;
}

export function getRelatedVibes(vibes, current, experienceMode, companion, limit = 6) {
  return vibes
    .filter((v) => {
      if (v.id === current.id || v.category !== current.category) return false;
      if (companion && !v.companionFit?.includes(companion)) return false;
      if (experienceMode === 'traveler') {
        return v.experienceModes?.some((m) => TRAVELER_MODES.includes(m));
      }
      if (experienceMode === 'local') {
        return v.experienceModes?.includes('local');
      }
      return true;
    })
    .slice(0, limit);
}

export function getTodayPick(vibes, experienceMode, companion) {
  let pool = [...vibes];
  if (experienceMode === 'traveler') {
    pool = pool.filter((v) => v.experienceModes?.some((m) => TRAVELER_MODES.includes(m)));
  } else if (experienceMode === 'local') {
    pool = pool.filter((v) => v.experienceModes?.includes('local'));
  }
  if (companion) {
    pool = pool.filter((v) => v.companionFit?.includes(companion));
  }
  return pool.find((v) => v.aiPick) ?? pool[0];
}

function hashCommentKey(id, suffix = '') {
  let h = 0;
  const str = id + suffix;
  for (let i = 0; i < str.length; i += 1) h = (h << 5) - h + str.charCodeAt(i);
  return Math.abs(h);
}

export function getVibeComment(vibe, { experienceMode = 'local', companion = 'solo', locale = 'ja' } = {}) {
  const modeKey = experienceMode === 'traveler' ? 'traveler' : 'local';
  const modeEntry = vibe.aiCommentByMode?.[modeKey] ?? vibe.aiCommentByMode?.local;
  const modeComment =
    typeof modeEntry === 'object' && modeEntry?.[locale]
      ? modeEntry[locale]
      : typeof modeEntry === 'string'
        ? modeEntry
        : vibe.aiComment;

  if (companion && companion !== 'solo') {
    const companionComments = COMPANION_COMMENTS[locale]?.[companion];
    if (companionComments?.length) {
      return companionComments[hashCommentKey(vibe.id, companion) % companionComments.length];
    }
  }

  return modeComment;
}

export function getVibeReason(vibe, experienceMode = 'local', locale = 'ja') {
  const key = experienceMode === 'traveler' ? 'traveler' : 'local';
  const reasons = vibe.aiReasonByMode;
  if (typeof reasons === 'object' && reasons[key]) {
    return locale === 'en' ? reasons[key].en : reasons[key].ja;
  }
  return locale === 'en' ? reasons?.en ?? '' : reasons?.ja ?? '';
}

export function getBestTime(vibe, locale = 'ja') {
  if (locale === 'en') return vibe.bestTimeEn ?? 'After 8 PM';
  return vibe.bestTimeJa ?? '20時以降';
}

export function getLocalTip(vibe, locale = 'ja') {
  if (locale === 'en') return vibe.localTipEn ?? 'Ask the staff for their recommendation.';
  return vibe.localTipJa ?? 'スタッフにおすすめを聞いてみて。';
}

export function scoreVibeForCompanion(vibe, companion) {
  const preferred = getCompanionCategories(companion);
  return preferred.includes(vibe.category) ? 1 : 0;
}
