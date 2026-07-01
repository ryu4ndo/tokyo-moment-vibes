/** Reliable Tokyo-themed images with category fallbacks */

const CATEGORY_IMAGES = {
  bar: [
    'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=900&q=80&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1572116469696-31de07719aa2?w=900&q=80&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=900&q=80&auto=format&fit=crop',
  ],
  cafe: [
    'https://images.unsplash.com/photo-1509048191087-dc4f030d9e71?w=900&q=80&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1445112254802-cb0b785fa227?w=900&q=80&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=900&q=80&auto=format&fit=crop',
  ],
  food: [
    'https://images.unsplash.com/photo-1553621042-f6e147245754?w=900&q=80&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1594212699903-ec524e3a456d?w=900&q=80&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1563613112-6b56f2f7c0e8?w=900&q=80&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1579027989536-b7b3f875ceea?w=900&q=80&auto=format&fit=crop',
  ],
  alley: [
    'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=900&q=80&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1528164344705-47542687000d?w=900&q=80&auto=format&fit=crop',
  ],
  izakaya: [
    'https://images.unsplash.com/photo-1579027989536-b7b3f875ceea?w=900&q=80&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=900&q=80&auto=format&fit=crop',
  ],
  sushi: [
    'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=900&q=80&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1553621042-f6e147245754?w=900&q=80&auto=format&fit=crop',
  ],
  ramen: [
    'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=900&q=80&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1594212699903-ec524e3a456d?w=900&q=80&auto=format&fit=crop',
  ],
  rooftop: [
    'https://images.unsplash.com/photo-1514565131-fce0801e5785?w=900&q=80&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=900&q=80&auto=format&fit=crop',
  ],
  nightview: [
    'https://images.unsplash.com/photo-1542051841857-5f90071e7989?w=900&q=80&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=900&q=80&auto=format&fit=crop',
  ],
  music: [
    'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=900&q=80&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1415201364774-f6f0f293b086?w=900&q=80&auto=format&fit=crop',
  ],
  chill: [
    'https://images.unsplash.com/photo-1509048191087-dc4f030d9e71?w=900&q=80&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=900&q=80&auto=format&fit=crop',
  ],
  default: [
    'https://images.unsplash.com/photo-1542051841857-5f90071e7989?w=900&q=80&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=900&q=80&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1513407030344-c6b029d0d041?w=900&q=80&auto=format&fit=crop',
  ],
};

const CATEGORY_MAP = {
  bar: 'bar',
  wine: 'bar',
  cafe: 'cafe',
  food: 'food',
  rooftop: 'rooftop',
  nightview: 'nightview',
  music: 'music',
  chill: 'chill',
  nightlife: 'izakaya',
  walk: 'alley',
};

function hashId(id) {
  let h = 0;
  for (let i = 0; i < id.length; i += 1) h = (h << 5) - h + id.charCodeAt(i);
  return Math.abs(h);
}

export function getVibeImageFallbacks(vibe) {
  const cat = CATEGORY_MAP[vibe?.category] ?? 'default';
  const pool = CATEGORY_IMAGES[cat] ?? CATEGORY_IMAGES.default;
  const primary = vibe?.image;
  const rotated = [...pool.slice(hashId(vibe?.id ?? '') % pool.length), ...pool];
  return primary ? [primary, ...rotated.filter((u) => u !== primary)] : rotated;
}

export function getPrimaryVibeImage(vibe) {
  const fallbacks = getVibeImageFallbacks(vibe);
  return fallbacks[0];
}
