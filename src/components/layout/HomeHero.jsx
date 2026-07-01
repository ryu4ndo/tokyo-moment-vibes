import { useLocale } from '@/locales/LocaleContext';
import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher';

export function HomeHero() {
  const { t } = useLocale();

  return (
    <>
      <div className="flex items-start justify-between gap-3 mb-1">
        <p className="text-pink-300/70 text-[10px] font-bold tracking-[0.4em] uppercase">
          {t('brand.name')}
        </p>
        <LanguageSwitcher />
      </div>
      <h1 className="text-xl sm:text-2xl font-bold">{t('brand.headerTitle')}</h1>
      <p className="text-white/35 text-xs mt-1">{t('brand.tagline')}</p>
    </>
  );
}
