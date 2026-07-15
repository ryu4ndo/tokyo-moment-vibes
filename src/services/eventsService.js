import { isApiData } from '@/config/dataSource';
import { getApi } from './apiClient';
import { getEventsForDate } from '@/data/eventsCatalog';
import { mergePlatformEvents } from '@/platform/utils/mergePlatformEvents';
import { getPlatformStore } from '@/platform/mock/platformStore';

export async function fetchEvents(date = new Date()) {
  if (isApiData) {
    const dateStr = date.toISOString().slice(0, 10);
    return getApi(`/api/events?date=${dateStr}`);
  }
  const base = getEventsForDate(date);
  return mergePlatformEvents(base, getPlatformStore().platformEvents, date);
}

export function getEventsSync(date = new Date()) {
  return getEventsForDate(date);
}

export function getEventsTodaySync(date = new Date()) {
  return getEventsForDate(date).today;
}
