import { formatFreeTime } from './formatters';
import { getMoodLabel } from '@/data/moods';

const CATEGORY_IMAGES = {
  wine: 'https://images.unsplash.com/photo-1510812431400-5740424cf0ef?w=800&q=80&auto=format&fit=crop',
  cafe: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&q=80&auto=format&fit=crop',
  food: 'https://images.unsplash.com/photo-1553621042-f6e147245754?w=800&q=80&auto=format&fit=crop',
  nightlife: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=800&q=80&auto=format&fit=crop',
  walk: 'https://images.unsplash.com/photo-1542051841857-5f90071e7989?w=800&q=80&auto=format&fit=crop',
  culture: 'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=800&q=80&auto=format&fit=crop',
};

const OPENING_HOURS = {
  wine: '17:00 – 24:00',
  cafe: '08:00 – 20:00',
  food: '11:30 – 22:00',
  nightlife: '18:00 – 02:00',
  walk: '24時間',
  culture: '10:00 – 18:00',
};

function hashCode(value) {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

export function getSpotImage(spot) {
  const base = CATEGORY_IMAGES[spot.category] ?? CATEGORY_IMAGES.food;
  const variant = hashCode(spot.id) % 3;
  return `${base}&sig=${variant}`;
}

export function getSpotRating(spot) {
  const base = 4.1 + (hashCode(spot.id) % 8) / 10;
  return base.toFixed(1);
}

export function getOpeningHours(spot) {
  return OPENING_HOURS[spot.category] ?? '11:00 – 21:00';
}

export function getSpotAddress(spot) {
  return `東京都${spot.area}エリア`;
}

export function getWalkMinutes(from, to) {
  if (!from?.lat || !to?.lat) return 8;
  const latDiff = Math.abs(from.lat - to.lat);
  const lngDiff = Math.abs(from.lng - to.lng);
  const distanceKm = Math.sqrt(latDiff ** 2 + lngDiff ** 2) * 111;
  return Math.max(3, Math.min(20, Math.round(distanceKm / 0.08)));
}

export function getPlanReason(plan, mood, { experienceMode = 'local', companion = 'solo', locale = 'ja' } = {}) {
  const area = plan.spots?.[0]?.area ?? '';
  const moodShort = mood?.replace(/^.\s*/, '') ?? (locale === 'en' ? 'tonight' : '今夜');

  if (locale === 'en') {
    const modeText = experienceMode === 'traveler'
      ? 'visitor-friendly picks'
      : 'local hidden gems';
    const companionText = {
      solo: 'solo-friendly',
      couple: 'perfect for couples',
      friends: 'great with friends',
      family: 'family-friendly',
      business: 'quiet enough for business',
      backpacker: 'budget-friendly',
    }[companion] ?? '';
    return `${moodShort} mood · ${modeText} in ${area}. ${companionText}.`;
  }

  const modeText = experienceMode === 'traveler' ? '旅行者向け' : '地元の穴場';
  const companionText = {
    solo: '一人でも入りやすい',
    couple: 'デート向き',
    friends: '友達と盛り上がる',
    family: '家族でも安心',
    business: '落ち着いて話せる',
    backpacker: 'コスパ良し',
  }[companion] ?? '';
  return `${moodShort}にぴったりの${area}エリア。${modeText}・${companionText}。`;
}

export function getPlanHeroImage(plan) {
  const spot = plan.spots?.[0];
  return spot ? getSpotImage(spot) : CATEGORY_IMAGES.walk;
}

export function getTotalWalkMinutes(spots = []) {
  if (spots.length < 2) return 0;
  let total = 0;
  for (let i = 1; i < spots.length; i += 1) {
    total += getWalkMinutes(spots[i - 1], spots[i]);
  }
  return total;
}

export function buildSpotMapUrl(spot) {
  if (!spot?.lat || !spot?.lng) return null;
  return `https://maps.google.com/maps?q=${spot.lat},${spot.lng}&hl=ja&z=16&output=embed`;
}

export function getWhyPlanSummary({
  location,
  freeTime,
  mood,
  experienceMode = 'local',
  companion = 'solo',
  locale = 'ja',
}) {
  const modeLabel =
    experienceMode === 'traveler'
      ? locale === 'en' ? 'Traveler' : 'トラベラー'
      : locale === 'en' ? 'Local' : 'ローカル';

  const companionLabel = {
    ja: {
      solo: '一人', couple: 'カップル', friends: '友達',
      family: '家族', business: 'ビジネス', backpacker: 'バックパッカー',
    },
    en: {
      solo: 'Solo', couple: 'Couple', friends: 'Friends',
      family: 'Family', business: 'Business', backpacker: 'Backpacker',
    },
  }[locale]?.[companion] ?? companion;

  const moodLabel = getMoodLabel(mood, locale).replace(/^.\s*/, '');
  const timeLabel = formatFreeTime(freeTime, locale);

  const factors = [modeLabel, companionLabel, moodLabel, location, timeLabel];

  const explanation =
    locale === 'en'
      ? experienceMode === 'traveler'
        ? `AI built a route focused on authentic nightlife while avoiding crowded tourist areas — tailored for ${companionLabel.toLowerCase()} exploring ${location}.`
        : `AI curated hidden local favorites in ${location} — the kind of spots guidebooks miss, perfect for a ${moodLabel.toLowerCase()} mood.`
      : experienceMode === 'traveler'
        ? `${location}で観光地を避けた本物のナイトライフを中心に、${companionLabel}向けのルートを組みました。`
        : `${location}のガイドブックに載らない穴場を、「${moodLabel}」のムードに合わせて厳選しました。`;

  return { factors, explanation };
}
