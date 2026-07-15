import { StrictMode, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import '@/styles/index.css';
import { LocaleProvider, useLocale } from '@/locales/LocaleContext.jsx';
import { AppProviders } from '@/AppProviders.jsx';
import { OwnerApp } from '@/platform/owner/OwnerApp.jsx';
import { AdminApp } from '@/platform/admin/AdminApp.jsx';

function Root() {
  const { locale } = useLocale();
  const path = window.location.pathname;

  useEffect(() => {
    document.documentElement.lang = locale === 'en' ? 'en' : 'ja';
  }, [locale]);

  if (path.startsWith('/owner')) return <OwnerApp locale={locale} />;
  if (path.startsWith('/admin')) return <AdminApp locale={locale} />;
  return <AppProviders />;
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <LocaleProvider>
      <Root />
    </LocaleProvider>
  </StrictMode>,
);
