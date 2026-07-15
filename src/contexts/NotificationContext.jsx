import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { generateNotifications } from '@/features/notifications/generateNotifications';
import { useAuth } from '@/contexts/AuthContext';
import { useAppState } from '@/contexts/AppStateContext';
import { useData } from '@/contexts/DataContext';
import { useLocale } from '@/locales/LocaleContext';

const NOTIF_KEY = 'tokyo-moment-vibes-notifications-read';

function loadReadIds() {
  try {
    const raw = localStorage.getItem(NOTIF_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

const NotificationContext = createContext(null);

export function NotificationProvider({ children, todayHero = null }) {
  const { userProfile } = useAuth();
  const { location, experienceMode, savedSpotIds } = useAppState();
  const { weather, events } = useData();
  const { locale } = useLocale();
  const [readIds, setReadIds] = useState(loadReadIds);

  const notifications = useMemo(() => {
    if (userProfile.notificationsEnabled === false) return [];
    const generated = generateNotifications({
      locale,
      location,
      experienceMode,
      weather,
      events,
      savedSpotIds,
      todayHero,
    });
    return generated.map((n) => ({ ...n, read: readIds.includes(n.id) }));
  }, [
    userProfile.notificationsEnabled,
    locale,
    location,
    experienceMode,
    weather,
    events,
    savedSpotIds,
    todayHero,
    readIds,
  ]);

  useEffect(() => {
    try {
      localStorage.setItem(NOTIF_KEY, JSON.stringify(readIds));
    } catch {
      /* ignore */
    }
  }, [readIds]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markRead = useCallback((id) => {
    setReadIds((prev) => (prev.includes(id) ? prev : [...prev, id]));
  }, []);

  const markAllRead = useCallback(() => {
    setReadIds(notifications.map((n) => n.id));
  }, [notifications]);

  const value = useMemo(
    () => ({ notifications, unreadCount, markRead, markAllRead }),
    [notifications, unreadCount, markRead, markAllRead],
  );

  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>;
}

export function useNotifications() {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error('useNotifications must be used within NotificationProvider');
  return ctx;
}
