import { motion } from 'framer-motion';
import { Home, UtensilsCrossed, Sparkles, Heart, Map } from 'lucide-react';
import { useLocale } from '@/locales/LocaleContext';

const TABS = [
  { id: 'HOME', labelKey: 'home', icon: Home },
  { id: 'FOOD', labelKey: 'food', icon: UtensilsCrossed },
  { id: 'VIBES', labelKey: 'vibes', icon: Sparkles },
  { id: 'SAVED', labelKey: 'saved', icon: Heart },
  { id: 'PLAN', labelKey: 'plan', icon: Map },
];

export function BottomNav({ activeTab, onTabChange }) {
  const { t } = useLocale();
  const activeIndex = TABS.findIndex((tab) => tab.id === activeTab);

  return (
    <nav className="fixed bottom-[calc(1.25rem+env(safe-area-inset-bottom))] sm:bottom-6 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-lg">
      <div className="relative bg-[#111]/95 border border-white/[0.06] rounded-full px-1 py-1.5 backdrop-blur-2xl">
        <motion.div
          className="absolute top-1.5 bottom-1.5 rounded-full bg-gradient-to-r from-purple-600 to-blue-600"
          layout
          transition={{ type: 'spring', stiffness: 380, damping: 32 }}
          style={{
            width: `calc((100% - 8px) / ${TABS.length})`,
            left: `calc(4px + ((100% - 8px) / ${TABS.length}) * ${activeIndex})`,
          }}
        />
        <div className="relative flex">
          {TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => onTabChange(tab.id)}
                aria-label={t(`nav.${tab.labelKey}`)}
                aria-current={isActive ? 'page' : undefined}
                className="flex-1 py-2.5 flex flex-col items-center gap-0.5 relative z-10"
              >
                <Icon
                  className={`w-3.5 h-3.5 transition-colors ${
                    isActive ? 'text-white' : 'text-white/40'
                  }`}
                />
                <span
                  className={`text-[8px] font-bold tracking-wider transition-colors ${
                    isActive ? 'text-white' : 'text-white/35'
                  }`}
                >
                  {t(`nav.${tab.labelKey}`)}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
