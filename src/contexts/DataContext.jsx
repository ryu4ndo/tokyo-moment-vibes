import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { DATA_SOURCE } from '@/config/dataSource';
import { fetchWeather } from '@/services/weatherService';
import { fetchEvents } from '@/services/eventsService';
import { fetchActiveFeaturedCollections } from '@/platform/services/platformContentService';
import { getMockWeather } from '@/domain/mock/weatherMock';
import { getEventsForDate } from '@/data/eventsCatalog';

const DataContext = createContext(null);

export function DataProvider({ children, area = '渋谷' }) {
  const [weather, setWeather] = useState(() => getMockWeather(area));
  const [events, setEvents] = useState(() => getEventsForDate());
  const [featuredCollections, setFeaturedCollections] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const refresh = useCallback(async (nextArea = area) => {
    setLoading(true);
    setError(null);
    try {
      const [weatherData, eventsData, features] = await Promise.all([
        fetchWeather(nextArea),
        fetchEvents(),
        fetchActiveFeaturedCollections(),
      ]);
      setWeather(weatherData);
      setEvents(eventsData);
      setFeaturedCollections(features);
    } catch (err) {
      setError(err?.message ?? 'Failed to load data');
      setWeather(getMockWeather(nextArea));
      setEvents(getEventsForDate());
      setFeaturedCollections([]);
    } finally {
      setLoading(false);
    }
  }, [area]);

  useEffect(() => {
    refresh(area);
  }, [area, refresh]);

  const value = useMemo(
    () => ({
      weather,
      /** @deprecated use weather.condition */
      weatherLegacy: weather?.condition ?? 'clear',
      events,
      eventsToday: events?.today ?? [],
      eventsThisWeek: events?.thisWeek ?? [],
      eventsLimited: events?.limited ?? [],
      featuredCollections,
      dataSource: DATA_SOURCE,
      loading,
      error,
      refresh,
    }),
    [weather, events, featuredCollections, loading, error, refresh],
  );

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useData must be used within DataProvider');
  return ctx;
}
