/**
 * Unified AI context — swap mock/API fields without changing consumers.
 * @param {object} params
 */
export function buildAiContext({
  locale = 'ja',
  experienceMode = 'local',
  companion = 'solo',
  mood = null,
  location = '渋谷',
  freeTime = null,
  nextPlan = null,
  weather = null,
  events = null,
  profile = null,
  savedSpotIds = [],
  recentlyViewedIds = [],
  currentPage = null,
  detailSpotName = null,
  detailSpotId = null,
  dayOfWeek = null,
  timeOfDay = null,
}) {
  const condition = weather?.condition ?? weather ?? 'clear';
  const eventList = events?.today ?? events?.all ?? events ?? [];

  return {
    locale,
    experienceMode,
    companion,
    mood,
    location,
    freeTime,
    nextPlan,
    weather: condition,
    weatherSnapshot: weather?.condition
      ? weather
      : {
          condition,
          temperatureC: null,
          precipitationProbability: condition === 'rain' ? 70 : 10,
          description: condition,
          source: 'mock',
        },
    events: eventList,
    eventsSnapshot: events,
    savedSpotIds,
    recentlyViewedIds,
    profile: profile
      ? {
          hasData: profile.hasData,
          topCategories: profile.topCategories,
          topAreas: profile.topAreas,
          budgetLabel: profile.budgetLabel,
          walkPreference: profile.walkPreference,
          timeOfDay: profile.timeOfDay,
          activeInterests: profile.activeInterests,
          signalCount: profile.signalCount,
        }
      : null,
    currentPage,
    detailSpotName,
    detailSpotId,
    dayOfWeek,
    timeOfDay,
  };
}
