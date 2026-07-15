import { useCallback, useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Clock,
  ExternalLink,
  MapPin,
  Share2,
  Sparkles,
  Star,
  Users,
  Wallet,
} from 'lucide-react';
import { getCategoryAccent } from '@/data/accentColors';
import { localizeVibe } from '@/features/vibes/localizeVibe';
import { getCrowdPercent, getSpotIntroduction } from '@/features/vibes/vibeDetailHelpers';
import { fetchPlaceDetails } from '@/services/placesService';
import { VibeDetailHero } from '@/features/vibes/detail/VibeDetailHero';
import { AiJourneySection } from '@/features/vibes/detail/AiJourneySection';
import { BookmarkButton } from '@/features/spots/BookmarkButton';
import { NeonButton } from '@/components/ui/NeonButton';
import { useLocale } from '@/locales/LocaleContext';
import { useAppState } from '@/contexts/AppStateContext';
import { getRelatedVibes } from '@/features/vibes/getRelatedVibes';
import { useAiProfile } from '@/contexts/AiProfileContext';
import { ExploreVibeCard } from '@/features/vibes/ExploreVibeCard';

function buildMapEmbedUrl(vibe, locale) {
  return `https://maps.google.com/maps?q=${vibe.lat},${vibe.lng}&hl=${locale === 'en' ? 'en' : 'ja'}&z=16&output=embed`;
}

function buildMapsNavigateUrl(vibe, locale) {
  return `https://www.google.com/maps/dir/?api=1&destination=${vibe.lat},${vibe.lng}&travelmode=walking&hl=${locale === 'en' ? 'en' : 'ja'}`;
}

function SectionTitle({ children, accent }) {
  return (
    <h2 className={`text-caption ${accent?.text ?? 'text-white/40'}`}>{children}</h2>
  );
}

export function VibeDetail({
  vibe,
  saved,
  onClose,
  onToggleSave,
  onCreatePlan,
  onSelectVibe,
  onAddJourneyToPlan,
}) {
  const { t, locale } = useLocale();
  const { experienceMode, companion, savedSpotIds, toggleSaveSpot } = useAppState();
  const { profile } = useAiProfile();
  const [slideIndex, setSlideIndex] = useState(0);
  const [placeInfo, setPlaceInfo] = useState(null);
  const [loadingPlace, setLoadingPlace] = useState(false);
  const [shareNotice, setShareNotice] = useState(false);

  const displayVibe = localizeVibe(vibe, { locale, experienceMode });
  const accent = getCategoryAccent(vibe.category);
  const aiAccent = getCategoryAccent('ai');

  const intro = getSpotIntroduction(vibe, experienceMode, companion, locale);

  useEffect(() => {
    if (!vibe) return undefined;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, [vibe]);

  useEffect(() => {
    setSlideIndex(0);
    setPlaceInfo(null);
  }, [vibe?.id]);

  useEffect(() => {
    if (!vibe?.spotId) return;
    setLoadingPlace(true);
    fetchPlaceDetails({ spotId: vibe.spotId, fromArea: vibe.area, locale })
      .then((data) => setPlaceInfo(data.place))
      .catch(() => setPlaceInfo(null))
      .finally(() => setLoadingPlace(false));
  }, [vibe?.spotId, vibe?.area, locale]);

  useEffect(() => {
    if (vibe?.isVideo) return undefined;
    const photos = placeInfo?.photos?.length
      ? placeInfo.photos
      : (vibe?.images ?? [vibe?.image]).filter(Boolean);
    const len = photos.length || 1;
    const timer = setInterval(() => setSlideIndex((i) => (i + 1) % len), 5000);
    return () => clearInterval(timer);
  }, [vibe, placeInfo?.photos]);

  const handleShare = useCallback(async () => {
    const mapsUrl = placeInfo?.googleMapsUrl ?? buildMapsNavigateUrl(vibe, locale);
    const payload = {
      title: displayVibe.shopName,
      text: intro.headline,
      url: mapsUrl,
    };
    try {
      if (navigator.share) {
        await navigator.share(payload);
      } else {
        await navigator.clipboard.writeText(`${payload.title}\n${payload.text}\n${mapsUrl}`);
        setShareNotice(true);
        setTimeout(() => setShareNotice(false), 2000);
      }
    } catch {
      /* cancelled */
    }
  }, [displayVibe.shopName, intro.headline, locale, placeInfo?.googleMapsUrl, vibe]);

  const relatedVibes = useMemo(() => {
    if (!vibe) return [];
    return getRelatedVibes(vibe, { profile, experienceMode }).map((v) =>
      localizeVibe(v, { locale, experienceMode }),
    );
  }, [vibe, profile, experienceMode, locale]);

  if (!vibe) return null;

  const photos = placeInfo?.photos?.length
    ? placeInfo.photos
    : (vibe.images ?? [vibe.image]).filter(Boolean);

  const media = vibe.isVideo
    ? [{ type: 'video', src: vibe.videoUrl }]
    : photos.map((src) => ({ type: 'image', src }));

  const rating = placeInfo?.rating ?? vibe.rating;
  const reviewCount = placeInfo?.reviewCount ?? vibe.reviewCount;
  const openingHours = placeInfo?.openingHours ?? vibe.openingHours;
  const isOpen = placeInfo?.openNow ?? vibe.isOpen;
  const mapsUrl = placeInfo?.googleMapsUrl ?? buildMapsNavigateUrl(vibe, locale);
  const areaLabel = placeInfo?.address ?? (locale === 'en' ? `${vibe.area}, Tokyo` : `東京都${vibe.area}`);
  const crowdLevel = vibe.crowdLevel ?? 'moderate';
  const crowdPercent = getCrowdPercent(crowdLevel);
  const reviewSummary =
    placeInfo?.reviews?.length > 1
      ? (locale === 'en'
          ? `Guests love the ${vibe.category} vibe here — ${placeInfo.reviews[0]?.text?.slice(0, 80)}…`
          : `多くのゲストが${vibe.category}の雰囲気を高く評価 — ${placeInfo.reviews[0]?.text?.slice(0, 40)}…`)
      : placeInfo?.reviews?.[0]?.text ??
    displayVibe.reviewSnippet ??
    (locale === 'en' ? displayVibe.reviewSnippetTravelerEn : displayVibe.reviewSnippetLocalJa) ??
    displayVibe.reviewSnippet;

  const tags = [
    t(`categories.${vibe.category}`),
    vibe.area,
    vibe.priceRange,
    ...(displayVibe.experienceTags ?? []).slice(0, 3),
  ].filter(Boolean);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[80] bg-black overflow-y-auto overscroll-contain"
    >
      <div className="relative max-w-lg mx-auto bg-black">
        <div className="sticky top-0 z-30 flex items-center justify-between px-5 py-4 bg-black/70 backdrop-blur-2xl">
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full bg-white/[0.06] hover:bg-white/[0.1] transition"
            aria-label={t('common.back')}
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleShare}
              className="p-2 rounded-full bg-white/[0.06] hover:bg-white/[0.1] transition"
              aria-label={t('vibes.share')}
            >
              <Share2 className="w-[18px] h-[18px]" />
            </button>
            <BookmarkButton saved={saved} onToggle={onToggleSave} />
          </div>
        </div>

        {shareNotice && (
          <div className="fixed top-16 left-1/2 -translate-x-1/2 z-[95] px-4 py-2 rounded-full bg-white text-black text-xs font-semibold">
            {t('vibes.shareCopied')}
          </div>
        )}

        <VibeDetailHero
          media={media}
          slideIndex={slideIndex}
          onSlideChange={setSlideIndex}
          loadingPlace={loadingPlace}
          loadingLabel={t('vibes.loadingPlace')}
        />

        <div className="px-5 sm:px-6 pt-10 pb-16 space-y-12">
          {/* スポット情報 */}
          <section className="space-y-5">
            <div>
              <p className={`text-caption mb-2 ${accent.text}`}>
                {t(`categories.${vibe.category}`)} · {vibe.area}
              </p>
              <h1 className="text-2xl sm:text-[1.75rem] font-semibold tracking-tight leading-tight text-white">
                {displayVibe.shopName}
              </h1>
              <div className="flex items-center gap-2 mt-3 text-sm">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span className="font-medium text-white">{rating}</span>
                <span className="text-white/25">·</span>
                <span className="text-white/45">
                  {reviewCount}
                  {locale === 'en' ? ' reviews' : '件'}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {[
                { icon: Wallet, label: t('vibes.priceRange'), value: vibe.priceRange },
                { icon: Clock, label: t('vibes.hours'), value: openingHours, sub: isOpen ? t('common.open') : t('common.closed'), subColor: isOpen ? 'text-emerald-400' : 'text-white/35' },
                { icon: Users, label: t('vibes.crowdLabel'), value: t(`vibes.crowd.${crowdLevel}`), bar: crowdPercent },
              ].map(({ icon: Icon, label, value, sub, subColor, bar }) => (
                <div key={label} className="rounded-[16px] bg-white/[0.03] border border-white/[0.05] p-3.5">
                  <Icon className="w-3.5 h-3.5 text-white/30 mb-2" />
                  <p className="text-[9px] font-semibold uppercase tracking-wider text-white/30 mb-1">{label}</p>
                  <p className="text-sm font-semibold text-white leading-tight">{value}</p>
                  {sub && <p className={`text-[10px] mt-0.5 ${subColor}`}>{sub}</p>}
                  {bar != null && (
                    <div className="h-0.5 rounded-full bg-white/10 mt-2 overflow-hidden">
                      <div className={`h-full rounded-full bg-gradient-to-r ${accent.gradient}`} style={{ width: `${bar}%` }} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* AIコメント */}
          <section className="rounded-[20px] gradient-border-ai p-6 space-y-4">
            <div className="flex items-center gap-2">
              <Sparkles className={`w-4 h-4 ${aiAccent.text}`} />
              <SectionTitle accent={aiAccent}>{t('vibes.aiIntro')}</SectionTitle>
            </div>
            <p className="text-lg font-medium leading-relaxed text-white tracking-tight">
              {intro.headline}
            </p>
            <p className="text-sm text-body">{intro.detail}</p>
          </section>

          {/* タグ */}
          <section className="space-y-4">
            <SectionTitle accent={accent}>{locale === 'en' ? 'Tags' : 'タグ'}</SectionTitle>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-medium ${accent.bg} ${accent.border} border ${accent.text}`}
                >
                  {tag}
                </span>
              ))}
            </div>
          </section>

          {/* レビューAI要約 */}
          {reviewSummary && (
            <section className="space-y-4">
              <SectionTitle>{locale === 'en' ? 'Review summary' : 'レビューAI要約'}</SectionTitle>
              <blockquote className="text-base text-white/70 leading-relaxed font-light border-l-2 border-white/10 pl-4">
                &ldquo;{reviewSummary}&rdquo;
              </blockquote>
            </section>
          )}

          {/* 写真ギャラリー */}
          {photos.length > 1 && (
            <section className="space-y-4">
              <SectionTitle>{locale === 'en' ? 'Gallery' : '写真ギャラリー'}</SectionTitle>
              <div className="flex gap-2.5 overflow-x-auto pb-1 scrollbar-hide -mx-1 px-1">
                {photos.map((src, i) => (
                  <div
                    key={src}
                    className="shrink-0 w-36 h-48 rounded-[16px] overflow-hidden bg-[#111]"
                  >
                    <img src={src} alt="" loading="lazy" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* 地図 */}
          <section className="space-y-4">
            <div className="flex items-center gap-2 text-sm text-white/45">
              <MapPin className="w-4 h-4 shrink-0" />
              <span>{areaLabel}</span>
            </div>
            <div className="rounded-[20px] overflow-hidden border border-white/[0.05]">
              <iframe
                title={`${vibe.shopName} map`}
                src={buildMapEmbedUrl(vibe, locale)}
                width="100%"
                height="180"
                style={{ border: 0 }}
                loading="lazy"
              />
            </div>
            <NeonButton variant="white" onClick={() => window.open(mapsUrl, '_blank')}>
              <span className="flex items-center justify-center gap-2">
                <ExternalLink className="w-4 h-4" />
                {t('vibes.openInMaps')}
              </span>
            </NeonButton>
          </section>

          {/* この後おすすめルート */}
          <AiJourneySection
            startVibe={vibe}
            onSelectVibe={onSelectVibe}
            onAddToPlan={onAddJourneyToPlan}
          />

          {relatedVibes.length > 0 && (
            <section className="space-y-4">
              <SectionTitle>{t('vibes.youMightLike')}</SectionTitle>
              <p className="text-sm text-white/35 -mt-2">{t('vibes.youMightLikeSub')}</p>
              <div className="grid gap-4 sm:grid-cols-2">
                {relatedVibes.map((rv, i) => (
                  <ExploreVibeCard
                    key={rv.id}
                    vibe={rv}
                    saved={savedSpotIds.includes(rv.spotId)}
                    onSelect={() => onSelectVibe?.(rv)}
                    onToggleSave={() => toggleSaveSpot(rv.spotId)}
                    delay={i * 0.04}
                  />
                ))}
              </div>
            </section>
          )}

          <div className="flex gap-3 pt-2">
            <NeonButton variant={saved ? 'primary' : 'ghost'} onClick={onToggleSave}>
              {saved ? t('vibes.saved') : t('vibes.save')}
            </NeonButton>
            <NeonButton variant="ghost" onClick={() => onCreatePlan?.(vibe)}>
              {t('vibes.createPlan')}
            </NeonButton>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
