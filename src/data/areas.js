/** Tokyo area registry — internal id (JA) + English label + coordinates */
export const TOKYO_AREAS = [
  { id: '渋谷', en: 'Shibuya', lat: 35.6595, lng: 139.7004 },
  { id: '新宿', en: 'Shinjuku', lat: 35.6938, lng: 139.7034 },
  { id: '原宿', en: 'Harajuku', lat: 35.6702, lng: 139.7027 },
  { id: '浅草', en: 'Asakusa', lat: 35.7148, lng: 139.7967 },
  { id: '上野', en: 'Ueno', lat: 35.7141, lng: 139.7774 },
  { id: '秋葉原', en: 'Akihabara', lat: 35.6984, lng: 139.7731 },
  { id: '東京駅', en: 'Tokyo Station', lat: 35.6812, lng: 139.7671 },
  { id: '六本木', en: 'Roppongi', lat: 35.6628, lng: 139.7314 },
  { id: '恵比寿', en: 'Ebisu', lat: 35.6467, lng: 139.71 },
  { id: '中目黒', en: 'Nakameguro', lat: 35.644, lng: 139.6982 },
  { id: '下北沢', en: 'Shimokitazawa', lat: 35.6618, lng: 139.666 },
  { id: '吉祥寺', en: 'Kichijoji', lat: 35.7031, lng: 139.5798 },
  { id: '代官山', en: 'Daikanyama', lat: 35.6487, lng: 139.7031 },
  { id: '銀座', en: 'Ginza', lat: 35.6717, lng: 139.7649 },
  { id: 'お台場', en: 'Odaiba', lat: 35.6264, lng: 139.7756 },
  { id: '築地', en: 'Tsukiji', lat: 35.6654, lng: 139.7707 },
  { id: '東京タワー', en: 'Tokyo Tower', lat: 35.6586, lng: 139.7454 },
  { id: 'スカイツリー', en: 'Tokyo Skytree', lat: 35.7101, lng: 139.8107 },
  { id: 'ディズニーリゾート', en: 'Tokyo Disney Resort', lat: 35.6329, lng: 139.8804 },
  { id: '広尾', en: 'Hiroo', lat: 35.6517, lng: 139.7221 },
  { id: '麻布十番', en: 'Azabu-Juban', lat: 35.6561, lng: 139.7365 },
  { id: '神楽坂', en: 'Kagurazaka', lat: 35.7022, lng: 139.7378 },
];

export const AREAS = TOKYO_AREAS.map((a) => a.id);

export const AREA_COORDINATES = Object.fromEntries(
  TOKYO_AREAS.map((a) => [a.id, { lat: a.lat, lng: a.lng }])
);

const areaById = new Map(TOKYO_AREAS.map((a) => [a.id, a]));

export function getAreaLabel(areaId, locale = 'ja') {
  const area = areaById.get(areaId);
  if (!area) return areaId;
  return locale === 'en' ? area.en : area.id;
}

export function getAreaOptions(locale = 'ja') {
  return TOKYO_AREAS.map((a) => ({
    value: a.id,
    label: locale === 'en' ? a.en : a.id,
  }));
}

export function findNearestArea(lat, lng) {
  let nearest = TOKYO_AREAS[0];
  let minDist = Infinity;
  for (const area of TOKYO_AREAS) {
    const d = (area.lat - lat) ** 2 + (area.lng - lng) ** 2;
    if (d < minDist) {
      minDist = d;
      nearest = area;
    }
  }
  return nearest.id;
}

/** Map new area to closest area that has spot data */
const SPOT_AREAS = new Set([
  '恵比寿', '中目黒', '代官山', '広尾', '麻布十番', '六本木', '下北沢', '浅草', '神楽坂', '新宿', '渋谷',
]);

export function getSpotAreaForLocation(areaId) {
  if (SPOT_AREAS.has(areaId)) return areaId;
  const target = areaById.get(areaId);
  if (!target) return '渋谷';
  let nearest = '渋谷';
  let minDist = Infinity;
  for (const spotArea of SPOT_AREAS) {
    const coords = AREA_COORDINATES[spotArea];
    if (!coords) continue;
    const d = (coords.lat - target.lat) ** 2 + (coords.lng - target.lng) ** 2;
    if (d < minDist) {
      minDist = d;
      nearest = spotArea;
    }
  }
  return nearest;
}
