export const COMPANIONS = [
  { id: 'solo', icon: '👤', categories: ['cafe', 'chill', 'bar'] },
  { id: 'couple', icon: '💑', categories: ['rooftop', 'nightview', 'bar'] },
  { id: 'friends', icon: '👥', categories: ['food', 'music', 'bar'] },
  { id: 'family', icon: '👨‍👩‍👧', categories: ['food', 'cafe'] },
  { id: 'business', icon: '💼', categories: ['cafe', 'bar'] },
  { id: 'backpacker', icon: '🎒', categories: ['food', 'bar', 'nightview'] },
];

export const DEFAULT_COMPANION = 'solo';

export function getCompanionCategories(companionId) {
  return COMPANIONS.find((c) => c.id === companionId)?.categories ?? [];
}
