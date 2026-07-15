/** Local Mode — food category chips (horizontal scroll) */

export const LOCAL_FOOD_CATEGORIES = [
  { id: 'ramen', icon: '🍜', labelJa: 'ラーメン', labelEn: 'Ramen', keywords: ['ラーメン', 'つけ麺', 'ramen'] },
  { id: 'sushi', icon: '🍣', labelJa: '寿司', labelEn: 'Sushi', keywords: ['寿司', 'sushi', '刺身'] },
  { id: 'yakiniku', icon: '🥩', labelJa: '焼肉', labelEn: 'Yakiniku', keywords: ['焼肉', 'yakiniku', '和牛'] },
  { id: 'yakitori', icon: '🍢', labelJa: '焼鳥', labelEn: 'Yakitori', keywords: ['焼き鳥', 'yakitori', '焼鳥'] },
  { id: 'izakaya', icon: '🍶', labelJa: '居酒屋', labelEn: 'Izakaya', keywords: ['居酒屋', '横丁', 'izakaya'] },
  { id: 'seafood', icon: '🐟', labelJa: '海鮮', labelEn: 'Seafood', keywords: ['海鮮', '魚', '刺身', 'seafood'] },
  { id: 'cafe', icon: '☕', labelJa: 'カフェ', labelEn: 'Cafe', keywords: ['カフェ', 'cafe', '珈琲', 'コーヒー'] },
  { id: 'sweets', icon: '🍰', labelJa: 'スイーツ', labelEn: 'Sweets', keywords: ['スイーツ', 'デザート', 'パン', 'ケーキ'] },
  { id: 'italian', icon: '🍝', labelJa: 'イタリアン', labelEn: 'Italian', keywords: ['イタリアン', 'パスタ', 'ピザ', 'ビストロ'] },
  { id: 'french', icon: '🥖', labelJa: 'フレンチ', labelEn: 'French', keywords: ['フレンチ', 'ビストロ', 'french'] },
  { id: 'chinese', icon: '🥟', labelJa: '中華', labelEn: 'Chinese', keywords: ['中華', '餃子', 'chinese'] },
  { id: 'korean', icon: '🌶', labelJa: '韓国料理', labelEn: 'Korean', keywords: ['韓国', 'korean', 'キムチ', 'サムギョプサル'] },
  { id: 'ethnic', icon: '🌏', labelJa: 'エスニック', labelEn: 'Ethnic', keywords: ['タイ', 'インド', 'エスニック', 'ethnic', 'アジア'] },
  { id: 'washoku', icon: '🍱', labelJa: '和食', labelEn: 'Washoku', keywords: ['和食', '割烹', '懐石', '定食', 'washoku'] },
  { id: 'teishoku', icon: '🍚', labelJa: '定食', labelEn: 'Teishoku', keywords: ['定食', '食堂', '丼', 'teishoku'] },
  { id: 'soba-udon', icon: '🍥', labelJa: '蕎麦・うどん', labelEn: 'Soba & Udon', keywords: ['蕎麦', 'うどん', 'soba', 'udon'] },
  { id: 'burger', icon: '🍔', labelJa: 'ハンバーガー', labelEn: 'Burger', keywords: ['バーガー', 'burger', 'ハンバーガー'] },
  { id: 'bar', icon: '🍸', labelJa: 'バー', labelEn: 'Bar', keywords: ['バー', 'bar', 'カクテル', 'ワインバー'] },
  { id: 'sake', icon: '🍶', labelJa: 'お酒', labelEn: 'Drinks', keywords: ['日本酒', 'sake', 'ワイン', 'wine', 'カクテル'] },
  { id: 'breakfast', icon: '🌅', labelJa: '朝食', labelEn: 'Breakfast', keywords: ['朝食', 'モーニング', 'breakfast', 'ブランチ'] },
  { id: 'lunch', icon: '🌞', labelJa: 'ランチ', labelEn: 'Lunch', keywords: ['ランチ', 'lunch', '昼', '定食'] },
  { id: 'dinner', icon: '🌙', labelJa: 'ディナー', labelEn: 'Dinner', keywords: ['ディナー', 'dinner', '夜', 'コース'] },
];

export function getFoodCategoryLabel(item, locale) {
  return locale === 'en' ? item.labelEn : item.labelJa;
}

export function getFoodCategoryById(id) {
  return LOCAL_FOOD_CATEGORIES.find((c) => c.id === id);
}
