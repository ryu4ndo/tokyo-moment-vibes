function interestMatchesVibe(interestId, vibe) {
  const cat = vibe.category;
  switch (interestId) {
    case 'nightlife':
      return ['bar', 'music', 'nightview'].includes(cat);
    case 'cafe':
      return ['cafe', 'chill'].includes(cat);
    case 'izakaya':
      return ['food', 'bar'].includes(cat);
    case 'nightview':
      return ['nightview', 'rooftop'].includes(cat);
    case 'date':
      return vibe.suitableFor?.includes('date');
    case 'local':
      return vibe.experienceModes?.includes('local') || vibe.experienceModes?.includes('hidden');
    case 'travel':
      return vibe.experienceModes?.some((m) => ['traveler', 'classic'].includes(m));
    case 'foodwalk':
      return ['food', 'cafe'].includes(cat);
    case 'culture':
      return ['music', 'chill', 'nightview'].includes(cat);
    case 'walk':
      return vibe.walkMinutes <= 12;
    case 'budget':
      return vibe.priceRange === '¥' || vibe.priceRange === '¥¥';
    case 'premium':
      return vibe.priceRange === '¥¥¥' || vibe.priceRange === '¥¥¥¥';
    default:
      return cat === interestId;
  }
}

/** Boost score based on learned profile — recent trends weighted higher */
export function applyProfileBoost(baseScore, item, profile) {
  if (!profile?.hasData && !profile?.activeInterests?.length) return baseScore;
  let score = baseScore;

  const category = item.category;
  const area = item.area;

  for (const { id, weight } of profile.topCategories ?? []) {
    if (id === category) score += weight * 8;
  }

  for (const { id, weight } of profile.topAreas ?? []) {
    if (id === area) score += weight * 10;
  }

  if (profile.recentTrend && profile.recentTrend === category) {
    score += 22;
  }

  for (const interestId of profile.activeInterests ?? []) {
    if (interestMatchesVibe(interestId, item)) score += 6;
  }

  if (profile.walkPreference && (item.walkMinutes ?? 5) <= profile.walkPreference + 3) {
    score += 5;
  }

  if (profile.budgetYen && item.priceRange) {
    const priceMap = { '¥': 1500, '¥¥': 3500, '¥¥¥': 7000, '¥¥¥¥': 12000 };
    const diff = Math.abs((priceMap[item.priceRange] ?? 3500) - profile.budgetYen);
    if (diff < 1500) score += 8;
  }

  if (profile.localVsMainstream === 'local' && item.experienceModes?.includes('hidden')) {
    score += 12;
  }

  if (profile.companionTendency === 'couple' && item.suitableFor?.includes('date')) {
    score += 10;
  }

  return score;
}
