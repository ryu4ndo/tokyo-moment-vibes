const SIZE_PATTERN = [
  { cardSize: 'large', cardAspect: 'aspect-[2/3]' },
  { cardSize: 'small', cardAspect: 'aspect-square' },
  { cardSize: 'medium', cardAspect: 'aspect-[4/5]' },
  { cardSize: 'medium', cardAspect: 'aspect-[3/4]' },
  { cardSize: 'small', cardAspect: 'aspect-[5/6]' },
  { cardSize: 'wide', cardAspect: 'aspect-[5/4]' },
  { cardSize: 'medium', cardAspect: 'aspect-[3/4]' },
  { cardSize: 'large', cardAspect: 'aspect-[2/3]' },
  { cardSize: 'small', cardAspect: 'aspect-square' },
  { cardSize: 'medium', cardAspect: 'aspect-[4/5]' },
];

/** Assign mixed Pinterest / Instagram Explore card sizes */
export function assignGridLayout(vibes) {
  return vibes.map((vibe, index) => {
    if (vibe.mediaType === 'video' || vibe.isVideo) {
      return { ...vibe, cardSize: 'video', cardAspect: 'aspect-[3/5]' };
    }
    if (vibe.rating >= 4.85 && index % 3 !== 1) {
      return { ...vibe, cardSize: 'large', cardAspect: 'aspect-[2/3]' };
    }
    const pattern = SIZE_PATTERN[index % SIZE_PATTERN.length];
    return { ...vibe, ...pattern };
  });
}
