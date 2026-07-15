import { getEventsForDate } from '@/data/eventsCatalog';

/** @deprecated Use getEventsForDate from eventsCatalog */
export const TODAY_EVENTS = [];

export function getTodayEvents(date = new Date()) {
  return getEventsForDate(date).today.map((e) => ({
    id: e.id,
    month: new Date(e.startDate).getMonth() + 1,
    day: new Date(e.startDate).getDate(),
    nameJa: e.titleJa,
    nameEn: e.titleEn,
    area: e.area,
    type: e.type,
  }));
}
