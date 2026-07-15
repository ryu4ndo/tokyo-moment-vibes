import { ConciergeSpotCard } from '@/features/chat/ConciergeSpotCard';
import { NeonButton } from '@/components/ui/NeonButton';
import { useLocale } from '@/locales/LocaleContext';

function MiniMap({ lat, lng, locale }) {
  if (!lat || !lng) return null;
  const src = `https://maps.google.com/maps?q=${lat},${lng}&hl=${locale === 'en' ? 'en' : 'ja'}&z=15&output=embed`;
  return (
    <div className="rounded-[16px] overflow-hidden border border-white/[0.06]">
      <iframe title="map" src={src} width="100%" height="140" style={{ border: 0 }} loading="lazy" />
    </div>
  );
}

export function ConciergeMessage({
  message,
  savedSpotIds,
  onFollowUp,
  onOpenSpot,
  onToggleSave,
  onOpenMaps,
  onShare,
  onCreatePlan,
  onAlternatives,
}) {
  const { t, locale } = useLocale();

  if (message.role === 'user') {
    return (
      <div className="flex justify-end">
        <p className="max-w-[85%] text-sm text-white/80 leading-relaxed">{message.content}</p>
      </div>
    );
  }

  const {
    reply,
    followUpQuestions = [],
    recommendations = [],
    mapCenter,
    excludeSpotIds = [],
  } = message;

  return (
    <div className="space-y-5">
      <p className="text-[15px] text-white/90 leading-relaxed font-light tracking-tight">{reply}</p>

      {recommendations.length > 0 && (
        <div className="space-y-4">
          {recommendations.map((rec, i) => (
            <ConciergeSpotCard
              key={rec.spotId}
              recommendation={rec}
              saved={savedSpotIds.includes(rec.spotId)}
              index={i}
              onOpen={onOpenSpot}
              onToggleSave={onToggleSave}
              onOpenMaps={onOpenMaps}
              onShare={onShare}
            />
          ))}
        </div>
      )}

      {mapCenter && recommendations.length > 0 && (
        <MiniMap lat={mapCenter.lat} lng={mapCenter.lng} locale={locale} />
      )}

      {recommendations.length > 0 && (
        <div className="flex flex-col gap-2">
          <NeonButton variant="primary" onClick={() => onCreatePlan?.(recommendations)}>
            {t('concierge.createPlan')}
          </NeonButton>
          <NeonButton variant="ghost" onClick={() => onAlternatives?.(excludeSpotIds)}>
            {t('concierge.alternatives')}
          </NeonButton>
        </div>
      )}

      {followUpQuestions.length > 0 && (
        <div className="flex flex-wrap gap-2 pt-1">
          {followUpQuestions.map((q) => (
            <button
              key={q}
              type="button"
              onClick={() => onFollowUp?.(q)}
              className="px-3.5 py-2 rounded-full text-xs font-medium bg-white/[0.04] border border-white/[0.08] text-white/55 hover:text-white/80 hover:border-white/[0.14] transition"
            >
              {q}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
