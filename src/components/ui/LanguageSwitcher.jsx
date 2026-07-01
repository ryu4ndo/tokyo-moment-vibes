import { useLocale } from '@/locales/LocaleContext';

export function LanguageSwitcher({ className = '' }) {
  const { locale, setLocale } = useLocale();

  return (
    <div className={`inline-flex rounded-full border border-white/[0.08] bg-white/[0.04] backdrop-blur-xl p-1 ${className}`}>
      {['ja', 'en'].map((lang) => (
        <button
          key={lang}
          type="button"
          onClick={() => setLocale(lang)}
          className={`px-3 py-1.5 rounded-full text-[10px] font-bold tracking-wide transition ${
            locale === lang
              ? 'bg-white text-black shadow-[0_0_12px_rgba(255,255,255,0.2)]'
              : 'text-white/45 hover:text-white/70'
          }`}
        >
          {lang === 'ja' ? '🇯🇵' : '🌍'} {lang === 'ja' ? 'JA' : 'EN'}
        </button>
      ))}
    </div>
  );
}

/** @deprecated Use LanguageSwitcher */
export { LanguageSwitcher as LanguageToggle };
