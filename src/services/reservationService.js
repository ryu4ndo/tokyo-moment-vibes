/**
 * Multi-platform reservation deep links for Tokyo spots.
 * Picks the best platform per category / experience mode.
 */

const PLATFORMS = {
  tabelog: {
    id: 'tabelog',
    labelJa: '食べログ',
    labelEn: 'Tabelog',
    icon: '🍽',
    buildUrl: (name, area) =>
      `https://tabelog.com/rstLst/?sk=${encodeURIComponent(`${name} ${area}`)}`,
  },
  hotpepper: {
    id: 'hotpepper',
    labelJa: 'ホットペッパー',
    labelEn: 'Hot Pepper',
    icon: '🌶',
    buildUrl: (name, area) =>
      `https://www.hotpepper.jp/strJ1010/?key=${encodeURIComponent(`${name} ${area}`)}`,
  },
  tablecheck: {
    id: 'tablecheck',
    labelJa: 'TableCheck',
    labelEn: 'TableCheck',
    icon: '📅',
    buildUrl: (name, area) =>
      `https://www.tablecheck.com/en/shops/search?q=${encodeURIComponent(`${name} ${area} Tokyo`)}`,
  },
  opentable: {
    id: 'opentable',
    labelJa: 'OpenTable',
    labelEn: 'OpenTable',
    icon: '🍷',
    buildUrl: (name, area) =>
      `https://www.opentable.com/s?covers=2&dateTime=${new Date().toISOString().slice(0, 10)}T19:00&term=${encodeURIComponent(`${name} ${area} Tokyo`)}`,
  },
};

const CATEGORY_PLATFORMS = {
  food: ['tabelog', 'hotpepper', 'tablecheck'],
  wine: ['tabelog', 'opentable', 'tablecheck'],
  nightlife: ['tabelog', 'hotpepper'],
  bar: ['tabelog', 'opentable'],
  cafe: ['tabelog', 'tablecheck'],
  default: ['tabelog', 'google'],
};

export function getReservationLinks(spot, { experienceMode = 'local', locale = 'ja' } = {}) {
  if (!spot) return [];
  const name = spot.name ?? spot.shopName ?? '';
  const area = spot.area ?? '東京';
  const category = spot.category ?? 'food';

  let platformIds = CATEGORY_PLATFORMS[category] ?? CATEGORY_PLATFORMS.default;
  if (experienceMode === 'traveler') {
    platformIds = ['opentable', 'tablecheck', 'tabelog', 'hotpepper'];
  }

  const links = platformIds
    .filter((id) => PLATFORMS[id])
    .map((id) => {
      const p = PLATFORMS[id];
      return {
        id,
        label: locale === 'en' ? p.labelEn : p.labelJa,
        icon: p.icon,
        url: p.buildUrl(name, area),
      };
    });

  if (spot.googleMapsUrl) {
    links.push({
      id: 'google',
      label: locale === 'en' ? 'Google Maps' : 'Googleマップ',
      icon: '📍',
      url: spot.googleMapsUrl,
    });
  } else {
    links.push({
      id: 'google',
      label: locale === 'en' ? 'Google Maps' : 'Googleマップ',
      icon: '📍',
      url: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${name} ${area} Tokyo`)}`,
    });
  }

  return links;
}

export function getPrimaryReservationUrl(spot, options) {
  const links = getReservationLinks(spot, options);
  return links[0]?.url ?? null;
}
