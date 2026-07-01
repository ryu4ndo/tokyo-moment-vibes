import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { en, ja } from './messages';

const LocaleContext = createContext(null);
const STORAGE_KEY = 'tokyo-moment-vibes-locale';

function getNested(obj, path) {
  return path.split('.').reduce((acc, key) => acc?.[key], obj);
}

export function LocaleProvider({ children }) {
  const [locale, setLocaleState] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === 'en' || saved === 'ja') return saved;
    } catch {
      /* ignore */
    }
    return 'ja';
  });

  const setLocale = useCallback((next) => {
    setLocaleState(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* ignore */
    }
  }, []);

  const messages = locale === 'en' ? en : ja;

  const t = useCallback((key) => getNested(messages, key) ?? key, [messages]);

  const value = useMemo(
    () => ({ locale, setLocale, t, messages }),
    [locale, setLocale, t, messages]
  );

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale() {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error('useLocale must be used within LocaleProvider');
  return ctx;
}
