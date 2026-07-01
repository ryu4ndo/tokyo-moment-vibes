import { memo } from 'react';
import { motion } from 'framer-motion';
import { Bookmark, Calendar, Clock, MapPin, Star, Wallet } from 'lucide-react';
import {
  buildSpotMapUrl,
  getOpeningHours,
  getSpotAddress,
  getSpotImage,
  getSpotRating,
  getWalkMinutes,
} from '@/utils/displayUtils';
import { getReservationUrl, getReservationLinks } from '@/utils/spotLookup';
import { getGenreLabel } from '@/utils/spotUtils';
import { useLocale } from '@/locales/LocaleContext';

function StaticSpotMap({ spot }) {
  const url = buildSpotMapUrl(spot);
  if (!url) return null;

  return (
    <div className="rounded-2xl overflow-hidden border border-white/[0.06] mt-3">
      <iframe
        title={`${spot.name} map`}
        src={url}
        width="100%"
        height="120"
        style={{ border: 0 }}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
    </div>
  );
}

export const SpotCard = memo(function SpotCard({
  spot,
  previousSpot,
  saved = false,
  onToggleSave,
  delay = 0,
  showMap = true,
  experienceMode = 'local',
}) {
  const { t, locale } = useLocale();
  const walkMin = previousSpot ? getWalkMinutes(previousSpot, spot) : null;
  const reservationLinks = getReservationLinks(spot, { experienceMode, locale });
  const reservationUrl = reservationLinks[0]?.url ?? getReservationUrl(spot, { experienceMode, locale });

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay, ease: [0.22, 1, 0.36, 1] }}
      className="rounded-[28px] border border-white/[0.08] bg-white/[0.04] backdrop-blur-2xl overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.3)]"
    >
      <div className="relative h-48 sm:h-56">
        <img
          src={getSpotImage(spot)}
          alt={spot.name}
          loading="lazy"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        <div className="absolute top-4 right-4 flex gap-2">
          <span className="px-3 py-1 rounded-full bg-black/50 backdrop-blur-md border border-white/10 text-xs font-bold flex items-center gap-1">
            <Star className="w-3 h-3 text-amber-300 fill-amber-300" />
            {getSpotRating(spot)}
          </span>
          <button
            type="button"
            onClick={() => onToggleSave?.(spot.id)}
            className={`p-2 rounded-full backdrop-blur-md border transition ${
              saved
                ? 'bg-pink-500/30 border-pink-500/40 text-pink-200'
                : 'bg-black/50 border-white/10 text-white/70 hover:text-white'
            }`}
            aria-label={saved ? t('vibes.save') : t('vibes.save')}
          >
            <Bookmark className={`w-4 h-4 ${saved ? 'fill-current' : ''}`} />
          </button>
        </div>
        <div className="absolute bottom-4 left-4 right-4">
          <div className="flex flex-wrap gap-2 mb-2">
            <span className="px-2.5 py-1 rounded-full bg-white/10 backdrop-blur text-[10px] font-bold uppercase tracking-wider">
              {getGenreLabel(spot.category ?? spot.genre)}
            </span>
            <span className="px-2.5 py-1 rounded-full bg-pink-500/20 text-pink-200 text-[10px] font-bold">
              {spot.budget ?? spot.budgetLabel}
            </span>
          </div>
          <h3 className="text-xl font-bold">{spot.name}</h3>
        </div>
      </div>

      <div className="p-5 space-y-3">
        <p className="text-white/60 text-sm leading-relaxed">{spot.description}</p>

        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="flex items-center gap-2 text-white/50">
            <MapPin className="w-3.5 h-3.5 shrink-0" />
            <span>{getSpotAddress(spot)}</span>
          </div>
          <div className="flex items-center gap-2 text-white/50">
            <Clock className="w-3.5 h-3.5 shrink-0" />
            <span>{getOpeningHours(spot)}</span>
          </div>
          <div className="flex items-center gap-2 text-white/50">
            <Wallet className="w-3.5 h-3.5 shrink-0" />
            <span>{spot.budget ?? '¥¥'}</span>
          </div>
          {walkMin != null && (
            <div className="flex items-center gap-2 text-white/50">
              <span>
                🚶 {walkMin}{locale === 'en' ? ' min' : '分'}
              </span>
            </div>
          )}
        </div>

        {showMap && <StaticSpotMap spot={spot} />}

        {reservationUrl && (
          <a
            href={reservationUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 mt-2 px-4 py-2.5 rounded-full bg-white/[0.06] border border-white/[0.1] text-xs font-semibold hover:bg-white/10 transition"
          >
            <Calendar className="w-3.5 h-3.5" />
            {t('vibes.reserve')}
          </a>
        )}
      </div>
    </motion.article>
  );
});
