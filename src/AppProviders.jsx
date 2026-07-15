import { useCallback, useMemo } from 'react';
import { ToastProvider } from '@/contexts/ToastContext.jsx';
import { AuthProvider } from '@/contexts/AuthContext.jsx';
import { AppStateProvider, useAppState } from '@/contexts/AppStateContext.jsx';
import { AiProfileProvider, useAiProfile } from '@/contexts/AiProfileContext.jsx';
import { DataProvider } from '@/contexts/DataContext.jsx';
import { NotificationProvider } from '@/contexts/NotificationContext.jsx';
import { ConciergeProvider } from '@/contexts/ConciergeContext.jsx';
import { ErrorBoundary } from '@/components/ErrorBoundary.jsx';
import { generateTodayFeed } from '@/features/today/generateTodayFeed';
import { useLocale } from '@/locales/LocaleContext.jsx';
import { useData } from '@/contexts/DataContext.jsx';
import App from '@/App.jsx';

function AuthBridge({ children }) {
  const { reloadFromStorage } = useAppState();
  const { reloadFromStorage: reloadAiProfile } = useAiProfile();

  const onDataHydrate = useCallback(async () => {
    reloadFromStorage();
    reloadAiProfile();
  }, [reloadFromStorage, reloadAiProfile]);

  return <AuthProvider onDataHydrate={onDataHydrate}>{children}</AuthProvider>;
}

function DataBridge({ children }) {
  const { location } = useAppState();
  return <DataProvider area={location}>{children}</DataProvider>;
}

function NotificationBridge({ children }) {
  const { location, experienceMode, companion } = useAppState();
  const { weather, events } = useData();
  const { profile } = useAiProfile();
  const { locale } = useLocale();

  const todayHero = useMemo(() => {
    const feed = generateTodayFeed({
      locale,
      experienceMode,
      companion,
      location,
      weather: weather?.condition ?? 'clear',
      profile,
      events,
    });
    return feed.heroVibe ?? null;
  }, [locale, experienceMode, companion, location, weather, profile, events]);

  return <NotificationProvider todayHero={todayHero}>{children}</NotificationProvider>;
}

export function AppProviders() {
  return (
    <ErrorBoundary label="App crashed">
      <ToastProvider>
        <AppStateProvider>
          <AiProfileProvider>
            <AuthBridge>
              <DataBridge>
                <NotificationBridge>
                  <ConciergeProvider>
                    <App />
                  </ConciergeProvider>
                </NotificationBridge>
              </DataBridge>
            </AuthBridge>
          </AiProfileProvider>
        </AppStateProvider>
      </ToastProvider>
    </ErrorBoundary>
  );
}
