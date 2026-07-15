const FREE_TIME_LABELS = {
  ja: {
    '30分': '30分',
    '1時間': '1時間',
    '2時間': '2時間',
    '3時間': '3時間',
    '終電まで': '終電まで',
    '半日': '半日',
  },
  en: {
    '30分': '30 min',
    '1時間': '1 hour',
    '2時間': '2 hours',
    '3時間': '3 hours',
    '終電まで': 'Until last train',
    '半日': 'Half day',
  },
};

const NEXT_PLAN_LABELS = {
  ja: {
    'ホテルへ': 'ホテルへ',
    '空港へ': '空港へ',
    'ディナー予約': 'ディナー予約',
    '予定なし': '予定なし',
  },
  en: {
    'ホテルへ': 'Back to hotel',
    '空港へ': 'To the airport',
    'ディナー予約': 'Dinner reservation',
    '予定なし': 'No plans after',
  },
};

export function formatFreeTime(value, locale = 'ja') {
  return FREE_TIME_LABELS[locale]?.[value] ?? value;
}

export function formatNextPlan(value, locale = 'ja') {
  return NEXT_PLAN_LABELS[locale]?.[value] ?? value;
}

export function getFreeTimeOptions(locale = 'ja') {
  return Object.entries(FREE_TIME_LABELS.ja).map(([value]) => ({
    value,
    label: FREE_TIME_LABELS[locale][value],
  }));
}

export function getNextPlanOptions(locale = 'ja') {
  return Object.entries(NEXT_PLAN_LABELS.ja).map(([value]) => ({
    value,
    label: NEXT_PLAN_LABELS[locale][value],
  }));
}

export const PLAN_PURPOSE_OPTIONS = [
  { value: 'food', labelJa: '食事', labelEn: 'Dining' },
  { value: 'sightseeing', labelJa: '観光', labelEn: 'Sightseeing' },
  { value: 'date', labelJa: 'デート', labelEn: 'Date' },
  { value: 'cafe', labelJa: 'カフェ', labelEn: 'Cafe' },
  { value: 'nightlife', labelJa: '夜遊び', labelEn: 'Nightlife' },
  { value: 'walk', labelJa: '散策', labelEn: 'Stroll' },
];

export const PLAN_BUDGET_OPTIONS = [
  { value: 'all', labelJa: '指定なし', labelEn: 'Any budget' },
  { value: '¥', labelJa: '¥', labelEn: '¥' },
  { value: '¥¥', labelJa: '¥¥', labelEn: '¥¥' },
  { value: '¥¥¥', labelJa: '¥¥¥', labelEn: '¥¥¥' },
];

export const PLAN_PARTY_OPTIONS = [
  { value: '1', labelJa: '1人', labelEn: '1 person' },
  { value: '2', labelJa: '2人', labelEn: '2 people' },
  { value: '3-4', labelJa: '3〜4人', labelEn: '3–4 people' },
  { value: '5+', labelJa: '5人以上', labelEn: '5+ people' },
];

export function getPlanPurposeOptions(locale = 'ja') {
  return PLAN_PURPOSE_OPTIONS.map((o) => ({
    value: o.value,
    label: locale === 'en' ? o.labelEn : o.labelJa,
  }));
}

export function getPlanBudgetOptions(locale = 'ja') {
  return PLAN_BUDGET_OPTIONS.map((o) => ({
    value: o.value,
    label: locale === 'en' ? o.labelEn : o.labelJa,
  }));
}

export function getPlanPartyOptions(locale = 'ja') {
  return PLAN_PARTY_OPTIONS.map((o) => ({
    value: o.value,
    label: locale === 'en' ? o.labelEn : o.labelJa,
  }));
}
