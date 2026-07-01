export const MOODS = [
  {
    id: 'midnight',
    labelJa: '🌃 深夜東京を感じたい',
    labelEn: '🌃 Late Night Tokyo',
    short: '深夜東京',
    color: '#f0abfc',
    gradient: 'from-purple-500/30 to-pink-500/20',
  },
  {
    id: 'wine',
    labelJa: '🍷 しっぽり飲みたい',
    labelEn: '🍷 Slow Drinks',
    short: 'しっぽり',
    color: '#fdba74',
    gradient: 'from-orange-500/30 to-pink-500/20',
  },
  {
    id: 'calm',
    labelJa: '☕ 一人で落ち着きたい',
    labelEn: '☕ Quiet Solo Time',
    short: '落ち着き',
    color: '#67e8f9',
    gradient: 'from-cyan-500/30 to-blue-500/20',
  },
  {
    id: 'rain',
    labelJa: '🚶 雨の夜を歩きたい',
    labelEn: '🚶 Rainy Night Walk',
    short: '雨の夜',
    color: '#86efac',
    gradient: 'from-emerald-500/30 to-cyan-500/20',
  },
  {
    id: 'local',
    labelJa: '✨ ローカル東京を感じたい',
    labelEn: '✨ Local Tokyo Vibes',
    short: 'ローカル',
    color: '#c4b5fd',
    gradient: 'from-violet-500/30 to-fuchsia-500/20',
  },
];

export const DEFAULT_MOOD = MOODS[0].labelJa;

export function getMoodByLabel(label) {
  return MOODS.find((m) => m.labelJa === label || m.labelEn === label);
}

export function getMoodLabel(moodKey, locale = 'ja') {
  const mood = getMoodByLabel(moodKey) ?? MOODS[0];
  return locale === 'en' ? mood.labelEn : mood.labelJa;
}
