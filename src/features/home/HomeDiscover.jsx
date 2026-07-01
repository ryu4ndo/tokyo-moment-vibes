import { motion } from 'framer-motion';
import { CloudRain, Flame, Heart, History, MapPin, Sparkles, TrendingUp } from 'lucide-react';
import { VibeImage } from '@/components/ui/VibeImage';
import { getAreaLabel } from '@/data/areas';
import { getMomentLabel } from '@/data/moments';
import { useLocale } from '@/locales/LocaleContext';

function SectionHeader({ icon: Icon, title, subtitle }) {
  return (
    <div className="flex items-center gap-2 mb-3 px-1">
      {Icon && <Icon className="w-4 h-4 text-pink-300/70" />}
      <div>
        <h3 className="text-sm font-bold text-white/85">{title}</h3>
        {subtitle && <p className="text-[10px] text-white/35">{subtitle}</p>}
      </div>
    </div>
  );
}

function MiniVibeCard({ vibe, onSelect, delay = 0 }) {
  const { t } = useLocale();
  return (
    <motion.article
      initial={{ opacity: 0, x: 12 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ delay }}
      whileHover={{ y: -3 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onSelect?.(vibe)}
      className="shrink-0 w-[200px] cursor-pointer rounded-[18px] overflow-hidden border border-white/[0.06] bg-white/[0.03] hover:border-white/[0.12] transition-all group"
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onSelect?.(vibe)}
    >
      <div className="relative aspect-[4/5]">
        <VibeImage
          vibe={vibe}
          alt={vibe.shopName}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.05]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />
        <div className="absolute bottom-3 left-3 right-3">
          <p className="font-semibold text-[13px] leading-tight line-clamp-2">{vibe.shopName}</p>
          <p className="text-[9px] text-white/45 mt-1">{vibe.area}</p>
        </div>
      </div>
      <p className="px-3 py-2 text-[10px] text-white/45 line-clamp-1 border-t border-white/[0.05]">
        {t('vibes.whyAiPicked')}: {vibe.aiComment?.slice?.(0, 40) ?? vibe.reviewSnippet?.slice?.(0, 40) ?? '—'}
      </p>
    </motion.article>
  );
}

function FeaturedPick({ vibe, onSelect }) {
  const { t } = useLocale();
  if (!vibe) return null;
  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      onClick={() => onSelect?.(vibe)}
      className="relative cursor-pointer rounded-[22px] overflow-hidden border border-white/[0.08] shadow-premium group"
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onSelect?.(vibe)}
    >
      <div className="relative aspect-[21/9] min-h-[160px]">
        <VibeImage
          vibe={vibe}
          alt={vibe.shopName}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-[900ms] group-hover:scale-[1.03]"
        />
        <div className="absolute inset-0 vibe-gradient-overlay" />
        <span className="absolute top-4 left-4 px-3 py-1 rounded-full glass-panel text-[10px] font-bold text-pink-200 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5" />
          {t('home.todayPick')}
        </span>
        <div className="absolute bottom-4 left-4 right-4">
          <h4 className="text-xl font-semibold mb-1">{vibe.shopName}</h4>
          <p className="text-xs text-white/55">{vibe.area} · ★ {vibe.rating}</p>
        </div>
      </div>
    </motion.article>
  );
}

function TrendingChips({ tags }) {
  if (!tags?.length) return null;
  return (
    <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide -mx-1 px-1">
      {tags.map((tag) => (
        <span
          key={tag}
          className="shrink-0 px-3 py-1.5 rounded-full glass-panel text-[11px] font-medium text-white/60"
        >
          {tag}
        </span>
      ))}
    </div>
  );
}

function HorizontalVibes({ items, onSelectVibe }) {
  if (!items?.length) return null;
  return (
    <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide -mx-1 px-1">
      {items.map((vibe, i) => (
        <MiniVibeCard key={vibe.id} vibe={vibe} onSelect={onSelectVibe} delay={i * 0.04} />
      ))}
    </div>
  );
}

export function HomeDiscover({
  discover,
  continueMomentId,
  onSelectVibe,
  onContinueJourney,
  onGoToVibes,
  onGoToSaved,
}) {
  const { t, locale } = useLocale();

  if (!discover) return null;

  return (
    <div className="space-y-8">
      {continueMomentId && (
        <section>
          <SectionHeader icon={History} title={t('home.continueJourney')} />
          <motion.button
            type="button"
            whileTap={{ scale: 0.98 }}
            onClick={onContinueJourney}
            className="w-full text-left rounded-[20px] border border-cyan-400/25 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 p-4 hover:border-cyan-400/40 transition"
          >
            <p className="text-sm font-semibold text-cyan-100">{getMomentLabel(continueMomentId, locale)}</p>
            <p className="text-[11px] text-white/45 mt-1">{t('home.continueJourneySub')}</p>
          </motion.button>
        </section>
      )}

      {discover.todayPick && (
        <section>
          <SectionHeader icon={Sparkles} title={t('home.todayPick')} />
          <FeaturedPick vibe={discover.todayPick} onSelect={onSelectVibe} />
        </section>
      )}

      <section>
        <SectionHeader icon={TrendingUp} title={t('home.trending')} subtitle={t('home.trendingSub')} />
        <TrendingChips tags={discover.trending} />
      </section>

      {discover.weatherPicks?.length > 0 && (
        <section>
          <SectionHeader icon={CloudRain} title={t('home.weatherPicks')} />
          <HorizontalVibes items={discover.weatherPicks} onSelectVibe={onSelectVibe} />
        </section>
      )}

      {discover.popularTonight?.length > 0 && (
        <section>
          <SectionHeader icon={Flame} title={t('home.popularTonight')} />
          <HorizontalVibes items={discover.popularTonight} onSelectVibe={onSelectVibe} />
        </section>
      )}

      {discover.savedMoments?.length > 0 && (
        <section>
          <SectionHeader icon={Heart} title={t('home.savedMoments')} />
          <HorizontalVibes items={discover.savedMoments} onSelectVibe={onSelectVibe} />
          <button
            type="button"
            onClick={onGoToSaved}
            className="mt-2 text-[11px] text-pink-300/70 hover:text-pink-200 px-1"
          >
            {t('home.viewAllSaved')} →
          </button>
        </section>
      )}

      {discover.recentlyViewed?.length > 0 && (
        <section>
          <SectionHeader icon={History} title={t('home.recentlyViewed')} />
          <HorizontalVibes items={discover.recentlyViewed} onSelectVibe={onSelectVibe} />
        </section>
      )}

      {discover.areaVibes?.length > 0 && (
        <section>
          <SectionHeader
            icon={MapPin}
            title={t('home.nearYou')}
            subtitle={getAreaLabel(discover.areaVibes[0]?.area, locale)}
          />
          <HorizontalVibes items={discover.areaVibes} onSelectVibe={onSelectVibe} />
        </section>
      )}

      <motion.button
        type="button"
        whileTap={{ scale: 0.98 }}
        onClick={onGoToVibes}
        className="w-full py-4 rounded-[20px] border border-white/[0.08] bg-white/[0.03] text-sm font-medium text-white/60 hover:text-white/85 hover:border-white/15 transition"
      >
        {t('home.exploreVibes')} →
      </motion.button>
    </div>
  );
}
