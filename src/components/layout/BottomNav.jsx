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
    <nav className="fixed bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-1.5rem)] max-w-lg">
      <div className="relative bg-white/[0.06] backdrop-blur-2xl border border-white/[0.1] rounded-full px-1 py-1.5 shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
        <motion.div
          className="absolute top-1.5 bottom-1.5 rounded-full bg-white shadow-[0_0_24px_rgba(255,255,255,0.35)]"
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
                className="flex-1 py-2.5 flex flex-col items-center gap-0.5 relative z-10"
              >
                <Icon
                  className={`w-3.5 h-3.5 transition-colors ${
                    isActive ? 'text-black' : 'text-white/45'
                  }`}
                />
                <span
                  className={`text-[8px] font-bold tracking-wider transition-colors ${
                    isActive ? 'text-black' : 'text-white/40'
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
