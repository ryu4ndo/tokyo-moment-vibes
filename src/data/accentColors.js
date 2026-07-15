/** Accent colors by category / content — gradients on accents only, black base */

export const CATEGORY_ACCENTS = {
  food: {
    gradient: 'from-orange-500 to-amber-500',
    border: 'border-orange-500/25',
    text: 'text-orange-300',
    bg: 'bg-orange-500/10',
    dot: 'bg-orange-400',
    glow: 'shadow-[0_0_20px_rgba(249,115,22,0.25)]',
  },
  cafe: {
    gradient: 'from-amber-700 to-amber-500',
    border: 'border-amber-600/25',
    text: 'text-amber-300',
    bg: 'bg-amber-700/10',
    dot: 'bg-amber-600',
    glow: 'shadow-[0_0_20px_rgba(180,83,9,0.2)]',
  },
  chill: {
    gradient: 'from-amber-700 to-amber-500',
    border: 'border-amber-600/25',
    text: 'text-amber-300',
    bg: 'bg-amber-700/10',
    dot: 'bg-amber-600',
    glow: '',
  },
  bar: {
    gradient: 'from-purple-600 to-violet-500',
    border: 'border-purple-500/25',
    text: 'text-purple-300',
    bg: 'bg-purple-500/10',
    dot: 'bg-purple-400',
    glow: 'shadow-[0_0_20px_rgba(168,85,247,0.25)]',
  },
  music: {
    gradient: 'from-purple-600 to-violet-500',
    border: 'border-purple-500/25',
    text: 'text-purple-300',
    bg: 'bg-purple-500/10',
    dot: 'bg-purple-400',
    glow: '',
  },
  nightview: {
    gradient: 'from-indigo-600 to-blue-500',
    border: 'border-blue-500/25',
    text: 'text-blue-300',
    bg: 'bg-blue-500/10',
    dot: 'bg-blue-400',
    glow: 'shadow-[0_0_20px_rgba(59,130,246,0.25)]',
  },
  rooftop: {
    gradient: 'from-indigo-600 to-blue-500',
    border: 'border-blue-500/25',
    text: 'text-blue-300',
    bg: 'bg-blue-500/10',
    dot: 'bg-blue-400',
    glow: '',
  },
  walk: {
    gradient: 'from-emerald-500 to-green-400',
    border: 'border-emerald-500/25',
    text: 'text-emerald-300',
    bg: 'bg-emerald-500/10',
    dot: 'bg-emerald-400',
    glow: '',
  },
  culture: {
    gradient: 'from-emerald-500 to-teal-400',
    border: 'border-emerald-500/25',
    text: 'text-emerald-300',
    bg: 'bg-emerald-500/10',
    dot: 'bg-emerald-400',
    glow: '',
  },
  date: {
    gradient: 'from-pink-500 to-rose-400',
    border: 'border-pink-500/25',
    text: 'text-pink-300',
    bg: 'bg-pink-500/10',
    dot: 'bg-pink-400',
    glow: '',
  },
  luxury: {
    gradient: 'from-yellow-500 to-amber-400',
    border: 'border-yellow-500/25',
    text: 'text-yellow-200',
    bg: 'bg-yellow-500/10',
    dot: 'bg-yellow-400',
    glow: 'shadow-[0_0_20px_rgba(234,179,8,0.2)]',
  },
  ai: {
    gradient: 'from-purple-500 to-blue-500',
    border: 'border-purple-500/20',
    text: 'text-purple-200',
    bg: 'bg-gradient-to-br from-purple-500/10 to-blue-500/10',
    dot: 'bg-gradient-to-r from-purple-400 to-blue-400',
    glow: 'shadow-[0_0_24px_rgba(139,92,246,0.15)]',
  },
  default: {
    gradient: 'from-white/20 to-white/10',
    border: 'border-white/10',
    text: 'text-white/70',
    bg: 'bg-white/[0.04]',
    dot: 'bg-white/40',
    glow: '',
  },
};

export const INSIGHT_ACCENTS = {
  night: 'bar',
  cafe: 'cafe',
  local: 'culture',
  walk: 'walk',
  budget: 'food',
  date: 'date',
  area: 'nightview',
  'trend-nightview': 'nightview',
  learning: 'ai',
  nightlife: 'bar',
  izakaya: 'food',
  nightview: 'nightview',
  travel: 'nightview',
  foodwalk: 'food',
  culture: 'culture',
  premium: 'luxury',
};

export function getCategoryAccent(category) {
  return CATEGORY_ACCENTS[category] ?? CATEGORY_ACCENTS.default;
}

export function getInsightAccent(insightId) {
  const key = INSIGHT_ACCENTS[insightId] ?? 'default';
  return CATEGORY_ACCENTS[key] ?? CATEGORY_ACCENTS.default;
}

export function getInterestAccent(interestId) {
  return getInsightAccent(interestId);
}
