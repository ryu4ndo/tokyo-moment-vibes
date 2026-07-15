import { useMemo } from 'react';
import { getAreaLabel } from '@/data/areas';
import { generateTodayFeed } from '@/features/today/generateTodayFeed';
import { TodayInTokyo } from '@/features/today/TodayInTokyo';
import { generatePersonalizedHome } from '@/features/home/generatePersonalizedHome';
import { ForYouHero } from '@/features/home/ForYouHero';
import { HomeSectionRow } from '@/features/home/HomeSectionRow';
import { AiSuggestionBanner } from '@/components/ui/AiSuggestionBanner';
import { useLocale } from '@/locales/LocaleContext';
import { useAppState } from '@/contexts/AppStateContext';
import { useAiProfile } from '@/contexts/AiProfileContext';
import { useData } from '@/contexts/DataContext';

export function HomePage({ onSelectVibe, onGoToVibes, onGoToFood }) {
  const { t, locale } = useLocale();
  const {
    location,
    experienceMode,
    companion,
    savedSpotIds,
    recentlyViewedIds,
  } = useAppState();
  const { weatherLegacy: weather, events, featuredCollections } = useData();
  const { profile } = useAiProfile();

  const areaLabel = getAreaLabel(location, locale);

  const personalized = useMemo(
    () =>
      generatePersonalizedHome({
        locale,
        experienceMode,
        companion,
        location,
        weather,
        savedSpotIds,
        recentlyViewedIds,
        profile,
        events,
        featuredCollections,
      }),
    [locale, experienceMode, companion, location, weather, savedSpotIds, recentlyViewedIds, profile, events, featuredCollections],
  );

  const todayFeed = useMemo(
    () =>
      generateTodayFeed({
        locale,
        experienceMode,
        companion,
        location,
        weather,
        profile,
        events,
      }),
    [locale, experienceMode, companion, location, weather, profile, events],
  );

  const seeMore = t('home.seeMore');

  return (
    <div className="space-y-10">
      <ForYouHero
        message={personalized.forYouMessage}
        picks={personalized.forYouPicks}
        onSelect={onSelectVibe}
      />

      <TodayInTokyo feed={todayFeed} onSelect={onSelectVibe} />

      {personalized.featuredSections.map((section) => (
        <HomeSectionRow
          key={section.id}
          title={section.title}
          subtitle={section.subtitle}
          items={section.items}
          onSelect={onSelectVibe}
          onSeeMore={onGoToVibes}
          seeMoreLabel={seeMore}
        />
      ))}

      <HomeSectionRow
        title={t('home.continueExploring')}
        subtitle={t('home.continueExploringSub')}
        items={personalized.continueExploring}
        onSelect={onSelectVibe}
        onSeeMore={onGoToVibes}
        seeMoreLabel={seeMore}
      />

      {personalized.interestSections.map((section) => (
        <HomeSectionRow
          key={section.id}
          title={`${t('home.basedOnInterestsPrefix')} · ${section.title}`}
          items={section.items}
          onSelect={onSelectVibe}
          onSeeMore={onGoToVibes}
          seeMoreLabel={seeMore}
        />
      ))}

      <HomeSectionRow
        title={t('home.trendingNearYou')}
        subtitle={`${areaLabel} — ${t('home.trendingNearYouSub')}`}
        items={personalized.trendingNearYou}
        onSelect={onSelectVibe}
        onSeeMore={onGoToVibes}
        seeMoreLabel={seeMore}
      />

      <HomeSectionRow
        title={t('home.hiddenGems')}
        subtitle={t('home.hiddenGemsSub')}
        items={personalized.hiddenGems}
        onSelect={onSelectVibe}
        onSeeMore={onGoToVibes}
        seeMoreLabel={seeMore}
      />

      {personalized.showWeekend && (
        <HomeSectionRow
          title={t('home.weekendIdeas')}
          subtitle={t('home.weekendIdeasSub')}
          items={personalized.weekendIdeas}
          onSelect={onSelectVibe}
          onSeeMore={onGoToVibes}
          seeMoreLabel={seeMore}
        />
      )}

      {personalized.travelInspiration.map((section) => (
        <HomeSectionRow
          key={section.id}
          title={`${t('home.travelInspirationPrefix')} · ${section.title}`}
          items={section.items}
          onSelect={onSelectVibe}
          onSeeMore={onGoToFood}
          seeMoreLabel={seeMore}
        />
      ))}

      <AiSuggestionBanner page="home" />
    </div>
  );
}
