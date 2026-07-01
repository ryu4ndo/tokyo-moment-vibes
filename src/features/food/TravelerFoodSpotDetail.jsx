import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Clock, ExternalLink, MapPin, Star, X } from 'lucide-react';
import { fetchPlaceDetails } from '@/services/placesService';
import { ReserveLinks } from '@/features/spots/ReserveLinks';
import { BookmarkButton } from '@/features/spots/BookmarkButton';
import { getAreaLabel } from '@/data/areas';
import {
  buildSpotMapUrl,
  getOpeningHours,
  getSpotAddress,
  getSpotImage,
  getSpotRating,
} from '@/utils/displayUtils';
import { useLocale } from '@/locales/LocaleContext';
import { useAppState } from '@/contexts/AppStateContext';

export function TravelerFoodSpotDetail({ spot, foodId, onClose, saved, onToggleSave }) {
  const { t, locale } = useLocale();
  const { experienceMode } = useAppState();
  const [placeInfo, setPlaceInfo] = useState(null);
  const [loadingPlace, setLoadingPlace] = useState(false);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  useEffect(() => {
    if (!spot?.id) return;
    setLoadingPlace(true);
    fetchPlaceDetails({ spotId: spot.id, fromArea: spot.area, locale })
      .then((data) => setPlaceInfo(data.place))
      .catch(() => setPlaceInfo(null))
      .finally(() => setLoadingPlace(false));
  }, [spot?.id, spot?.area, locale]);

  const photos = placeInfo?.photos?.length ? placeInfo.photos : [getSpotImage(spot)];
  const mapUrl =
    placeInfo?.googleMapsUrl ??
    buildSpotMapUrl(spot) ??
    `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${spot.name} ${spot.area} Tokyo`)}`;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', damping: 28, stiffness: 280 }}
          onClick={(e) => e.stopPropagation()}
          className="absolute inset-x-0 bottom-0 top-12 sm:top-16 mx-auto max-w-2xl bg-[#0a0a12] rounded-t-[28px] border border-white/[0.08] overflow-y-auto max-h-[92vh] shadow-2xl"
        >
          <div className="sticky top-0 z-10 flex items-center justify-between p-4 bg-[#0a0a12]/90 backdrop-blur-xl border-b border-white/[0.06]">
            <button type="button" onClick={onClose} className="p-2 rounded-full hover:bg-white/10">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <span className="text-xs font-medium text-white/50">{t('travelerFood.spotDetail')}</span>
            <button type="button" onClick={onClose} className="p-2 rounded-full hover:bg-white/10">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="relative aspect-[16/10]">
            <img src={photos[0]} alt={spot.name} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a12] via-transparent to-transparent" />
            <div className="absolute top-4 right-4">
              <BookmarkButton saved={saved} onToggle={onToggleSave} />
            </div>
            <div className="absolute bottom-4 left-5 right-5">
              <h2 className="text-2xl font-bold mb-1">{spot.name}</h2>
              <p className="text-sm text-white/50">{getAreaLabel(spot.area, locale)}</p>
            </div>
          </div>

          <div className="p-5 space-y-5">
            <div className="flex flex-wrap gap-3 text-sm">
              <span className="flex items-center gap-1 text-amber-200/90 font-medium">
                <Star className="w-4 h-4 fill-amber-200/90" />
                {placeInfo?.rating ?? spot.rating ?? getSpotRating(spot)}
              </span>
              <span className="text-white/45">{spot.budget}</span>
              {placeInfo?.reviewCount != null && (
                <span className="text-white/45">
                  {placeInfo.reviewCount} {t('vibes.reviews')}
                </span>
              )}
            </div>

            {spot.aiReason && (
              <div className="rounded-2xl border border-pink-400/20 bg-pink-500/10 p-4">
                <p className="text-[9px] font-bold tracking-wider text-pink-200/60 uppercase mb-1">
                  {t('vibes.whyAiPicked')}
                </p>
                <p className="text-sm text-white/70">{spot.aiReason}</p>
              </div>
            )}

            <p className="text-sm text-white/60 leading-relaxed">
              {placeInfo?.description ?? spot.description}
            </p>

            <div className="grid gap-2 text-sm text-white/50">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{placeInfo?.address ?? getSpotAddress(spot)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 shrink-0" />
                <span>
                  {loadingPlace
                    ? t('vibes.loadingPlace')
                    : placeInfo?.openingHours ?? getOpeningHours(spot)}
                </span>
              </div>
            </div>

            {photos.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {photos.slice(1, 5).map((url, i) => (
                  <img
                    key={url}
                    src={url}
                    alt=""
                    className="shrink-0 w-24 h-24 rounded-xl object-cover"
                  />
                ))}
              </div>
            )}

            <ReserveLinks
              spot={spot}
              placeInfo={placeInfo}
              experienceMode={experienceMode}
            />

            <a
              href={mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-3.5 rounded-2xl bg-white/[0.06] border border-white/[0.1] font-semibold text-sm hover:bg-white/10 transition"
            >
              <ExternalLink className="w-4 h-4" />
              {t('vibes.openInMaps')}
            </a>

            {placeInfo?.reviews?.length > 0 && (
              <section>
                <h4 className="text-sm font-bold mb-3">{t('vibes.reviews')}</h4>
                <div className="space-y-3">
                  {placeInfo.reviews.slice(0, 3).map((review, i) => (
                    <div key={i} className="rounded-xl bg-white/[0.03] border border-white/[0.06] p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-medium">{review.author}</span>
                        <span className="text-amber-200/80 text-xs">★ {review.rating}</span>
                      </div>
                      <p className="text-xs text-white/50 line-clamp-3">{review.text}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
