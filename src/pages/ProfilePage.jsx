import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Bell,
  Globe,
  LogOut,
  MapPin,
  Moon,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { ENRICHED_VIBES } from '@/data/vibes';
import { localizeVibe } from '@/features/vibes/localizeVibe';
import { getInsightAccent } from '@/data/accentColors';
import { useAuth } from '@/contexts/AuthContext';
import { useAiProfile } from '@/contexts/AiProfileContext';
import { useAppState } from '@/contexts/AppStateContext';
import { useLocale } from '@/locales/LocaleContext';
import { HomeSpotCard } from '@/features/home/HomeSectionRow';
import { ExperienceSelector } from '@/components/ui/ExperienceSelector';
import { NeonButton } from '@/components/ui/NeonButton';

function SectionTitle({ children }) {
  return <h2 className="text-sm font-semibold text-white/60 uppercase tracking-wider">{children}</h2>;
}

function InsightCard({ insight, index }) {
  const accent = getInsightAccent(insight.id);
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className={`rounded-[16px] border ${accent.border} ${accent.bg} p-4`}
    >
      <span className="text-xl mb-2 block">{insight.emoji}</span>
      <p className="text-sm text-white leading-snug">{insight.text}</p>
    </motion.div>
  );
}

function DataRow({ title, items, onSelect, emptyLabel }) {
  if (!items?.length) {
    return (
      <div className="space-y-2">
        <p className="text-xs font-medium text-white/40">{title}</p>
        <p className="text-sm text-white/25 py-4">{emptyLabel}</p>
      </div>
    );
  }
  return (
    <div className="space-y-3">
      <p className="text-xs font-medium text-white/40">{title}</p>
      <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-hide -mx-1 px-1">
        {items.map((vibe, i) => (
          <HomeSpotCard key={vibe.id} vibe={vibe} onSelect={onSelect} index={i} />
        ))}
      </div>
    </div>
  );
}

export function ProfilePage({ onClose, onSelectVibe, onGoToPlan, onOpenAiProfile, onOpenLegal, onOpenSearch }) {
  const { t, locale, setLocale } = useLocale();
  const { displayName, avatarUrl, userProfile, updateProfile, logout, provider, syncNow } = useAuth();
  const { insights, resetProfile, profile } = useAiProfile();
  const {
    savedSpotIds,
    recentlyViewedIds,
    savedPlans,
    searchHistory,
    clearSearchHistory,
    experienceMode,
    setExperienceMode,
  } = useAppState();

  const [name, setName] = useState(userProfile.name || displayName);
  const [residence, setResidence] = useState(userProfile.residence || '');

  const savedVibes = savedSpotIds
    .map((spotId) => ENRICHED_VIBES.find((v) => v.spotId === spotId))
    .filter(Boolean)
    .map((v) => localizeVibe(v, { locale, experienceMode }));

  const recentVibes = recentlyViewedIds
    .map((id) => ENRICHED_VIBES.find((v) => v.id === id))
    .filter(Boolean)
    .map((v) => localizeVibe(v, { locale, experienceMode }));

  const handleSaveProfile = () => {
    updateProfile({
      name: name.trim(),
      residence: residence.trim(),
      defaultExperienceMode: userProfile.defaultExperienceMode ?? experienceMode,
    });
    if (userProfile.defaultExperienceMode) {
      setExperienceMode(userProfile.defaultExperienceMode);
    }
    syncNow();
  };

  const providerLabel =
    provider === 'apple'
      ? 'Apple'
      : provider === 'google'
        ? 'Google'
        : t('auth.guest');

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[90] bg-black overflow-y-auto"
    >
      <div className="max-w-lg mx-auto min-h-full pb-16">
        <div className="sticky top-0 z-10 flex items-center gap-3 px-5 py-4 bg-black/85 backdrop-blur-2xl border-b border-white/[0.05]">
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full bg-white/[0.06] hover:bg-white/[0.1] transition"
            aria-label={t('common.back')}
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-semibold text-white">{t('profile.title')}</h1>
        </div>

        <div className="px-5 py-8 space-y-12">
          {/* User header */}
          <section className="flex items-center gap-4">
            <img
              src={avatarUrl}
              alt=""
              className="w-16 h-16 rounded-2xl object-cover border border-white/[0.08]"
            />
            <div>
              <p className="text-lg font-semibold text-white">{name || displayName}</p>
              <p className="text-xs text-white/40 mt-0.5">{providerLabel}</p>
              {profile.hasData && (
                <p className="text-[11px] text-purple-300/70 mt-1">
                  {profile.signalCount} {t('profile.signalsLearned')}
                </p>
              )}
            </div>
          </section>

          {/* Profile edit */}
          <section className="space-y-4">
            <SectionTitle>{t('profile.userInfo')}</SectionTitle>
            <div className="space-y-3">
              <label className="block">
                <span className="text-caption text-white/35 mb-1.5 block">{t('profile.name')}</span>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-[14px] bg-white/[0.05] border border-white/[0.08] px-4 py-3 text-sm text-white"
                />
              </label>
              <label className="block">
                <span className="text-caption text-white/35 mb-1.5 block flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {t('profile.residence')}
                </span>
                <input
                  value={residence}
                  onChange={(e) => setResidence(e.target.value)}
                  placeholder={t('profile.residencePlaceholder')}
                  className="w-full rounded-[14px] bg-white/[0.05] border border-white/[0.08] px-4 py-3 text-sm text-white placeholder:text-white/25"
                />
              </label>
              <div>
                <span className="text-caption text-white/35 mb-2 block">{t('profile.defaultMode')}</span>
                <ExperienceSelector
                  compact
                  value={userProfile.defaultExperienceMode ?? experienceMode}
                  onChange={(mode) => updateProfile({ defaultExperienceMode: mode })}
                />
              </div>
              <div>
                <span className="text-caption text-white/35 mb-2 block flex items-center gap-1">
                  <Globe className="w-3 h-3" />
                  {t('profile.language')}
                </span>
                <div className="flex gap-2">
                  {['ja', 'en'].map((lang) => (
                    <button
                      key={lang}
                      type="button"
                      onClick={() => setLocale(lang)}
                      className={`px-4 py-2 rounded-full text-xs font-semibold transition ${
                        locale === lang
                          ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
                          : 'bg-white/[0.05] text-white/50'
                      }`}
                    >
                      {lang === 'ja' ? '日本語' : 'English'}
                    </button>
                  ))}
                </div>
              </div>
              <NeonButton variant="primary" onClick={handleSaveProfile}>
                {t('profile.save')}
              </NeonButton>
            </div>
          </section>

          {/* AI Profile */}
          <section className="space-y-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-300" />
              <SectionTitle>{t('profile.aiProfile')}</SectionTitle>
            </div>
            {insights.length > 0 ? (
              <div className="grid grid-cols-2 gap-3">
                {insights.map((insight, i) => (
                  <InsightCard key={insight.id} insight={insight} index={i} />
                ))}
              </div>
            ) : (
              <p className="text-sm text-white/35 leading-relaxed">{t('profile.aiProfileEmpty')}</p>
            )}
            <button
              type="button"
              onClick={onOpenAiProfile}
              className="text-sm text-purple-300/80 hover:text-purple-300 transition flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              {t('profile.editAiProfile')}
            </button>
          </section>

          {/* My Data */}
          <section className="space-y-8">
            <SectionTitle>{t('profile.myData')}</SectionTitle>
            <DataRow
              title={t('profile.savedSpots')}
              items={savedVibes}
              onSelect={onSelectVibe}
              emptyLabel={t('profile.emptySaved')}
            />
            <div className="space-y-3">
              <p className="text-xs font-medium text-white/40">{t('profile.savedPlans')}</p>
              {savedPlans.length === 0 ? (
                <p className="text-sm text-white/25 py-2">{t('profile.emptyPlans')}</p>
              ) : (
                <div className="space-y-2">
                  {savedPlans.slice(0, 5).map((plan) => (
                    <button
                      key={plan.id}
                      type="button"
                      onClick={() => onGoToPlan?.(plan)}
                      className="w-full text-left rounded-[16px] border border-white/[0.06] bg-[#111] p-4 hover:border-white/[0.12] transition"
                    >
                      <p className="font-semibold text-white text-sm">{plan.title}</p>
                      <p className="text-xs text-white/40 mt-1 line-clamp-1">{plan.summary}</p>
                    </button>
                  ))}
                </div>
              )}
            </div>
            <DataRow
              title={t('profile.recentlyViewed')}
              items={recentVibes}
              onSelect={onSelectVibe}
              emptyLabel={t('profile.emptyRecent')}
            />
            <div className="space-y-2">
              <p className="text-xs font-medium text-white/40">{t('profile.recentSearches')}</p>
              {searchHistory.length === 0 ? (
                <p className="text-sm text-white/25 py-2">{t('profile.emptySearch')}</p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {searchHistory.map((q) => (
                    <button
                      key={q}
                      type="button"
                      onClick={() => {
                        onClose();
                        onOpenSearch?.(q);
                      }}
                      className="px-3 py-1.5 rounded-full text-xs bg-white/[0.05] text-white/55 border border-white/[0.06] hover:border-purple-500/30 hover:text-white/80 transition"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              )}
              {searchHistory.length > 0 && (
                <button
                  type="button"
                  onClick={clearSearchHistory}
                  className="text-[10px] text-white/30 hover:text-white/50 transition"
                >
                  {t('profile.clearSearch')}
                </button>
              )}
            </div>
          </section>

          {/* Settings */}
          <section className="space-y-4">
            <SectionTitle>{t('profile.settings')}</SectionTitle>
            <div className="rounded-[20px] border border-white/[0.06] bg-[#111] divide-y divide-white/[0.05]">
              <label className="flex items-center justify-between p-4 cursor-pointer">
                <span className="flex items-center gap-2 text-sm text-white/75">
                  <Bell className="w-4 h-4 text-white/35" />
                  {t('profile.notifications')}
                </span>
                <input
                  type="checkbox"
                  checked={userProfile.notificationsEnabled !== false}
                  onChange={(e) => updateProfile({ notificationsEnabled: e.target.checked })}
                  className="w-4 h-4 accent-purple-500"
                />
              </label>
              <label className="flex items-center justify-between p-4 cursor-pointer">
                <span className="flex items-center gap-2 text-sm text-white/75">
                  <Moon className="w-4 h-4 text-white/35" />
                  {t('profile.darkMode')}
                </span>
                <input
                  type="checkbox"
                  checked={userProfile.darkMode !== false}
                  onChange={(e) => updateProfile({ darkMode: e.target.checked })}
                  className="w-4 h-4 accent-purple-500"
                />
              </label>
              <button
                type="button"
                onClick={() => {
                  if (window.confirm(t('profile.reOnboardConfirm'))) {
                    updateProfile({ onboardingCompleted: false });
                    onClose();
                  }
                }}
                className="w-full flex items-center gap-2 p-4 text-sm text-white/60 hover:text-white/85 transition text-left border-t border-white/[0.05]"
              >
                <RotateCcw className="w-4 h-4 text-white/35" />
                {t('profile.reOnboard')}
              </button>
              <button
                type="button"
                onClick={() => {
                  if (window.confirm(t('aiProfile.resetConfirm'))) resetProfile();
                }}
                className="w-full flex items-center gap-2 p-4 text-sm text-white/55 hover:text-white/80 transition"
              >
                <RotateCcw className="w-4 h-4" />
                {t('profile.resetAi')}
              </button>
              <button
                type="button"
                onClick={async () => {
                  await logout();
                  onClose();
                }}
                className="w-full flex items-center gap-2 p-4 text-sm text-red-300/80 hover:text-red-300 transition"
              >
                <LogOut className="w-4 h-4" />
                {t('profile.logout')}
              </button>
            </div>
            <div className="rounded-[20px] border border-white/[0.06] bg-[#111] divide-y divide-white/[0.05] mt-4">
              <a href="/owner" className="block p-4 text-sm text-purple-300/80 hover:text-purple-300 transition">
                {locale === 'en' ? 'Owner Portal →' : 'オーナーポータル →'}
              </a>
              <a href="/admin" className="block p-4 text-sm text-purple-300/80 hover:text-purple-300 transition">
                {locale === 'en' ? 'Admin Dashboard →' : '運営ダッシュボード →'}
              </a>
            </div>
            <div className="rounded-[20px] border border-white/[0.06] bg-[#111] divide-y divide-white/[0.05] mt-4">
              {[
                { key: 'terms', label: t('legal.terms') },
                { key: 'privacy', label: t('legal.privacy') },
                { key: 'contact', label: t('legal.contact') },
              ].map(({ key, label }) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => onOpenLegal?.(key)}
                  className="w-full text-left p-4 text-sm text-white/55 hover:text-white/80 transition"
                >
                  {label}
                </button>
              ))}
            </div>
          </section>
        </div>
      </div>
    </motion.div>
  );
}
