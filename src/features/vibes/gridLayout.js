/** Assign Pinterest-style card sizes for the vibes grid */
export function assignGridLayout(vibes) {
  return vibes.map((vibe, index) => {
    if (vibe.isVideo) {
      return { ...vibe, cardSize: 'video', cardAspect: 'aspect-[3/4]' };
    }
    if (index % 6 === 0) {
      return { ...vibe, cardSize: 'tall', cardAspect: 'aspect-[2/3]' };
    }
    if (index % 9 === 0) {
      return { ...vibe, cardSize: 'large', cardAspect: 'aspect-[4/5]' };
    }
    if (index % 4 === 0) {
      return { ...vibe, cardSize: 'normal', cardAspect: 'aspect-[3/5]' };
    }
    return { ...vibe, cardSize: 'normal', cardAspect: 'aspect-[3/4]' };
  });
}
