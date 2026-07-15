/** Event catalog — replace with CMS/API feed in production */

export const EVENTS_CATALOG = [
  {
    id: 'sumida-fireworks',
    titleJa: '隅田川花火大会',
    titleEn: 'Sumida River Fireworks',
    type: 'fireworks',
    area: '浅草',
    lat: 35.7106,
    lng: 139.8015,
    month: 7,
    day: 26,
    durationDays: 1,
    descriptionJa: '東京夏の風物詩。浅草・墨田周辺が一晩で賑わいます。',
    descriptionEn: 'Tokyo summer classic — Asakusa and Sumida come alive.',
  },
  {
    id: 'teamLab-borderless',
    titleJa: 'チームラボ ボーダレス',
    titleEn: 'teamLab Borderless',
    type: 'exhibition',
    area: '麻布台',
    lat: 35.662,
    lng: 139.74,
    month: 1,
    day: 1,
    durationDays: 365,
    descriptionJa: '没入型デジタルアート。雨の日にも最適。',
    descriptionEn: 'Immersive digital art — perfect on rainy days.',
  },
  {
    id: 'cherry-blossom',
    titleJa: '桜シーズン',
    titleEn: 'Cherry Blossom Season',
    type: 'seasonal',
    area: '目黒',
    lat: 35.633,
    lng: 139.715,
    month: 3,
    day: 20,
    durationDays: 25,
    descriptionJa: '目黒川など花見スポットが人気。',
    descriptionEn: 'Meguro River and parks are peak hanami spots.',
  },
  {
    id: 'summer-festival',
    titleJa: '浅草サンバカーニバル',
    titleEn: 'Asakusa Samba Carnival',
    type: 'festival',
    area: '浅草',
    lat: 35.7118,
    lng: 139.7967,
    month: 8,
    day: 24,
    durationDays: 1,
    descriptionJa: '夏の浅草を彩るカーニバルパレード。',
    descriptionEn: 'Vibrant samba parade through Asakusa.',
  },
  {
    id: 'roppongi-illumination',
    titleJa: '六本木ヒルズ イルミネーション',
    titleEn: 'Roppongi Hills Illumination',
    type: 'seasonal',
    area: '六本木',
    lat: 35.6604,
    lng: 139.729,
    month: 11,
    day: 1,
    durationDays: 90,
    descriptionJa: '冬の東京を彩る光の演出。',
    descriptionEn: 'Winter lights across Roppongi Hills.',
  },
  {
    id: 'shibuya-popup',
    titleJa: '渋谷ポップアップマーケット',
    titleEn: 'Shibuya Pop-up Market',
    type: 'popup',
    area: '渋谷',
    lat: 35.6595,
    lng: 139.7004,
    month: 7,
    day: 1,
    durationDays: 14,
    descriptionJa: '期間限定のクラフト＆ストリートフード。',
    descriptionEn: 'Limited-time craft and street food market.',
  },
  {
    id: 'ueno-culture',
    titleJa: '上野公園 文化の日イベント',
    titleEn: 'Ueno Park Culture Day',
    type: 'culture',
    area: '上野',
    lat: 35.7148,
    lng: 139.7734,
    month: 11,
    day: 3,
    durationDays: 1,
    descriptionJa: '博物館・公園での特別プログラム。',
    descriptionEn: 'Special programs at museums and the park.',
  },
];

function isEventActive(event, date) {
  const month = date.getMonth() + 1;
  const day = date.getDate();
  if (event.month !== month) return false;
  const start = event.day;
  const end = event.day + (event.durationDays ?? 1) - 1;
  return day >= start && day <= end;
}

function isEventThisWeek(event, date) {
  const startOfWeek = new Date(date);
  startOfWeek.setDate(date.getDate() - date.getDay());
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);

  for (let d = new Date(startOfWeek); d <= endOfWeek; d.setDate(d.getDate() + 1)) {
    if (isEventActive(event, d)) return true;
  }
  return false;
}

function toEventDTO(event, timing, date) {
  const year = date.getFullYear();
  const startDate = `${year}-${String(event.month).padStart(2, '0')}-${String(event.day).padStart(2, '0')}`;
  const endDay = event.day + (event.durationDays ?? 1) - 1;
  const endDate = `${year}-${String(event.month).padStart(2, '0')}-${String(endDay).padStart(2, '0')}`;

  return {
    id: event.id,
    titleJa: event.titleJa,
    titleEn: event.titleEn,
    type: event.type,
    timing,
    area: event.area,
    lat: event.lat,
    lng: event.lng,
    descriptionJa: event.descriptionJa,
    descriptionEn: event.descriptionEn,
    startDate,
    endDate: event.durationDays > 1 ? endDate : startDate,
  };
}

export function getEventsForDate(date = new Date()) {
  const today = EVENTS_CATALOG.filter((e) => isEventActive(e, date)).map((e) =>
    toEventDTO(e, 'today', date),
  );

  const thisWeek = EVENTS_CATALOG.filter(
    (e) => isEventThisWeek(e, date) && !isEventActive(e, date),
  ).map((e) => toEventDTO(e, 'this_week', date));

  const limited = EVENTS_CATALOG.filter(
    (e) => (e.durationDays ?? 1) <= 14 && (isEventActive(e, date) || isEventThisWeek(e, date)),
  ).map((e) => toEventDTO(e, 'limited', date));

  return {
    today,
    thisWeek,
    limited,
    all: [...today, ...thisWeek.filter((w) => !today.find((t) => t.id === w.id))],
  };
}

export function getEventsToday(date = new Date()) {
  return getEventsForDate(date).today;
}
