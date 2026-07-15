import { motion } from 'framer-motion';
import { ArrowLeft, Eye, EyeOff, Plus, RotateCcw, Sparkles } from 'lucide-react';
import { AVAILABLE_INTERESTS, getInterestLabel } from '@/features/aiProfile/types';
import { getInsightAccent } from '@/data/accentColors';
import { useAiProfile } from '@/contexts/AiProfileContext';
import { useLocale } from '@/locales/LocaleContext';

function InsightCard({ insight, index }) {
  const accent = getInsightAccent(insight.id);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.4 }}
      className={`rounded-[20px] border ${accent.border} ${accent.bg} p-5 relative overflow-hidden`}
    >
      <div className={`absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r ${accent.gradient}`} />
      <span className="text-2xl mb-3 block">{insight.emoji}</span>
      <p className="text-sm font-medium text-white leading-snug">{insight.text}</p>
    </motion.div>
  );
}

export function AiProfilePage({ onClose }) {
  const { t, locale } = useLocale();
  const {
    profile,
    insights,
    profileData,
    resetProfile,
    addInterest,
    hideInterest,
    unhideInterest,
  } = useAiProfile();

  const hidden = new Set(profileData.hiddenInterests);
  const manual = new Set(profileData.manualInterests);
  const aiAccent = getInsightAccent('learning');

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[85] bg-black overflow-y-auto"
    >
      <div className="max-w-lg mx-auto min-h-full">
        <div className="sticky top-0 z-10 flex items-center gap-3 px-5 py-4 bg-black/80 backdrop-blur-2xl border-b border-white/[0.04]">
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full bg-white/[0.06] hover:bg-white/[0.1] transition"
            aria-label={t('common.back')}
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <p className="text-caption">{t('aiProfile.eyebrow')}</p>
            <h1 className="text-lg font-semibold tracking-tight text-white">{t('aiProfile.title')}</h1>
          </div>
        </div>

        <div className="px-5 py-10 space-y-12">
          <section className="rounded-[20px] gradient-border-ai p-6">
            <div className="flex items-center gap-2.5 mb-4">
              <div className={`w-10 h-10 rounded-2xl ${aiAccent.bg} flex items-center justify-center`}>
                <Sparkles className={`w-5 h-5 ${aiAccent.text}`} />
              </div>
              <h2 className="text-base font-semibold text-white">{t('aiProfile.conciergeTitle')}</h2>
            </div>
            <p className="text-sm text-body leading-relaxed">{t('aiProfile.conciergeDesc')}</p>
            <p className="text-[11px] text-white/30 mt-4">
              {locale === 'en'
                ? `${profile.signalCount} signals learned`
                : `${profile.signalCount}件の行動を学習中`}
            </p>
          </section>

          <section className="space-y-5">
            <h2 className="text-lg font-semibold tracking-tight text-white">
              {t('aiProfile.insightsTitle')}
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {insights.map((insight, i) => (
                <InsightCard key={insight.id} insight={insight} index={i} />
              ))}
            </div>
          </section>

          <section className="space-y-4">
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4 text-white/30" />
              <h2 className="text-sm font-semibold text-white/60">{t('aiProfile.learningTitle')}</h2>
            </div>
            <ul className="space-y-2.5 text-sm text-white/40">
              <li>{t('aiProfile.learnGenres')}</li>
              <li>{t('aiProfile.learnSaves')}</li>
              <li>{t('aiProfile.learnAreas')}</li>
              <li>{t('aiProfile.learnBudget')}</li>
              <li>{t('aiProfile.learnRecent')}</li>
            </ul>
          </section>

          <section className="space-y-4">
            <div className="flex items-center gap-2">
              <Plus className="w-4 h-4 text-white/30" />
              <h2 className="text-sm font-semibold text-white/60">{t('aiProfile.addInterest')}</h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {AVAILABLE_INTERESTS.filter((i) => !manual.has(i.id) && !hidden.has(i.id)).map((interest) => {
                const accent = getInsightAccent(interest.id);
                return (
                  <button
                    key={interest.id}
                    type="button"
                    onClick={() => addInterest(interest.id)}
                    className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-semibold border ${accent.border} ${accent.bg} ${accent.text} hover:opacity-90 transition`}
                  >
                    <span>{interest.emoji}</span>
                    {getInterestLabel(interest.id, locale)}
                  </button>
                );
              })}
            </div>
          </section>

          {profileData.manualInterests.length > 0 && (
            <section className="space-y-3">
              <h2 className="text-sm font-semibold text-white/60">{t('aiProfile.activeInterests')}</h2>
              <div className="flex flex-wrap gap-2">
                {profileData.manualInterests.map((id) => {
                  const meta = AVAILABLE_INTERESTS.find((i) => i.id === id);
                  const accent = getInsightAccent(id);
                  return (
                    <span
                      key={id}
                      className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold border ${accent.border} ${accent.bg} ${accent.text}`}
                    >
                      {meta?.emoji} {getInterestLabel(id, locale)}
                      <button type="button" onClick={() => hideInterest(id)} className="opacity-50 hover:opacity-100">
                        <EyeOff className="w-3 h-3" />
                      </button>
                    </span>
                  );
                })}
              </div>
            </section>
          )}

          {profileData.hiddenInterests.length > 0 && (
            <section className="space-y-3">
              <h2 className="text-sm font-semibold text-white/60">{t('aiProfile.hiddenInterests')}</h2>
              <div className="flex flex-wrap gap-2">
                {profileData.hiddenInterests.map((id) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => unhideInterest(id)}
                    className="px-3.5 py-1.5 rounded-full text-xs text-white/30 line-through hover:text-white/50 transition"
                  >
                    {getInterestLabel(id, locale)}
                  </button>
                ))}
              </div>
            </section>
          )}

          <button
            type="button"
            onClick={() => {
              if (window.confirm(t('aiProfile.resetConfirm'))) resetProfile();
            }}
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-full border border-white/[0.08] text-white/40 text-sm font-medium hover:bg-white/[0.04] hover:text-white/60 transition"
          >
            <RotateCcw className="w-4 h-4" />
            {t('aiProfile.reset')}
          </button>
        </div>
      </div>
    </motion.div>
  );
}
