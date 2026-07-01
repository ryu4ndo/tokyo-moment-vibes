import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  Calendar,
  Clock,
  ExternalLink,
  Footprints,
  MapPin,
  Sparkles,
  Star,
  Wallet,
} from 'lucide-react';
import { getRelatedVibes, getVibeReason, getBestTime, getLocalTip } from '@/features/vibes/vibeFilters';
import { ENRICHED_VIBES } from '@/data/vibes';
import { localizeVibe, localizeVibes } from '@/features/vibes/localizeVibe';
import { fetchPlaceDetails } from '@/services/placesService';
import { getReservationLinks } from '@/services/reservationService';
import { VibeCard } from '@/features/vibes/VibeCard';
import { BookmarkButton } from '@/features/spots/BookmarkButton';
import { NeonButton } from '@/components/ui/NeonButton';
import { ReserveLinks } from '@/features/spots/ReserveLinks';
import { useLocale } from '@/locales/LocaleContext';
import { useAppState } from '@/contexts/AppStateContext';

function buildMapEmbedUrl(vibe, locale) {
  return `https://maps.google.com/maps?q=${vibe.lat},${vibe.lng}&hl=${locale === 'en' ? 'en' : 'ja'}&z=16&output=embed`;
}

function buildMapsNavigateUrl(vibe, locale) {
  const label = encodeURIComponent(vibe.shopName ?? vibe.name ?? '');
  return `https://www.google.com/maps/dir/?api=1&destination=${vibe.lat},${vibe.lng}&destination_place_id=&travelmode=walking&hl=${locale === 'en' ? 'en' : 'ja'}`;
}

export function VibeDetail({
  vibe,
  saved,
  onClose,
  onToggleSave,
  onCreatePlan,
  onSelectVibe,
}) {
  const { t, locale } = useLocale();
  const { experienceMode, companion, savedSpotIds } = useAppState();
  const videoRef = useRef(null);
  const [slideIndex, setSlideIndex] = useState(0);
  const [placeInfo, setPlaceInfo] = useState(null);
  const [loadingPlace, setLoadingPlace] = useState(false);
  const displayVibe = localizeVibe(vibe, { locale, experienceMode });
  const related = localizeVibes(
    getRelatedVibes(ENRICHED_VIBES, vibe, experienceMode, companion),
    { locale, experienceMode }
  );
  const aiReason = getVibeReason(vibe, experienceMode, locale);
  const bestTime = getBestTime(vibe, locale);
  const localTip = getLocalTip(vibe, locale);

  useEffect(() => {
    if (!vibe) return undefined;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, [vibe]);

  useEffect(() => {
    if (!vibe?.spotId) return;
    setLoadingPlace(true);
    fetchPlaceDetails({ spotId: vibe.spotId, fromArea: vibe.area, locale })
      .then((data) => setPlaceInfo(data.place))
      .catch(() => setPlaceInfo(null))
      .finally(() => setLoadingPlace(false));
  }, [vibe?.spotId, vibe?.area, locale]);

  useEffect(() => {
    if (!vibe?.isVideo) {
      const photos = placeInfo?.photos?.length
        ? placeInfo.photos
        : (vibe?.images ?? [vibe?.image]).filter(Boolean);
      const len = photos.length || 1;
      const timer = setInterval(() => setSlideIndex((i) => (i + 1) % len), 3500);
      return () => clearInterval(timer);
    }
    return undefined;
  }, [vibe, placeInfo?.photos]);

  useEffect(() => {
    if (vibe?.isVideo && videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
  }, [vibe]);

  if (!vibe) return null;

  const photos = placeInfo?.photos?.length
    ? placeInfo.photos
    : (vibe.images ?? [vibe.image]).filter(Boolean);

  const media = vibe.isVideo
    ? [{ type: 'video', src: vibe.videoUrl }]
    : photos.map((src) => ({ type: 'image', src }));

  const rating = placeInfo?.rating ?? vibe.rating;
  const reviewCount = placeInfo?.reviewCount ?? vibe.reviewCount;
  const walkMinutes = placeInfo?.walkMinutes ?? vibe.walkMinutes;
  const openingHours = placeInfo?.openingHours ?? vibe.openingHours;
  const isOpen = placeInfo?.openNow ?? vibe.isOpen;
  const reviews = placeInfo?.reviews?.length
    ? placeInfo.reviews
    : [{ author: locale === 'en' ? 'Visitor' : '来訪者', text: displayVibe.reviewSnippet, rating: 5 }];
  const mapsUrl = placeInfo?.googleMapsUrl ?? buildMapsNavigateUrl(vibe, locale);
  const areaLabel = placeInfo?.address ?? (locale === 'en' ? `${vibe.area}, Tokyo` : `東京都${vibe.area}`);
  const reserveLinks = placeInfo?.reservationLinks ?? getReservationLinks(
    { name: displayVibe.shopName, area: vibe.area, category: vibe.category, googleMapsUrl: mapsUrl },
    { experienceMode, locale }
  );

  const handlePrimaryReserve = () => {
    const url = reserveLinks[0]?.url;
    if (url) window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[80] bg-black overflow-y-auto"
    >
      <div className="relative min-h-full max-w-lg mx-auto">
        <div className="sticky top-0 z-20 flex items-center justify-between p-4 bg-gradient-to-b from-black/80 to-transparent">
          <button
            type="button"
            onClick={onClose}
            className="p-2.5 rounded-full bg-white/10 backdrop-blur-xl border border-white/10"
            aria-label={t('common.back')}
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <BookmarkButton saved={saved} onToggle={onToggleSave} />
        </div>

        <div className="relative -mt-14 aspect-[9/14] sm:aspect-[9/13] max-h-[70vh] overflow-hidden">
          <AnimatePresence mode="wait">
            {media[slideIndex]?.type === 'video' ? (
              <motion.video
                key="video"
                ref={videoRef}
                src={media[slideIndex].src}
                autoPlay
                muted
                loop
                playsInline
                className="absolute inset-0 w-full h-full object-cover"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              />
            ) : (
              <motion.img
                key={media[slideIndex]?.src ?? vibe.image}
                src={media[slideIndex]?.src ?? vibe.image}
                alt={vibe.shopName}
                className="absolute inset-0 w-full h-full object-cover"
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6 }}
              />
            )}
          </AnimatePresence>
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/30" />

          {loadingPlace && (
            <div className="absolute top-20 right-4 px-2 py-1 rounded-full bg-black/50 text-[10px] text-white/60">
              {t('vibes.loadingPlace')}
            </div>
          )}

          <div className="absolute bottom-0 left-0 right-0 p-6">
            <span className="px-2.5 py-1 rounded-full bg-pink-500/30 border border-pink-500/40 text-[10px] font-bold mb-2 inline-block">
              {t(`categories.${vibe.category}`)}
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold mb-1">{displayVibe.shopName}</h1>
            <p className="text-white/50 text-sm">{displayVibe.vibeName} · {vibe.area}</p>
          </div>

          {!vibe.isVideo && media.length > 1 && (
            <div className="absolute bottom-24 left-0 right-0 flex justify-center gap-1.5">
              {media.map((_, i) => (
                <button
                  key={`dot-${i}`}
                  type="button"
                  onClick={() => setSlideIndex(i)}
                  className={`w-1.5 h-1.5 rounded-full transition ${
                    i === slideIndex ? 'bg-white w-4' : 'bg-white/40'
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        <div className="px-5 pb-10 space-y-6 -mt-4 relative z-10">
          <div className="rounded-[24px] border border-white/[0.08] bg-white/[0.04] backdrop-blur-2xl p-5">
            <div className="flex flex-wrap gap-3 mb-4 text-sm">
              <span className="flex items-center gap-1.5 text-amber-300 font-bold">
                <Star className="w-4 h-4 fill-amber-300" />
                {rating} ({reviewCount})
              </span>
              <span className="flex items-center gap-1.5 text-white/60">
                <Footprints className="w-4 h-4" />
                {walkMinutes} {t('common.minWalk')}
              </span>
              <span className="flex items-center gap-1.5 text-white/60">
                <Wallet className="w-4 h-4" />
                {vibe.priceRange}
              </span>
              <span className={`font-semibold ${isOpen ? 'text-emerald-300' : 'text-white/40'}`}>
                {isOpen ? t('common.open') : t('common.closed')}
              </span>
            </div>

            <div className="flex items-start gap-2 mb-4 p-3 rounded-2xl bg-purple-500/10 border border-purple-500/20">
              <Sparkles className="w-4 h-4 text-pink-300 shrink-0 mt-0.5" />
              <div>
                <p className="text-[10px] font-bold tracking-wider text-pink-300/80 uppercase mb-1">
                  {t('vibes.aiReason')}
                </p>
                <p className="text-sm text-white/80 leading-relaxed">{aiReason}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 text-sm mb-5">
              <div className="flex items-center gap-2 text-white/60">
                <Clock className="w-4 h-4 shrink-0" />
                <span>{openingHours}</span>
              </div>
              <div className="flex items-center gap-2 text-white/60">
                <MapPin className="w-4 h-4 shrink-0" />
                <span>{areaLabel}</span>
              </div>
              <div className="rounded-xl bg-white/[0.03] border border-white/[0.06] p-3 text-xs text-white/55">
                <p className="font-bold text-white/70 mb-1">{t('vibes.bestTime')}: {bestTime}</p>
                <p>{t('vibes.localTip')}: {localTip}</p>
              </div>
            </div>

            <div className="rounded-2xl overflow-hidden border border-white/[0.06] mb-3">
              <iframe
                title={`${vibe.shopName} map`}
                src={buildMapEmbedUrl(vibe, locale)}
                width="100%"
                height="160"
                style={{ border: 0 }}
                loading="lazy"
              />
            </div>

            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 mb-5 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-sm text-white/70 hover:bg-white/[0.08] transition"
            >
              <ExternalLink className="w-4 h-4" />
              {t('vibes.openInMaps')}
            </a>

            <div className="mb-5 space-y-3">
              <p className="text-[10px] font-bold tracking-wider text-white/35 uppercase">
                {t('vibes.reviews')}
              </p>
              {reviews.slice(0, 3).map((review, i) => (
                <div key={`review-${i}`} className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-xs font-semibold text-white/70">{review.author}</p>
                    <span className="text-amber-300 text-xs flex items-center gap-0.5">
                      <Star className="w-3 h-3 fill-amber-300" />
                      {review.rating}
                    </span>
                  </div>
                  <p className="text-sm text-white/60 leading-relaxed line-clamp-3">
                    &ldquo;{review.text}&rdquo;
                  </p>
                </div>
              ))}
            </div>

            {displayVibe.experienceTags?.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-5">
                {displayVibe.experienceTags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2.5 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-xs text-purple-200"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            <ReserveLinks spot={vibe} placeInfo={placeInfo} experienceMode={experienceMode} />

            <div className="grid gap-3 mt-5">
              <NeonButton onClick={() => onCreatePlan?.(vibe)}>
                {t('vibes.createPlan')}
              </NeonButton>
              <div className="grid grid-cols-2 gap-3">
                <NeonButton variant="ghost" className="!text-white" onClick={handlePrimaryReserve}>
                  <span className="flex items-center justify-center gap-2">
                    <Calendar className="w-4 h-4" />
                    {t('vibes.reserve')}
                  </span>
                </NeonButton>
                <NeonButton variant="ghost" className="!text-white" onClick={onToggleSave}>
                  {t('vibes.save')}
                </NeonButton>
              </div>
            </div>
          </div>

          {related.length > 0 && (
            <>
              <section>
                <h2 className="text-base font-semibold mb-4 text-white/80">
                  {t('vibes.nearby')}
                </h2>
                <div className="flex gap-4 overflow-x-auto pb-4 -mx-5 px-5 scrollbar-hide">
                  {related.slice(0, 3).map((item, index) => (
                    <div key={item.id} className="shrink-0 w-[180px]">
                      <VibeCard
                        vibe={{ ...item, cardSize: 'compact', cardAspect: 'aspect-[3/4]' }}
                        saved={savedSpotIds.includes(item.spotId)}
                        onSelect={onSelectVibe}
                        delay={index * 0.05}
                        experienceMode={experienceMode}
                        companion={companion}
                      />
                    </div>
                  ))}
                </div>
              </section>

              {related.length > 3 && (
                <section>
                  <h2 className="text-base font-semibold mb-4 text-white/80">
                    {t('vibes.goNext')}
                  </h2>
                  <div className="flex gap-4 overflow-x-auto pb-4 -mx-5 px-5 scrollbar-hide">
                    {related.slice(3, 6).map((item, index) => (
                      <div key={item.id} className="shrink-0 w-[180px]">
                        <VibeCard
                          vibe={{ ...item, cardSize: 'compact', cardAspect: 'aspect-[3/4]' }}
                          saved={savedSpotIds.includes(item.spotId)}
                          onSelect={onSelectVibe}
                          delay={index * 0.05}
                          experienceMode={experienceMode}
                          companion={companion}
                        />
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
}
