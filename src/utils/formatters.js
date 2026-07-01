const FREE_TIME_LABELS = {
  ja: {
    '30分': '30分',
    '1時間': '1時間',
    '2時間': '2時間',
    '終電まで': '終電まで',
    '半日': '半日',
  },
  en: {
    '30分': '30 min',
    '1時間': '1 hour',
    '2時間': '2 hours',
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
