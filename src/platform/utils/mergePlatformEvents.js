/** Merge CMS platform events into consumer event feed shape. */

function isActiveOnDate(event, date) {
  if (!event.active) return false;
  const d = date.toISOString().slice(0, 10);
  return event.startDate <= d && event.endDate >= d;
}

function isThisWeek(event, date) {
  const start = new Date(date);
  start.setDate(date.getDate() - date.getDay());
  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  const weekStart = start.toISOString().slice(0, 10);
  const weekEnd = end.toISOString().slice(0, 10);
  return event.active && event.endDate >= weekStart && event.startDate <= weekEnd;
}

function toDto(event, timing) {
  return {
    id: event.id,
    titleJa: event.titleJa,
    titleEn: event.titleEn,
    type: event.type,
    timing,
    area: event.area,
    descriptionJa: event.descriptionJa ?? '',
    descriptionEn: event.descriptionEn ?? '',
    startDate: event.startDate,
    endDate: event.endDate,
    source: 'cms',
    showOnToday: event.showOnToday !== false,
    showOnVibes: event.showOnVibes !== false,
  };
}

export function mergePlatformEvents(baseFeed, platformEvents = [], date = new Date()) {
  const cmsToday = platformEvents
    .filter((e) => e.showOnToday !== false && isActiveOnDate(e, date))
    .map((e) => toDto(e, 'today'));

  const cmsWeek = platformEvents
    .filter((e) => e.showOnVibes !== false && isThisWeek(e, date) && !isActiveOnDate(e, date))
    .map((e) => toDto(e, 'this_week'));

  const cmsLimited = platformEvents
    .filter((e) => {
      if (!e.active) return false;
      const days = (new Date(e.endDate) - new Date(e.startDate)) / 86400000;
      return days <= 14 && (isActiveOnDate(e, date) || isThisWeek(e, date));
    })
    .map((e) => toDto(e, 'limited'));

  const dedupe = (arr, existing) => {
    const ids = new Set(existing.map((x) => x.id));
    return arr.filter((x) => !ids.has(x.id));
  };

  const today = [...cmsToday, ...dedupe(baseFeed.today ?? [], cmsToday)];
  const thisWeek = [...cmsWeek, ...dedupe(baseFeed.thisWeek ?? [], [...today, ...cmsWeek])];
  const limited = [...cmsLimited, ...dedupe(baseFeed.limited ?? [], [...today, ...thisWeek, ...cmsLimited])];

  return {
    today,
    thisWeek,
    limited,
    all: [...today, ...thisWeek.filter((w) => !today.find((t) => t.id === w.id))],
    cmsCount: cmsToday.length + cmsWeek.length,
  };
}

export function getVibesEvents(eventsFeed) {
  const all = [...(eventsFeed?.today ?? []), ...(eventsFeed?.thisWeek ?? []), ...(eventsFeed?.limited ?? [])];
  return all.filter((e) => e.showOnVibes !== false);
}
