import { useState } from 'react';
import { getVibeImageFallbacks } from '@/utils/vibeImages';

export function VibeImage({ vibe, className, alt, loading = 'lazy' }) {
  const fallbacks = getVibeImageFallbacks(vibe);
  const [idx, setIdx] = useState(0);
  const src = fallbacks[Math.min(idx, fallbacks.length - 1)];

  return (
    <img
      src={src}
      alt={alt ?? vibe?.shopName ?? 'Tokyo moment'}
      loading={loading}
      decoding="async"
      onError={() => {
        if (idx < fallbacks.length - 1) setIdx((i) => i + 1);
      }}
      className={className}
    />
  );
}
