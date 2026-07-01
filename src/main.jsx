import { StrictMode, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import '@/styles/index.css';
import App from '@/App.jsx';
import { LocaleProvider, useLocale } from '@/locales/LocaleContext.jsx';
import { AppStateProvider } from '@/contexts/AppStateContext.jsx';

function Root() {
  const { locale } = useLocale();
  useEffect(() => {
    document.documentElement.lang = locale === 'en' ? 'en' : 'ja';
  }, [locale]);
  return (
    <AppStateProvider>
      <App />
    </AppStateProvider>
  );
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <LocaleProvider>
      <Root />
    </LocaleProvider>
  </StrictMode>,
);
