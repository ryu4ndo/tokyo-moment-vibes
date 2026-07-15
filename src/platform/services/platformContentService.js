import { isApiData } from '@/config/dataSource';
import { getApi } from '@/services/apiClient';
import { getPlatformStore } from '@/platform/mock/platformStore';

/** Platform CMS content for consumer feeds (Today, Vibes, features). */
export async function fetchActivePlatformEvents() {
  if (isApiData) {
    const { events } = await getApi('/api/platform/events');
    return events;
  }
  return getPlatformStore().platformEvents.filter((e) => e.active);
}

export async function fetchActiveFeaturedCollections() {
  if (isApiData) {
    const { features } = await getApi('/api/platform/features');
    return features;
  }
  return getPlatformStore().featuredCollections.filter((f) => f.active);
}

export function getActiveBusinessEvents(businessId) {
  const store = getPlatformStore();
  const today = new Date().toISOString().slice(0, 10);
  return store.businessEvents.filter(
    (e) => e.businessId === businessId && e.active && e.startDate <= today && e.endDate >= today,
  );
}
