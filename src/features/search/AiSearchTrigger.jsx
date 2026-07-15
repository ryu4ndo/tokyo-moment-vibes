import { Search, Sparkles } from 'lucide-react';
import { useLocale } from '@/locales/LocaleContext';

export function AiSearchTrigger({ onClick }) {
  const { t } = useLocale();

  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full flex items-center gap-3 px-4 py-3.5 rounded-[16px] bg-white/[0.04] border border-white/[0.08] hover:bg-white/[0.06] hover:border-purple-500/25 transition group text-left"
    >
      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center shrink-0">
        <Sparkles className="w-4 h-4 text-purple-300" />
      </div>
      <span className="flex-1 text-sm text-white/40 group-hover:text-white/55 transition truncate">
        {t('search.triggerPlaceholder')}
      </span>
      <Search className="w-4 h-4 text-white/25 group-hover:text-white/45 shrink-0 transition" />
    </button>
  );
}
