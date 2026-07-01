import { AREA_COORDINATES } from './areas.js';

export { AREAS, AREA_COORDINATES, getAreaLabel, getSpotAreaForLocation } from './areas.js';

export const CATEGORIES = [
  "wine",
  "cafe",
  "walk",
  "nightlife",
  "culture",
  "food"
];

const rawSpots = [
  {
    "id": "ebisu-wine-01",
    "name": "ナチュラルワインバー恵比寿",
    "area": "恵比寿",
    "category": "wine",
    "description": "恵比寿でしっぽり楽しめるワインスポット。ナチュラルワインバー恵比寿。",
    "duration": 90
  },
  {
    "id": "ebisu-wine-02",
    "name": "Bar Trench",
    "area": "恵比寿",
    "category": "wine",
    "description": "恵比寿でしっぽり楽しめるワインスポット。Bar Trench。",
    "duration": 90
  },
  {
    "id": "ebisu-wine-03",
    "name": "ワインスタンドYEBISU",
    "area": "恵比寿",
    "category": "wine",
    "description": "恵比寿でしっぽり楽しめるワインスポット。ワインスタンドYEBISU。",
    "duration": 90
  },
  {
    "id": "ebisu-cafe-01",
    "name": "猿田彦珈琲 恵比寿店",
    "area": "恵比寿",
    "category": "cafe",
    "description": "恵比寿で一息つけるカフェ。猿田彦珈琲 恵比寿店。",
    "duration": 50
  },
  {
    "id": "ebisu-cafe-02",
    "name": "カフェ・ド・ランブル代官山",
    "area": "恵比寿",
    "category": "cafe",
    "description": "恵比寿で一息つけるカフェ。カフェ・ド・ランブル代官山。",
    "duration": 50
  },
  {
    "id": "ebisu-cafe-03",
    "name": "恵比寿ガーデンカフェ",
    "area": "恵比寿",
    "category": "cafe",
    "description": "恵比寿で一息つけるカフェ。恵比寿ガーデンカフェ。",
    "duration": 50
  },
  {
    "id": "ebisu-walk-01",
    "name": "東京都写真美術館",
    "area": "恵比寿",
    "category": "walk",
    "description": "恵比寿の空気を感じる散歩ルート。東京都写真美術館。",
    "duration": 45
  },
  {
    "id": "ebisu-walk-02",
    "name": "代官山ヒルサイドテラス",
    "area": "恵比寿",
    "category": "walk",
    "description": "恵比寿の空気を感じる散歩ルート。代官山ヒルサイドテラス。",
    "duration": 45
  },
  {
    "id": "ebisu-walk-03",
    "name": "恵比寿川沿い散歩",
    "area": "恵比寿",
    "category": "walk",
    "description": "恵比寿の空気を感じる散歩ルート。恵比寿川沿い散歩。",
    "duration": 45
  },
  {
    "id": "ebisu-nightlife-01",
    "name": "恵比寿横丁",
    "area": "恵比寿",
    "category": "nightlife",
    "description": "恵比寿の夜を楽しむスポット。恵比寿横丁。",
    "duration": 80
  },
  {
    "id": "ebisu-nightlife-02",
    "name": "ライブハウス恵比寿",
    "area": "恵比寿",
    "category": "nightlife",
    "description": "恵比寿の夜を楽しむスポット。ライブハウス恵比寿。",
    "duration": 80
  },
  {
    "id": "ebisu-nightlife-03",
    "name": "クラフトビールバー恵比寿",
    "area": "恵比寿",
    "category": "nightlife",
    "description": "恵比寿の夜を楽しむスポット。クラフトビールバー恵比寿。",
    "duration": 80
  },
  {
    "id": "ebisu-culture-01",
    "name": "恵比寿ガーデンプレイス",
    "area": "恵比寿",
    "category": "culture",
    "description": "恵比寿で文化・芸術を味わえる場所。恵比寿ガーデンプレイス。",
    "duration": 60
  },
  {
    "id": "ebisu-culture-02",
    "name": "マイアミギャラリー",
    "area": "恵比寿",
    "category": "culture",
    "description": "恵比寿で文化・芸術を味わえる場所。マイアミギャラリー。",
    "duration": 60
  },
  {
    "id": "ebisu-culture-03",
    "name": "東京都庭園美術館",
    "area": "恵比寿",
    "category": "culture",
    "description": "恵比寿で文化・芸術を味わえる場所。東京都庭園美術館。",
    "duration": 60
  },
  {
    "id": "ebisu-food-01",
    "name": "恵比寿焼肉街",
    "area": "恵比寿",
    "category": "food",
    "description": "恵比寿のローカルフード体験。恵比寿焼肉街。",
    "duration": 60
  },
  {
    "id": "ebisu-food-02",
    "name": "つけ麺恵比寿",
    "area": "恵比寿",
    "category": "food",
    "description": "恵比寿のローカルフード体験。つけ麺恵比寿。",
    "duration": 60
  },
  {
    "id": "ebisu-food-03",
    "name": "立ち食い寿司恵比寿",
    "area": "恵比寿",
    "category": "food",
    "description": "恵比寿のローカルフード体験。立ち食い寿司恵比寿。",
    "duration": 60
  },
  {
    "id": "nakame-wine-01",
    "name": "SAKE de VIN",
    "area": "中目黒",
    "category": "wine",
    "description": "中目黒でしっぽり楽しめるワインスポット。SAKE de VIN。",
    "duration": 90
  },
  {
    "id": "nakame-wine-02",
    "name": "中目黒ワイン酒場",
    "area": "中目黒",
    "category": "wine",
    "description": "中目黒でしっぽり楽しめるワインスポット。中目黒ワイン酒場。",
    "duration": 90
  },
  {
    "id": "nakame-wine-03",
    "name": "ナチュラルワイン中目黒",
    "area": "中目黒",
    "category": "wine",
    "description": "中目黒でしっぽり楽しめるワインスポット。ナチュラルワイン中目黒。",
    "duration": 90
  },
  {
    "id": "nakame-cafe-01",
    "name": "Onibus Coffee",
    "area": "中目黒",
    "category": "cafe",
    "description": "中目黒で一息つけるカフェ。Onibus Coffee。",
    "duration": 50
  },
  {
    "id": "nakame-cafe-02",
    "name": "蔦屋書店カフェ中目黒",
    "area": "中目黒",
    "category": "cafe",
    "description": "中目黒で一息つけるカフェ。蔦屋書店カフェ中目黒。",
    "duration": 50
  },
  {
    "id": "nakame-cafe-03",
    "name": "ライトアップコーヒー",
    "area": "中目黒",
    "category": "cafe",
    "description": "中目黒で一息つけるカフェ。ライトアップコーヒー。",
    "duration": 50
  },
  {
    "id": "nakame-walk-01",
    "name": "中目黒川沿い散歩",
    "area": "中目黒",
    "category": "walk",
    "description": "中目黒の空気を感じる散歩ルート。中目黒川沿い散歩。",
    "duration": 45
  },
  {
    "id": "nakame-walk-02",
    "name": "桜並木プロムナード",
    "area": "中目黒",
    "category": "walk",
    "description": "中目黒の空気を感じる散歩ルート。桜並木プロムナード。",
    "duration": 45
  },
  {
    "id": "nakame-walk-03",
    "name": "目黒川ネオン散歩",
    "area": "中目黒",
    "category": "walk",
    "description": "中目黒の空気を感じる散歩ルート。目黒川ネオン散歩。",
    "duration": 45
  },
  {
    "id": "nakame-nightlife-01",
    "name": "中目黒クロスポイント",
    "area": "中目黒",
    "category": "nightlife",
    "description": "中目黒の夜を楽しむスポット。中目黒クロスポイント。",
    "duration": 80
  },
  {
    "id": "nakame-nightlife-02",
    "name": "隠れバー中目黒",
    "area": "中目黒",
    "category": "nightlife",
    "description": "中目黒の夜を楽しむスポット。隠れバー中目黒。",
    "duration": 80
  },
  {
    "id": "nakame-nightlife-03",
    "name": "深夜立ち飲み中目黒",
    "area": "中目黒",
    "category": "nightlife",
    "description": "中目黒の夜を楽しむスポット。深夜立ち飲み中目黒。",
    "duration": 80
  },
  {
    "id": "nakame-culture-01",
    "name": "中目黒アートギャラリー",
    "area": "中目黒",
    "category": "culture",
    "description": "中目黒で文化・芸術を味わえる場所。中目黒アートギャラリー。",
    "duration": 60
  },
  {
    "id": "nakame-culture-02",
    "name": "蔦屋書店 中目黒",
    "area": "中目黒",
    "category": "culture",
    "description": "中目黒で文化・芸術を味わえる場所。蔦屋書店 中目黒。",
    "duration": 60
  },
  {
    "id": "nakame-culture-03",
    "name": "旧東京都庭園美術館",
    "area": "中目黒",
    "category": "culture",
    "description": "中目黒で文化・芸術を味わえる場所。旧東京都庭園美術館。",
    "duration": 60
  },
  {
    "id": "nakame-food-01",
    "name": "中目黒焼き鳥横丁",
    "area": "中目黒",
    "category": "food",
    "description": "中目黒のローカルフード体験。中目黒焼き鳥横丁。",
    "duration": 60
  },
  {
    "id": "nakame-food-02",
    "name": "川沿いビストロ",
    "area": "中目黒",
    "category": "food",
    "description": "中目黒のローカルフード体験。川沿いビストロ。",
    "duration": 60
  },
  {
    "id": "nakame-food-03",
    "name": "中目黒ラーメン",
    "area": "中目黒",
    "category": "food",
    "description": "中目黒のローカルフード体験。中目黒ラーメン。",
    "duration": 60
  },
  {
    "id": "daikanyama-wine-01",
    "name": "代官山ワインバー",
    "area": "代官山",
    "category": "wine",
    "description": "代官山でしっぽり楽しめるワインスポット。代官山ワインバー。",
    "duration": 90
  },
  {
    "id": "daikanyama-wine-02",
    "name": "ヒルサイドテラスワイン",
    "area": "代官山",
    "category": "wine",
    "description": "代官山でしっぽり楽しめるワインスポット。ヒルサイドテラスワイン。",
    "duration": 90
  },
  {
    "id": "daikanyama-wine-03",
    "name": "代官山ナチュラルワイン",
    "area": "代官山",
    "category": "wine",
    "description": "代官山でしっぽり楽しめるワインスポット。代官山ナチュラルワイン。",
    "duration": 90
  },
  {
    "id": "daikanyama-cafe-01",
    "name": "代官山カフェ カドヤ",
    "area": "代官山",
    "category": "cafe",
    "description": "代官山で一息つけるカフェ。代官山カフェ カドヤ。",
    "duration": 50
  },
  {
    "id": "daikanyama-cafe-02",
    "name": "スターバックス 代官山",
    "area": "代官山",
    "category": "cafe",
    "description": "代官山で一息つけるカフェ。スターバックス 代官山。",
    "duration": 50
  },
  {
    "id": "daikanyama-cafe-03",
    "name": "代官山ブックカフェ",
    "area": "代官山",
    "category": "cafe",
    "description": "代官山で一息つけるカフェ。代官山ブックカフェ。",
    "duration": 50
  },
  {
    "id": "daikanyama-walk-01",
    "name": "代官山ヒルサイドテラス散歩",
    "area": "代官山",
    "category": "walk",
    "description": "代官山の空気を感じる散歩ルート。代官山ヒルサイドテラス散歩。",
    "duration": 45
  },
  {
    "id": "daikanyama-walk-02",
    "name": "代官山蔦屋書店周辺",
    "area": "代官山",
    "category": "walk",
    "description": "代官山の空気を感じる散歩ルート。代官山蔦屋書店周辺。",
    "duration": 45
  },
  {
    "id": "daikanyama-walk-03",
    "name": "猿楽坂散策",
    "area": "代官山",
    "category": "walk",
    "description": "代官山の空気を感じる散歩ルート。猿楽坂散策。",
    "duration": 45
  },
  {
    "id": "daikanyama-nightlife-01",
    "name": "代官山バー街",
    "area": "代官山",
    "category": "nightlife",
    "description": "代官山の夜を楽しむスポット。代官山バー街。",
    "duration": 80
  },
  {
    "id": "daikanyama-nightlife-02",
    "name": "隠れスピークイージー",
    "area": "代官山",
    "category": "nightlife",
    "description": "代官山の夜を楽しむスポット。隠れスピークイージー。",
    "duration": 80
  },
  {
    "id": "daikanyama-nightlife-03",
    "name": "代官山深夜バー",
    "area": "代官山",
    "category": "nightlife",
    "description": "代官山の夜を楽しむスポット。代官山深夜バー。",
    "duration": 80
  },
  {
    "id": "daikanyama-culture-01",
    "name": "代官山ヒルサイドテラス",
    "area": "代官山",
    "category": "culture",
    "description": "代官山で文化・芸術を味わえる場所。代官山ヒルサイドテラス。",
    "duration": 60
  },
  {
    "id": "daikanyama-culture-02",
    "name": "代官山アドレス",
    "area": "代官山",
    "category": "culture",
    "description": "代官山で文化・芸術を味わえる場所。代官山アドレス。",
    "duration": 60
  },
  {
    "id": "daikanyama-culture-03",
    "name": "蔦屋書店 代官山",
    "area": "代官山",
    "category": "culture",
    "description": "代官山で文化・芸術を味わえる場所。蔦屋書店 代官山。",
    "duration": 60
  },
  {
    "id": "daikanyama-food-01",
    "name": "代官山フレンチビストロ",
    "area": "代官山",
    "category": "food",
    "description": "代官山のローカルフード体験。代官山フレンチビストロ。",
    "duration": 60
  },
  {
    "id": "daikanyama-food-02",
    "name": "代官山パン屋",
    "area": "代官山",
    "category": "food",
    "description": "代官山のローカルフード体験。代官山パン屋。",
    "duration": 60
  },
  {
    "id": "daikanyama-food-03",
    "name": "代官山イタリアン",
    "area": "代官山",
    "category": "food",
    "description": "代官山のローカルフード体験。代官山イタリアン。",
    "duration": 60
  },
  {
    "id": "hiroo-wine-01",
    "name": "広尾ワインバー",
    "area": "広尾",
    "category": "wine",
    "description": "広尾でしっぽり楽しめるワインスポット。広尾ワインバー。",
    "duration": 90
  },
  {
    "id": "hiroo-wine-02",
    "name": "ナチュラルワイン広尾",
    "area": "広尾",
    "category": "wine",
    "description": "広尾でしっぽり楽しめるワインスポット。ナチュラルワイン広尾。",
    "duration": 90
  },
  {
    "id": "hiroo-wine-03",
    "name": "広尾サケバー",
    "area": "広尾",
    "category": "wine",
    "description": "広尾でしっぽり楽しめるワインスポット。広尾サケバー。",
    "duration": 90
  },
  {
    "id": "hiroo-cafe-01",
    "name": "広尾カフェテラス",
    "area": "広尾",
    "category": "cafe",
    "description": "広尾で一息つけるカフェ。広尾カフェテラス。",
    "duration": 50
  },
  {
    "id": "hiroo-cafe-02",
    "name": "ブルーボトル広尾",
    "area": "広尾",
    "category": "cafe",
    "description": "広尾で一息つけるカフェ。ブルーボトル広尾。",
    "duration": 50
  },
  {
    "id": "hiroo-cafe-03",
    "name": "広尾ブックカフェ",
    "area": "広尾",
    "category": "cafe",
    "description": "広尾で一息つけるカフェ。広尾ブックカフェ。",
    "duration": 50
  },
  {
    "id": "hiroo-walk-01",
    "name": "広尾駅前散歩",
    "area": "広尾",
    "category": "walk",
    "description": "広尾の空気を感じる散歩ルート。広尾駅前散歩。",
    "duration": 45
  },
  {
    "id": "hiroo-walk-02",
    "name": "恵比寿川広尾ルート",
    "area": "広尾",
    "category": "walk",
    "description": "広尾の空気を感じる散歩ルート。恵比寿川広尾ルート。",
    "duration": 45
  },
  {
    "id": "hiroo-walk-03",
    "name": "広尾グリーンスペース",
    "area": "広尾",
    "category": "walk",
    "description": "広尾の空気を感じる散歩ルート。広尾グリーンスペース。",
    "duration": 45
  },
  {
    "id": "hiroo-nightlife-01",
    "name": "広尾バー街",
    "area": "広尾",
    "category": "nightlife",
    "description": "広尾の夜を楽しむスポット。広尾バー街。",
    "duration": 80
  },
  {
    "id": "hiroo-nightlife-02",
    "name": "広尾隠れ家バー",
    "area": "広尾",
    "category": "nightlife",
    "description": "広尾の夜を楽しむスポット。広尾隠れ家バー。",
    "duration": 80
  },
  {
    "id": "hiroo-nightlife-03",
    "name": "広尾深夜ラウンジ",
    "area": "広尾",
    "category": "nightlife",
    "description": "広尾の夜を楽しむスポット。広尾深夜ラウンジ。",
    "duration": 80
  },
  {
    "id": "hiroo-culture-01",
    "name": "国立科学博物館近辺",
    "area": "広尾",
    "category": "culture",
    "description": "広尾で文化・芸術を味わえる場所。国立科学博物館近辺。",
    "duration": 60
  },
  {
    "id": "hiroo-culture-02",
    "name": "広尾ギャラリー",
    "area": "広尾",
    "category": "culture",
    "description": "広尾で文化・芸術を味わえる場所。広尾ギャラリー。",
    "duration": 60
  },
  {
    "id": "hiroo-culture-03",
    "name": "アンティーク広尾",
    "area": "広尾",
    "category": "culture",
    "description": "広尾で文化・芸術を味わえる場所。アンティーク広尾。",
    "duration": 60
  },
  {
    "id": "hiroo-food-01",
    "name": "広尾イタリアン",
    "area": "広尾",
    "category": "food",
    "description": "広尾のローカルフード体験。広尾イタリアン。",
    "duration": 60
  },
  {
    "id": "hiroo-food-02",
    "name": "広尾焼肉",
    "area": "広尾",
    "category": "food",
    "description": "広尾のローカルフード体験。広尾焼肉。",
    "duration": 60
  },
  {
    "id": "hiroo-food-03",
    "name": "広尾エスニック食堂",
    "area": "広尾",
    "category": "food",
    "description": "広尾のローカルフード体験。広尾エスニック食堂。",
    "duration": 60
  },
  {
    "id": "azabu-wine-01",
    "name": "麻布十番ワインバー",
    "area": "麻布十番",
    "category": "wine",
    "description": "麻布十番でしっぽり楽しめるワインスポット。麻布十番ワインバー。",
    "duration": 90
  },
  {
    "id": "azabu-wine-02",
    "name": "ナチュラルワイン麻布",
    "area": "麻布十番",
    "category": "wine",
    "description": "麻布十番でしっぽり楽しめるワインスポット。ナチュラルワイン麻布。",
    "duration": 90
  },
  {
    "id": "azabu-wine-03",
    "name": "麻布サワーバー",
    "area": "麻布十番",
    "category": "wine",
    "description": "麻布十番でしっぽり楽しめるワインスポット。麻布サワーバー。",
    "duration": 90
  },
  {
    "id": "azabu-cafe-01",
    "name": "麻布十番カフェ",
    "area": "麻布十番",
    "category": "cafe",
    "description": "麻布十番で一息つけるカフェ。麻布十番カフェ。",
    "duration": 50
  },
  {
    "id": "azabu-cafe-02",
    "name": "十番カフェテラス",
    "area": "麻布十番",
    "category": "cafe",
    "description": "麻布十番で一息つけるカフェ。十番カフェテラス。",
    "duration": 50
  },
  {
    "id": "azabu-cafe-03",
    "name": "麻布モーニングカフェ",
    "area": "麻布十番",
    "category": "cafe",
    "description": "麻布十番で一息つけるカフェ。麻布モーニングカフェ。",
    "duration": 50
  },
  {
    "id": "azabu-walk-01",
    "name": "麻布十番商店街散歩",
    "area": "麻布十番",
    "category": "walk",
    "description": "麻布十番の空気を感じる散歩ルート。麻布十番商店街散歩。",
    "duration": 45
  },
  {
    "id": "azabu-walk-02",
    "name": "十番坂ネオン散策",
    "area": "麻布十番",
    "category": "walk",
    "description": "麻布十番の空気を感じる散歩ルート。十番坂ネオン散策。",
    "duration": 45
  },
  {
    "id": "azabu-walk-03",
    "name": "麻布台ヒルズ周辺",
    "area": "麻布十番",
    "category": "walk",
    "description": "麻布十番の空気を感じる散歩ルート。麻布台ヒルズ周辺。",
    "duration": 45
  },
  {
    "id": "azabu-nightlife-01",
    "name": "麻布十番バー街",
    "area": "麻布十番",
    "category": "nightlife",
    "description": "麻布十番の夜を楽しむスポット。麻布十番バー街。",
    "duration": 80
  },
  {
    "id": "azabu-nightlife-02",
    "name": "麻布十番横丁",
    "area": "麻布十番",
    "category": "nightlife",
    "description": "麻布十番の夜を楽しむスポット。麻布十番横丁。",
    "duration": 80
  },
  {
    "id": "azabu-nightlife-03",
    "name": "深夜バー麻布",
    "area": "麻布十番",
    "category": "nightlife",
    "description": "麻布十番の夜を楽しむスポット。深夜バー麻布。",
    "duration": 80
  },
  {
    "id": "azabu-culture-01",
    "name": "麻布台ヒルズ",
    "area": "麻布十番",
    "category": "culture",
    "description": "麻布十番で文化・芸術を味わえる場所。麻布台ヒルズ。",
    "duration": 60
  },
  {
    "id": "azabu-culture-02",
    "name": "麻布ギャラリー",
    "area": "麻布十番",
    "category": "culture",
    "description": "麻布十番で文化・芸術を味わえる場所。麻布ギャラリー。",
    "duration": 60
  },
  {
    "id": "azabu-culture-03",
    "name": "三縁山神社周辺",
    "area": "麻布十番",
    "category": "culture",
    "description": "麻布十番で文化・芸術を味わえる場所。三縁山神社周辺。",
    "duration": 60
  },
  {
    "id": "azabu-food-01",
    "name": "麻布十番そば",
    "area": "麻布十番",
    "category": "food",
    "description": "麻布十番のローカルフード体験。麻布十番そば。",
    "duration": 60
  },
  {
    "id": "azabu-food-02",
    "name": "麻布十番焼き鳥",
    "area": "麻布十番",
    "category": "food",
    "description": "麻布十番のローカルフード体験。麻布十番焼き鳥。",
    "duration": 60
  },
  {
    "id": "azabu-food-03",
    "name": "麻布十番つけ麺",
    "area": "麻布十番",
    "category": "food",
    "description": "麻布十番のローカルフード体験。麻布十番つけ麺。",
    "duration": 60
  },
  {
    "id": "roppongi-wine-01",
    "name": "六本木ワインバー",
    "area": "六本木",
    "category": "wine",
    "description": "六本木でしっぽり楽しめるワインスポット。六本木ワインバー。",
    "duration": 90
  },
  {
    "id": "roppongi-wine-02",
    "name": "六本木ナチュラルワイン",
    "area": "六本木",
    "category": "wine",
    "description": "六本木でしっぽり楽しめるワインスポット。六本木ナチュラルワイン。",
    "duration": 90
  },
  {
    "id": "roppongi-wine-03",
    "name": "六本木ルーフトップバー",
    "area": "六本木",
    "category": "wine",
    "description": "六本木でしっぽり楽しめるワインスポット。六本木ルーフトップバー。",
    "duration": 90
  },
  {
    "id": "roppongi-cafe-01",
    "name": "六本木カフェテラス",
    "area": "六本木",
    "category": "cafe",
    "description": "六本木で一息つけるカフェ。六本木カフェテラス。",
    "duration": 50
  },
  {
    "id": "roppongi-cafe-02",
    "name": "ブルーボトル六本木",
    "area": "六本木",
    "category": "cafe",
    "description": "六本木で一息つけるカフェ。ブルーボトル六本木。",
    "duration": 50
  },
  {
    "id": "roppongi-cafe-03",
    "name": "六本木ブックカフェ",
    "area": "六本木",
    "category": "cafe",
    "description": "六本木で一息つけるカフェ。六本木ブックカフェ。",
    "duration": 50
  },
  {
    "id": "roppongi-walk-01",
    "name": "六本木ヒルズ散歩",
    "area": "六本木",
    "category": "walk",
    "description": "六本木の空気を感じる散歩ルート。六本木ヒルズ散歩。",
    "duration": 45
  },
  {
    "id": "roppongi-walk-02",
    "name": "けやき坂ネオン散策",
    "area": "六本木",
    "category": "walk",
    "description": "六本木の空気を感じる散歩ルート。けやき坂ネオン散策。",
    "duration": 45
  },
  {
    "id": "roppongi-walk-03",
    "name": "六本木通りウォーク",
    "area": "六本木",
    "category": "walk",
    "description": "六本木の空気を感じる散歩ルート。六本木通りウォーク。",
    "duration": 45
  },
  {
    "id": "roppongi-nightlife-01",
    "name": "六本木クラブ街",
    "area": "六本木",
    "category": "nightlife",
    "description": "六本木の夜を楽しむスポット。六本木クラブ街。",
    "duration": 80
  },
  {
    "id": "roppongi-nightlife-02",
    "name": "六本木バー街",
    "area": "六本木",
    "category": "nightlife",
    "description": "六本木の夜を楽しむスポット。六本木バー街。",
    "duration": 80
  },
  {
    "id": "roppongi-nightlife-03",
    "name": "六本木深夜ラウンジ",
    "area": "六本木",
    "category": "nightlife",
    "description": "六本木の夜を楽しむスポット。六本木深夜ラウンジ。",
    "duration": 80
  },
  {
    "id": "roppongi-culture-01",
    "name": "森美術館",
    "area": "六本木",
    "category": "culture",
    "description": "六本木で文化・芸術を味わえる場所。森美術館。",
    "duration": 60
  },
  {
    "id": "roppongi-culture-02",
    "name": "国立新美術館",
    "area": "六本木",
    "category": "culture",
    "description": "六本木で文化・芸術を味わえる場所。国立新美術館。",
    "duration": 60
  },
  {
    "id": "roppongi-culture-03",
    "name": "六本木ヒルズ展望",
    "area": "六本木",
    "category": "culture",
    "description": "六本木で文化・芸術を味わえる場所。六本木ヒルズ展望。",
    "duration": 60
  },
  {
    "id": "roppongi-food-01",
    "name": "六本木焼肉",
    "area": "六本木",
    "category": "food",
    "description": "六本木のローカルフード体験。六本木焼肉。",
    "duration": 60
  },
  {
    "id": "roppongi-food-02",
    "name": "六本木ラーメン",
    "area": "六本木",
    "category": "food",
    "description": "六本木のローカルフード体験。六本木ラーメン。",
    "duration": 60
  },
  {
    "id": "roppongi-food-03",
    "name": "六本木寿司バー",
    "area": "六本木",
    "category": "food",
    "description": "六本木のローカルフード体験。六本木寿司バー。",
    "duration": 60
  },
  {
    "id": "shimokita-wine-01",
    "name": "下北沢ナチュラルワイン食堂",
    "area": "下北沢",
    "category": "wine",
    "description": "下北沢でしっぽり楽しめるワインスポット。下北沢ナチュラルワイン食堂。",
    "duration": 90
  },
  {
    "id": "shimokita-wine-02",
    "name": "下北ワインバー",
    "area": "下北沢",
    "category": "wine",
    "description": "下北沢でしっぽり楽しめるワインスポット。下北ワインバー。",
    "duration": 90
  },
  {
    "id": "shimokita-wine-03",
    "name": "下北沢サケバー",
    "area": "下北沢",
    "category": "wine",
    "description": "下北沢でしっぽり楽しめるワインスポット。下北沢サケバー。",
    "duration": 90
  },
  {
    "id": "shimokita-cafe-01",
    "name": "ボンギブレーカー",
    "area": "下北沢",
    "category": "cafe",
    "description": "下北沢で一息つけるカフェ。ボンギブレーカー。",
    "duration": 50
  },
  {
    "id": "shimokita-cafe-02",
    "name": "下北沢古着カフェ",
    "area": "下北沢",
    "category": "cafe",
    "description": "下北沢で一息つけるカフェ。下北沢古着カフェ。",
    "duration": 50
  },
  {
    "id": "shimokita-cafe-03",
    "name": "下北コーヒースタンド",
    "area": "下北沢",
    "category": "cafe",
    "description": "下北沢で一息つけるカフェ。下北コーヒースタンド。",
    "duration": 50
  },
  {
    "id": "shimokita-walk-01",
    "name": "下北沢古着街散歩",
    "area": "下北沢",
    "category": "walk",
    "description": "下北沢の空気を感じる散歩ルート。下北沢古着街散歩。",
    "duration": 45
  },
  {
    "id": "shimokita-walk-02",
    "name": "ボーイ通り散策",
    "area": "下北沢",
    "category": "walk",
    "description": "下北沢の空気を感じる散歩ルート。ボーイ通り散策。",
    "duration": 45
  },
  {
    "id": "shimokita-walk-03",
    "name": "下北沢ライブ街散歩",
    "area": "下北沢",
    "category": "walk",
    "description": "下北沢の空気を感じる散歩ルート。下北沢ライブ街散歩。",
    "duration": 45
  },
  {
    "id": "shimokita-nightlife-01",
    "name": "下北沢ライブバー",
    "area": "下北沢",
    "category": "nightlife",
    "description": "下北沢の夜を楽しむスポット。下北沢ライブバー。",
    "duration": 80
  },
  {
    "id": "shimokita-nightlife-02",
    "name": "クラフトビールバー下北",
    "area": "下北沢",
    "category": "nightlife",
    "description": "下北沢の夜を楽しむスポット。クラフトビールバー下北。",
    "duration": 80
  },
  {
    "id": "shimokita-nightlife-03",
    "name": "下北深夜バー",
    "area": "下北沢",
    "category": "nightlife",
    "description": "下北沢の夜を楽しむスポット。下北深夜バー。",
    "duration": 80
  },
  {
    "id": "shimokita-culture-01",
    "name": "下北沢シアター",
    "area": "下北沢",
    "category": "culture",
    "description": "下北沢で文化・芸術を味わえる場所。下北沢シアター。",
    "duration": 60
  },
  {
    "id": "shimokita-culture-02",
    "name": "下北沢レコードショップ",
    "area": "下北沢",
    "category": "culture",
    "description": "下北沢で文化・芸術を味わえる場所。下北沢レコードショップ。",
    "duration": 60
  },
  {
    "id": "shimokita-culture-03",
    "name": "下北沢ギャラリー",
    "area": "下北沢",
    "category": "culture",
    "description": "下北沢で文化・芸術を味わえる場所。下北沢ギャラリー。",
    "duration": 60
  },
  {
    "id": "shimokita-food-01",
    "name": "下北沢カレー",
    "area": "下北沢",
    "category": "food",
    "description": "下北沢のローカルフード体験。下北沢カレー。",
    "duration": 60
  },
  {
    "id": "shimokita-food-02",
    "name": "下北沢焼き鳥",
    "area": "下北沢",
    "category": "food",
    "description": "下北沢のローカルフード体験。下北沢焼き鳥。",
    "duration": 60
  },
  {
    "id": "shimokita-food-03",
    "name": "下北沢ラーメン横丁",
    "area": "下北沢",
    "category": "food",
    "description": "下北沢のローカルフード体験。下北沢ラーメン横丁。",
    "duration": 60
  },
  {
    "id": "asakusa-wine-01",
    "name": "浅草ワイン横丁",
    "area": "浅草",
    "category": "wine",
    "description": "浅草でしっぽり楽しめるワインスポット。浅草ワイン横丁。",
    "duration": 90
  },
  {
    "id": "asakusa-wine-02",
    "name": "浅草ナチュラルワイン",
    "area": "浅草",
    "category": "wine",
    "description": "浅草でしっぽり楽しめるワインスポット。浅草ナチュラルワイン。",
    "duration": 90
  },
  {
    "id": "asakusa-wine-03",
    "name": "浅草サケバー",
    "area": "浅草",
    "category": "wine",
    "description": "浅草でしっぽり楽しめるワインスポット。浅草サケバー。",
    "duration": 90
  },
  {
    "id": "asakusa-cafe-01",
    "name": "浅草和カフェ",
    "area": "浅草",
    "category": "cafe",
    "description": "浅草で一息つけるカフェ。浅草和カフェ。",
    "duration": 50
  },
  {
    "id": "asakusa-cafe-02",
    "name": "カフェ・ド・ランブル浅草",
    "area": "浅草",
    "category": "cafe",
    "description": "浅草で一息つけるカフェ。カフェ・ド・ランブル浅草。",
    "duration": 50
  },
  {
    "id": "asakusa-cafe-03",
    "name": "浅草茶屋",
    "area": "浅草",
    "category": "cafe",
    "description": "浅草で一息つけるカフェ。浅草茶屋。",
    "duration": 50
  },
  {
    "id": "asakusa-walk-01",
    "name": "浅草寺参道",
    "area": "浅草",
    "category": "walk",
    "description": "浅草の空気を感じる散歩ルート。浅草寺参道。",
    "duration": 45
  },
  {
    "id": "asakusa-walk-02",
    "name": "隅田川遊歩道",
    "area": "浅草",
    "category": "walk",
    "description": "浅草の空気を感じる散歩ルート。隅田川遊歩道。",
    "duration": 45
  },
  {
    "id": "asakusa-walk-03",
    "name": "仲見世通り散歩",
    "area": "浅草",
    "category": "walk",
    "description": "浅草の空気を感じる散歩ルート。仲見世通り散歩。",
    "duration": 45
  },
  {
    "id": "asakusa-nightlife-01",
    "name": "浅草ホッピー通り",
    "area": "浅草",
    "category": "nightlife",
    "description": "浅草の夜を楽しむスポット。浅草ホッピー通り。",
    "duration": 80
  },
  {
    "id": "asakusa-nightlife-02",
    "name": "仲見世横丁",
    "area": "浅草",
    "category": "nightlife",
    "description": "浅草の夜を楽しむスポット。仲見世横丁。",
    "duration": 80
  },
  {
    "id": "asakusa-nightlife-03",
    "name": "浅草深夜居酒屋",
    "area": "浅草",
    "category": "nightlife",
    "description": "浅草の夜を楽しむスポット。浅草深夜居酒屋。",
    "duration": 80
  },
  {
    "id": "asakusa-culture-01",
    "name": "浅草寺",
    "area": "浅草",
    "category": "culture",
    "description": "浅草で文化・芸術を味わえる場所。浅草寺。",
    "duration": 60
  },
  {
    "id": "asakusa-culture-02",
    "name": "浅草演芸ホール",
    "area": "浅草",
    "category": "culture",
    "description": "浅草で文化・芸術を味わえる場所。浅草演芸ホール。",
    "duration": 60
  },
  {
    "id": "asakusa-culture-03",
    "name": "東京スカイツリー展望",
    "area": "浅草",
    "category": "culture",
    "description": "浅草で文化・芸術を味わえる場所。東京スカイツリー展望。",
    "duration": 60
  },
  {
    "id": "asakusa-food-01",
    "name": "浅草天ぷら",
    "area": "浅草",
    "category": "food",
    "description": "浅草のローカルフード体験。浅草天ぷら。",
    "duration": 60
  },
  {
    "id": "asakusa-food-02",
    "name": "浅草もんじゃ",
    "area": "浅草",
    "category": "food",
    "description": "浅草のローカルフード体験。浅草もんじゃ。",
    "duration": 60
  },
  {
    "id": "asakusa-food-03",
    "name": "浅草焼き鳥横丁",
    "area": "浅草",
    "category": "food",
    "description": "浅草のローカルフード体験。浅草焼き鳥横丁。",
    "duration": 60
  },
  {
    "id": "kagurazaka-wine-01",
    "name": "神楽坂ワインバー",
    "area": "神楽坂",
    "category": "wine",
    "description": "神楽坂でしっぽり楽しめるワインスポット。神楽坂ワインバー。",
    "duration": 90
  },
  {
    "id": "kagurazaka-wine-02",
    "name": "神楽坂日本酒バー",
    "area": "神楽坂",
    "category": "wine",
    "description": "神楽坂でしっぽり楽しめるワインスポット。神楽坂日本酒バー。",
    "duration": 90
  },
  {
    "id": "kagurazaka-wine-03",
    "name": "神楽坂ナチュラルワイン",
    "area": "神楽坂",
    "category": "wine",
    "description": "神楽坂でしっぽり楽しめるワインスポット。神楽坂ナチュラルワイン。",
    "duration": 90
  },
  {
    "id": "kagurazaka-cafe-01",
    "name": "神楽坂カフェ",
    "area": "神楽坂",
    "category": "cafe",
    "description": "神楽坂で一息つけるカフェ。神楽坂カフェ。",
    "duration": 50
  },
  {
    "id": "kagurazaka-cafe-02",
    "name": "神楽坂茶房",
    "area": "神楽坂",
    "category": "cafe",
    "description": "神楽坂で一息つけるカフェ。神楽坂茶房。",
    "duration": 50
  },
  {
    "id": "kagurazaka-cafe-03",
    "name": "神楽坂ブックカフェ",
    "area": "神楽坂",
    "category": "cafe",
    "description": "神楽坂で一息つけるカフェ。神楽坂ブックカフェ。",
    "duration": 50
  },
  {
    "id": "kagurazaka-walk-01",
    "name": "神楽坂坂道散歩",
    "area": "神楽坂",
    "category": "walk",
    "description": "神楽坂の空気を感じる散歩ルート。神楽坂坂道散歩。",
    "duration": 45
  },
  {
    "id": "kagurazaka-walk-02",
    "name": "石畳路地裏散策",
    "area": "神楽坂",
    "category": "walk",
    "description": "神楽坂の空気を感じる散歩ルート。石畳路地裏散策。",
    "duration": 45
  },
  {
    "id": "kagurazaka-walk-03",
    "name": "神楽坂ネオン散歩",
    "area": "神楽坂",
    "category": "walk",
    "description": "神楽坂の空気を感じる散歩ルート。神楽坂ネオン散歩。",
    "duration": 45
  },
  {
    "id": "kagurazaka-nightlife-01",
    "name": "神楽坂バー街",
    "area": "神楽坂",
    "category": "nightlife",
    "description": "神楽坂の夜を楽しむスポット。神楽坂バー街。",
    "duration": 80
  },
  {
    "id": "kagurazaka-nightlife-02",
    "name": "神楽坂隠れ居酒屋",
    "area": "神楽坂",
    "category": "nightlife",
    "description": "神楽坂の夜を楽しむスポット。神楽坂隠れ居酒屋。",
    "duration": 80
  },
  {
    "id": "kagurazaka-nightlife-03",
    "name": "神楽坂深夜バー",
    "area": "神楽坂",
    "category": "nightlife",
    "description": "神楽坂の夜を楽しむスポット。神楽坂深夜バー。",
    "duration": 80
  },
  {
    "id": "kagurazaka-culture-01",
    "name": "善國寺周辺",
    "area": "神楽坂",
    "category": "culture",
    "description": "神楽坂で文化・芸術を味わえる場所。善國寺周辺。",
    "duration": 60
  },
  {
    "id": "kagurazaka-culture-02",
    "name": "神楽坂能楽堂",
    "area": "神楽坂",
    "category": "culture",
    "description": "神楽坂で文化・芸術を味わえる場所。神楽坂能楽堂。",
    "duration": 60
  },
  {
    "id": "kagurazaka-culture-03",
    "name": "神楽坂ギャラリー",
    "area": "神楽坂",
    "category": "culture",
    "description": "神楽坂で文化・芸術を味わえる場所。神楽坂ギャラリー。",
    "duration": 60
  },
  {
    "id": "kagurazaka-food-01",
    "name": "神楽坂そば",
    "area": "神楽坂",
    "category": "food",
    "description": "神楽坂のローカルフード体験。神楽坂そば。",
    "duration": 60
  },
  {
    "id": "kagurazaka-food-02",
    "name": "神楽坂懐石",
    "area": "神楽坂",
    "category": "food",
    "description": "神楽坂のローカルフード体験。神楽坂懐石。",
    "duration": 60
  },
  {
    "id": "kagurazaka-food-03",
    "name": "神楽坂焼き鳥",
    "area": "神楽坂",
    "category": "food",
    "description": "神楽坂のローカルフード体験。神楽坂焼き鳥。",
    "duration": 60
  },
  {
    "id": "shinjuku-wine-01",
    "name": "新宿ワインバー",
    "area": "新宿",
    "category": "wine",
    "description": "新宿でしっぽり楽しめるワインスポット。新宿ワインバー。",
    "duration": 90
  },
  {
    "id": "shinjuku-wine-02",
    "name": "新宿ナチュラルワイン",
    "area": "新宿",
    "category": "wine",
    "description": "新宿でしっぽり楽しめるワインスポット。新宿ナチュラルワイン。",
    "duration": 90
  },
  {
    "id": "shinjuku-wine-03",
    "name": "ゴールデン街ワインバー",
    "area": "新宿",
    "category": "wine",
    "description": "新宿でしっぽり楽しめるワインスポット。ゴールデン街ワインバー。",
    "duration": 90
  },
  {
    "id": "shinjuku-cafe-01",
    "name": "新宿カフェテラス",
    "area": "新宿",
    "category": "cafe",
    "description": "新宿で一息つけるカフェ。新宿カフェテラス。",
    "duration": 50
  },
  {
    "id": "shinjuku-cafe-02",
    "name": "ブルーボトル新宿",
    "area": "新宿",
    "category": "cafe",
    "description": "新宿で一息つけるカフェ。ブルーボトル新宿。",
    "duration": 50
  },
  {
    "id": "shinjuku-cafe-03",
    "name": "新宿ブックカフェ",
    "area": "新宿",
    "category": "cafe",
    "description": "新宿で一息つけるカフェ。新宿ブックカフェ。",
    "duration": 50
  },
  {
    "id": "shinjuku-walk-01",
    "name": "新宿御苑散歩",
    "area": "新宿",
    "category": "walk",
    "description": "新宿の空気を感じる散歩ルート。新宿御苑散歩。",
    "duration": 45
  },
  {
    "id": "shinjuku-walk-02",
    "name": "歌舞伎町ネオン散策",
    "area": "新宿",
    "category": "walk",
    "description": "新宿の空気を感じる散歩ルート。歌舞伎町ネオン散策。",
    "duration": 45
  },
  {
    "id": "shinjuku-walk-03",
    "name": "新宿ゴールデン街散歩",
    "area": "新宿",
    "category": "walk",
    "description": "新宿の空気を感じる散歩ルート。新宿ゴールデン街散歩。",
    "duration": 45
  },
  {
    "id": "shinjuku-nightlife-01",
    "name": "新宿ゴールデン街",
    "area": "新宿",
    "category": "nightlife",
    "description": "新宿の夜を楽しむスポット。新宿ゴールデン街。",
    "duration": 80
  },
  {
    "id": "shinjuku-nightlife-02",
    "name": "歌舞伎町バー",
    "area": "新宿",
    "category": "nightlife",
    "description": "新宿の夜を楽しむスポット。歌舞伎町バー。",
    "duration": 80
  },
  {
    "id": "shinjuku-nightlife-03",
    "name": "新宿深夜ラウンジ",
    "area": "新宿",
    "category": "nightlife",
    "description": "新宿の夜を楽しむスポット。新宿深夜ラウンジ。",
    "duration": 80
  },
  {
    "id": "shinjuku-culture-01",
    "name": "新宿御苑",
    "area": "新宿",
    "category": "culture",
    "description": "新宿で文化・芸術を味わえる場所。新宿御苑。",
    "duration": 60
  },
  {
    "id": "shinjuku-culture-02",
    "name": "東京都庁展望",
    "area": "新宿",
    "category": "culture",
    "description": "新宿で文化・芸術を味わえる場所。東京都庁展望。",
    "duration": 60
  },
  {
    "id": "shinjuku-culture-03",
    "name": "新宿ギャラリー",
    "area": "新宿",
    "category": "culture",
    "description": "新宿で文化・芸術を味わえる場所。新宿ギャラリー。",
    "duration": 60
  },
  {
    "id": "shinjuku-food-01",
    "name": "思い出横丁",
    "area": "新宿",
    "category": "food",
    "description": "新宿のローカルフード体験。思い出横丁。",
    "duration": 60
  },
  {
    "id": "shinjuku-food-02",
    "name": "新宿ラーメン",
    "area": "新宿",
    "category": "food",
    "description": "新宿のローカルフード体験。新宿ラーメン。",
    "duration": 60
  },
  {
    "id": "shinjuku-food-03",
    "name": "新宿焼き鳥横丁",
    "area": "新宿",
    "category": "food",
    "description": "新宿のローカルフード体験。新宿焼き鳥横丁。",
    "duration": 60
  },
  {
    "id": "shibuya-wine-01",
    "name": "渋谷ナチュラルワインバー",
    "area": "渋谷",
    "category": "wine",
    "description": "渋谷でしっぽり楽しめるワインスポット。渋谷ナチュラルワインバー。",
    "duration": 90
  },
  {
    "id": "shibuya-wine-02",
    "name": "渋谷ワインスタンド",
    "area": "渋谷",
    "category": "wine",
    "description": "渋谷でしっぽり楽しめるワインスポット。渋谷ワインスタンド。",
    "duration": 90
  },
  {
    "id": "shibuya-wine-03",
    "name": "渋谷ルーフトップバー",
    "area": "渋谷",
    "category": "wine",
    "description": "渋谷でしっぽり楽しめるワインスポット。渋谷ルーフトップバー。",
    "duration": 90
  },
  {
    "id": "shibuya-cafe-01",
    "name": "Fuglen Tokyo",
    "area": "渋谷",
    "category": "cafe",
    "description": "渋谷で一息つけるカフェ。Fuglen Tokyo。",
    "duration": 50
  },
  {
    "id": "shibuya-cafe-02",
    "name": "渋谷パンカフェ",
    "area": "渋谷",
    "category": "cafe",
    "description": "渋谷で一息つけるカフェ。渋谷パンカフェ。",
    "duration": 50
  },
  {
    "id": "shibuya-cafe-03",
    "name": "渋谷ブックカフェ",
    "area": "渋谷",
    "category": "cafe",
    "description": "渋谷で一息つけるカフェ。渋谷ブックカフェ。",
    "duration": 50
  },
  {
    "id": "shibuya-walk-01",
    "name": "宮下公園",
    "area": "渋谷",
    "category": "walk",
    "description": "渋谷の空気を感じる散歩ルート。宮下公園。",
    "duration": 45
  },
  {
    "id": "shibuya-walk-02",
    "name": "神南坂散歩",
    "area": "渋谷",
    "category": "walk",
    "description": "渋谷の空気を感じる散歩ルート。神南坂散歩。",
    "duration": 45
  },
  {
    "id": "shibuya-walk-03",
    "name": "渋谷スクランブル散策",
    "area": "渋谷",
    "category": "walk",
    "description": "渋谷の空気を感じる散歩ルート。渋谷スクランブル散策。",
    "duration": 45
  },
  {
    "id": "shibuya-nightlife-01",
    "name": "渋谷横丁",
    "area": "渋谷",
    "category": "nightlife",
    "description": "渋谷の夜を楽しむスポット。渋谷横丁。",
    "duration": 80
  },
  {
    "id": "shibuya-nightlife-02",
    "name": "NONBEI坂",
    "area": "渋谷",
    "category": "nightlife",
    "description": "渋谷の夜を楽しむスポット。NONBEI坂。",
    "duration": 80
  },
  {
    "id": "shibuya-nightlife-03",
    "name": "渋谷深夜クラブ",
    "area": "渋谷",
    "category": "nightlife",
    "description": "渋谷の夜を楽しむスポット。渋谷深夜クラブ。",
    "duration": 80
  },
  {
    "id": "shibuya-culture-01",
    "name": "渋谷スクランブル",
    "area": "渋谷",
    "category": "culture",
    "description": "渋谷で文化・芸術を味わえる場所。渋谷スクランブル。",
    "duration": 60
  },
  {
    "id": "shibuya-culture-02",
    "name": "渋谷ギャラリー",
    "area": "渋谷",
    "category": "culture",
    "description": "渋谷で文化・芸術を味わえる場所。渋谷ギャラリー。",
    "duration": 60
  },
  {
    "id": "shibuya-culture-03",
    "name": "渋谷ストリーム",
    "area": "渋谷",
    "category": "culture",
    "description": "渋谷で文化・芸術を味わえる場所。渋谷ストリーム。",
    "duration": 60
  },
  {
    "id": "shibuya-food-01",
    "name": "渋谷ラーメン",
    "area": "渋谷",
    "category": "food",
    "description": "渋谷のローカルフード体験。渋谷ラーメン。",
    "duration": 60
  },
  {
    "id": "shibuya-food-02",
    "name": "渋谷焼肉",
    "area": "渋谷",
    "category": "food",
    "description": "渋谷のローカルフード体験。渋谷焼肉。",
    "duration": 60
  },
  {
    "id": "shibuya-food-03",
    "name": "渋谷立ち食い寿司",
    "area": "渋谷",
    "category": "food",
    "description": "渋谷のローカルフード体験。渋谷立ち食い寿司。",
    "duration": 60
  },
  {
    "id": "extra-01",
    "name": "渋谷PARCOアートフロア",
    "area": "渋谷",
    "category": "culture",
    "description": "渋谷で文化・芸術を味わえる場所。渋谷PARCOアートフロア。",
    "duration": 60
  },
  {
    "id": "extra-02",
    "name": "新宿深夜カレー",
    "area": "新宿",
    "category": "food",
    "description": "新宿のローカルフード体験。新宿深夜カレー。",
    "duration": 60
  }
];

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
