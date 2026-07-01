import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const AREAS = [
  '恵比寿',
  '中目黒',
  '代官山',
  '広尾',
  '麻布十番',
  '六本木',
  '下北沢',
  '浅草',
  '神楽坂',
  '新宿',
  '渋谷',
];

export const CATEGORIES = ['wine', 'cafe', 'walk', 'nightlife', 'culture', 'food'];

const AREA_COORDINATES = {
  恵比寿: { lat: 35.6467, lng: 139.71 },
  中目黒: { lat: 35.644, lng: 139.6982 },
  代官山: { lat: 35.6487, lng: 139.7031 },
  広尾: { lat: 35.6517, lng: 139.7221 },
  麻布十番: { lat: 35.6561, lng: 139.7365 },
  六本木: { lat: 35.6628, lng: 139.7314 },
  下北沢: { lat: 35.6618, lng: 139.666 },
  浅草: { lat: 35.7148, lng: 139.7967 },
  神楽坂: { lat: 35.7022, lng: 139.7378 },
  新宿: { lat: 35.6938, lng: 139.7034 },
  渋谷: { lat: 35.6595, lng: 139.7004 },
};

const AREA_SLUGS = {
  恵比寿: 'ebisu',
  中目黒: 'nakame',
  代官山: 'daikanyama',
  広尾: 'hiroo',
  麻布十番: 'azabu',
  六本木: 'roppongi',
  下北沢: 'shimokita',
  浅草: 'asakusa',
  神楽坂: 'kagurazaka',
  新宿: 'shinjuku',
  渋谷: 'shibuya',
};

const AREA_SPOT_NAMES = {
  恵比寿: {
    wine: ['ナチュラルワインバー恵比寿', 'Bar Trench', 'ワインスタンドYEBISU'],
    cafe: ['猿田彦珈琲 恵比寿店', 'カフェ・ド・ランブル代官山', '恵比寿ガーデンカフェ'],
    walk: ['東京都写真美術館', '代官山ヒルサイドテラス', '恵比寿川沿い散歩'],
    nightlife: ['恵比寿横丁', 'ライブハウス恵比寿', 'クラフトビールバー恵比寿'],
    culture: ['恵比寿ガーデンプレイス', 'マイアミギャラリー', '東京都庭園美術館'],
    food: ['恵比寿焼肉街', 'つけ麺恵比寿', '立ち食い寿司恵比寿'],
  },
  中目黒: {
    wine: ['SAKE de VIN', '中目黒ワイン酒場', 'ナチュラルワイン中目黒'],
    cafe: ['Onibus Coffee', '蔦屋書店カフェ中目黒', 'ライトアップコーヒー'],
    walk: ['中目黒川沿い散歩', '桜並木プロムナード', '目黒川ネオン散歩'],
    nightlife: ['中目黒クロスポイント', '隠れバー中目黒', '深夜立ち飲み中目黒'],
    culture: ['中目黒アートギャラリー', '蔦屋書店 中目黒', '旧東京都庭園美術館'],
    food: ['中目黒焼き鳥横丁', '川沿いビストロ', '中目黒ラーメン'],
  },
  代官山: {
    wine: ['代官山ワインバー', 'ヒルサイドテラスワイン', '代官山ナチュラルワイン'],
    cafe: ['代官山カフェ カドヤ', 'スターバックス 代官山', '代官山ブックカフェ'],
    walk: ['代官山ヒルサイドテラス散歩', '代官山蔦屋書店周辺', '猿楽坂散策'],
    nightlife: ['代官山バー街', '隠れスピークイージー', '代官山深夜バー'],
    culture: ['代官山ヒルサイドテラス', '代官山アドレス', '蔦屋書店 代官山'],
    food: ['代官山フレンチビストロ', '代官山パン屋', '代官山イタリアン'],
  },
  広尾: {
    wine: ['広尾ワインバー', 'ナチュラルワイン広尾', '広尾サケバー'],
    cafe: ['広尾カフェテラス', 'ブルーボトル広尾', '広尾ブックカフェ'],
    walk: ['広尾駅前散歩', '恵比寿川広尾ルート', '広尾グリーンスペース'],
    nightlife: ['広尾バー街', '広尾隠れ家バー', '広尾深夜ラウンジ'],
    culture: ['国立科学博物館近辺', '広尾ギャラリー', 'アンティーク広尾'],
    food: ['広尾イタリアン', '広尾焼肉', '広尾エスニック食堂'],
  },
  麻布十番: {
    wine: ['麻布十番ワインバー', 'ナチュラルワイン麻布', '麻布サワーバー'],
    cafe: ['麻布十番カフェ', '十番カフェテラス', '麻布モーニングカフェ'],
    walk: ['麻布十番商店街散歩', '十番坂ネオン散策', '麻布台ヒルズ周辺'],
    nightlife: ['麻布十番バー街', '麻布十番横丁', '深夜バー麻布'],
    culture: ['麻布台ヒルズ', '麻布ギャラリー', '三縁山神社周辺'],
    food: ['麻布十番そば', '麻布十番焼き鳥', '麻布十番つけ麺'],
  },
  六本木: {
    wine: ['六本木ワインバー', '六本木ナチュラルワイン', '六本木ルーフトップバー'],
    cafe: ['六本木カフェテラス', 'ブルーボトル六本木', '六本木ブックカフェ'],
    walk: ['六本木ヒルズ散歩', 'けやき坂ネオン散策', '六本木通りウォーク'],
    nightlife: ['六本木クラブ街', '六本木バー街', '六本木深夜ラウンジ'],
    culture: ['森美術館', '国立新美術館', '六本木ヒルズ展望'],
    food: ['六本木焼肉', '六本木ラーメン', '六本木寿司バー'],
  },
  下北沢: {
    wine: ['下北沢ナチュラルワイン食堂', '下北ワインバー', '下北沢サケバー'],
    cafe: ['ボンギブレーカー', '下北沢古着カフェ', '下北コーヒースタンド'],
    walk: ['下北沢古着街散歩', 'ボーイ通り散策', '下北沢ライブ街散歩'],
    nightlife: ['下北沢ライブバー', 'クラフトビールバー下北', '下北深夜バー'],
    culture: ['下北沢シアター', '下北沢レコードショップ', '下北沢ギャラリー'],
    food: ['下北沢カレー', '下北沢焼き鳥', '下北沢ラーメン横丁'],
  },
  浅草: {
    wine: ['浅草ワイン横丁', '浅草ナチュラルワイン', '浅草サケバー'],
    cafe: ['浅草和カフェ', 'カフェ・ド・ランブル浅草', '浅草茶屋'],
    walk: ['浅草寺参道', '隅田川遊歩道', '仲見世通り散歩'],
    nightlife: ['浅草ホッピー通り', '仲見世横丁', '浅草深夜居酒屋'],
    culture: ['浅草寺', '浅草演芸ホール', '東京スカイツリー展望'],
    food: ['浅草天ぷら', '浅草もんじゃ', '浅草焼き鳥横丁'],
  },
  神楽坂: {
    wine: ['神楽坂ワインバー', '神楽坂日本酒バー', '神楽坂ナチュラルワイン'],
    cafe: ['神楽坂カフェ', '神楽坂茶房', '神楽坂ブックカフェ'],
    walk: ['神楽坂坂道散歩', '石畳路地裏散策', '神楽坂ネオン散歩'],
    nightlife: ['神楽坂バー街', '神楽坂隠れ居酒屋', '神楽坂深夜バー'],
    culture: ['善國寺周辺', '神楽坂能楽堂', '神楽坂ギャラリー'],
    food: ['神楽坂そば', '神楽坂懐石', '神楽坂焼き鳥'],
  },
  新宿: {
    wine: ['新宿ワインバー', '新宿ナチュラルワイン', 'ゴールデン街ワインバー'],
    cafe: ['新宿カフェテラス', 'ブルーボトル新宿', '新宿ブックカフェ'],
    walk: ['新宿御苑散歩', '歌舞伎町ネオン散策', '新宿ゴールデン街散歩'],
    nightlife: ['新宿ゴールデン街', '歌舞伎町バー', '新宿深夜ラウンジ'],
    culture: ['新宿御苑', '東京都庁展望', '新宿ギャラリー'],
    food: ['思い出横丁', '新宿ラーメン', '新宿焼き鳥横丁'],
  },
  渋谷: {
    wine: ['渋谷ナチュラルワインバー', '渋谷ワインスタンド', '渋谷ルーフトップバー'],
    cafe: ['Fuglen Tokyo', '渋谷パンカフェ', '渋谷ブックカフェ'],
    walk: ['宮下公園', '神南坂散歩', '渋谷スクランブル散策'],
    nightlife: ['渋谷横丁', 'NONBEI坂', '渋谷深夜クラブ'],
    culture: ['渋谷スクランブル', '渋谷ギャラリー', '渋谷ストリーム'],
    food: ['渋谷ラーメン', '渋谷焼肉', '渋谷立ち食い寿司'],
  },
};

const EXTRA_SPOTS = [
  { area: '渋谷', category: 'culture', name: '渋谷PARCOアートフロア' },
  { area: '新宿', category: 'food', name: '新宿深夜カレー' },
];

const DURATION_BY_CATEGORY = {
  wine: 90,
  cafe: 50,
  walk: 45,
  nightlife: 80,
  culture: 60,
  food: 60,
};

const DESCRIPTION_BY_CATEGORY = {
  wine: (area, name) => `${area}でしっぽり楽しめるワインスポット。${name}。`,
  cafe: (area, name) => `${area}で一息つけるカフェ。${name}。`,
  walk: (area, name) => `${area}の空気を感じる散歩ルート。${name}。`,
  nightlife: (area, name) => `${area}の夜を楽しむスポット。${name}。`,
  culture: (area, name) => `${area}で文化・芸術を味わえる場所。${name}。`,
  food: (area, name) => `${area}のローカルフード体験。${name}。`,
};

function getOffset(index) {
  const row = Math.floor(index / 6);
  const col = index % 6;
  return {
    lat: row * 0.0007 - 0.0018 + (col % 3) * 0.00025,
    lng: col * 0.0006 - 0.0015 + (row % 3) * 0.0003,
  };
}

function buildRawSpots() {
  const rawSpots = [];

  for (const area of AREAS) {
    let areaIndex = 0;

    for (const category of CATEGORIES) {
      for (const [index, name] of AREA_SPOT_NAMES[area][category].entries()) {
        rawSpots.push({
          id: `${AREA_SLUGS[area]}-${category}-${String(index + 1).padStart(2, '0')}`,
          name,
          area,
          category,
          description: DESCRIPTION_BY_CATEGORY[category](area, name),
          duration: DURATION_BY_CATEGORY[category],
          _offsetIndex: areaIndex,
        });
        areaIndex += 1;
      }
    }
  }

  for (const [index, spot] of EXTRA_SPOTS.entries()) {
    rawSpots.push({
      id: `extra-${String(index + 1).padStart(2, '0')}`,
      name: spot.name,
      area: spot.area,
      category: spot.category,
      description: DESCRIPTION_BY_CATEGORY[spot.category](spot.area, spot.name),
      duration: DURATION_BY_CATEGORY[spot.category],
      _offsetIndex: index,
    });
  }

  return rawSpots;
}

const rawSpots = buildRawSpots();
const areaCounters = {};

const spots = rawSpots.map((spot) => {
  const base = AREA_COORDINATES[spot.area];
  const index = areaCounters[spot.area] ?? 0;
  areaCounters[spot.area] = index + 1;
  const offset = getOffset(spot._offsetIndex ?? index);

  const { _offsetIndex, ...cleanSpot } = spot;

  return {
    ...cleanSpot,
    lat: base.lat + offset.lat,
    lng: base.lng + offset.lng,
  };
});

const fileContent = `export const AREAS = ${JSON.stringify(AREAS, null, 2)};

export const CATEGORIES = ${JSON.stringify(CATEGORIES, null, 2)};

export const AREA_COORDINATES = ${JSON.stringify(AREA_COORDINATES, null, 2)};

const rawSpots = ${JSON.stringify(
  rawSpots.map(({ _offsetIndex, ...spot }) => spot),
  null,
  2
)};

function getOffset(index) {
  const row = Math.floor(index / 6);
  const col = index % 6;
  return {
    lat: row * 0.0007 - 0.0018 + (col % 3) * 0.00025,
    lng: col * 0.0006 - 0.0015 + (row % 3) * 0.0003,
  };
}

const areaCounters = {};

export const spots = rawSpots.map((spot, globalIndex) => {
  const base = AREA_COORDINATES[spot.area];
  const index = areaCounters[spot.area] ?? 0;
  areaCounters[spot.area] = index + 1;
  const offset = getOffset(index);

  return {
    ...spot,
    lat: base.lat + offset.lat,
    lng: base.lng + offset.lng,
  };
});
`;

writeFileSync(path.resolve(__dirname, '../src/data/spots.js'), fileContent, 'utf8');
console.log(`Generated ${spots.length} spots`);
