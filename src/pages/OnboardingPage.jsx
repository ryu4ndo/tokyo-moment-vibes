import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, MapPin, Sparkles, Users } from 'lucide-react';
import { AREAS } from '@/data/areas';
import { MOODS } from '@/data/moods';
import { useLocale } from '@/locales/LocaleContext';
import { useAuth } from '@/contexts/AuthContext';
import { useAppState } from '@/contexts/AppStateContext';
import { ExperienceSelector } from '@/components/ui/ExperienceSelector';
import { CompanionSelector } from '@/components/ui/CompanionSelector';
import { NeonButton } from '@/components/ui/NeonButton';

const STEPS = ['welcome', 'mode', 'companion', 'ready'];

export function OnboardingPage({ onComplete }) {
  const { t, locale } = useLocale();
  const { updateProfile } = useAuth();
  const { setLocation, setExperienceMode, setCompanion, setMood } = useAppState();

  const [step, setStep] = useState(0);
  const [area, setArea] = useState('渋谷');
  const [mode, setMode] = useState('local');
  const [companion, setCompanionLocal] = useState('solo');
  const [mood, setMoodLocal] = useState(MOODS[0]?.labelJa ?? '');

  const current = STEPS[step];
  const isLast = step === STEPS.length - 1;

  const finish = () => {
    setLocation(area);
    setExperienceMode(mode);
    setCompanion(companion);
    const moodMatch = MOODS.find((m) => m.labelJa === mood || m.labelEn === mood);
    if (moodMatch) setMood(moodMatch.labelJa);
    updateProfile({ onboardingCompleted: true, defaultExperienceMode: mode });
    onComplete?.();
  };

  const next = () => {
    if (isLast) finish();
    else setStep((s) => s + 1);
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black flex flex-col">
      <div className="flex-1 flex flex-col justify-center px-6 py-10 max-w-md mx-auto w-full">
        <AnimatePresence mode="wait">
          {current === 'welcome' && (
            <motion.div
              key="welcome"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8 text-center"
            >
              <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-semibold text-white tracking-tight">{t('onboarding.welcomeTitle')}</h1>
                <p className="text-sm text-white/45 mt-3 leading-relaxed">{t('onboarding.welcomeDesc')}</p>
              </div>
            </motion.div>
          )}

          {current === 'mode' && (
            <motion.div
              key="mode"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div className="text-center">
                <h2 className="text-xl font-semibold text-white">{t('onboarding.modeTitle')}</h2>
                <p className="text-sm text-white/40 mt-2">{t('onboarding.modeDesc')}</p>
              </div>
              <ExperienceSelector value={mode} onChange={setMode} />
              <div className="space-y-2">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-white/35 flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {t('onboarding.areaTitle')}
                </p>
                <div className="flex flex-wrap gap-2">
                  {AREAS.slice(0, 8).map((a) => (
                    <button
                      key={a}
                      type="button"
                      onClick={() => setArea(a)}
                      className={`px-3 py-2 rounded-full text-xs font-medium transition ${
                        area === a
                          ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
                          : 'bg-white/[0.05] text-white/55 border border-white/[0.08]'
                      }`}
                    >
                      {a}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {current === 'companion' && (
            <motion.div
              key="companion"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div className="text-center">
                <h2 className="text-xl font-semibold text-white">{t('onboarding.companionTitle')}</h2>
                <p className="text-sm text-white/40 mt-2">{t('onboarding.companionDesc')}</p>
              </div>
              <CompanionSelector value={companion} onChange={setCompanionLocal} />
              <div className="space-y-2">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-white/35 flex items-center gap-1">
                  <Users className="w-3 h-3" />
                  {t('onboarding.moodTitle')}
                </p>
                <div className="flex flex-wrap gap-2">
                  {MOODS.slice(0, 6).map((m) => {
                    const label = locale === 'en' ? m.labelEn : m.labelJa;
                    return (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => setMoodLocal(m.labelJa)}
                        className={`px-3 py-2 rounded-full text-xs font-medium transition ${
                          mood === m.labelJa
                            ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
                            : 'bg-white/[0.05] text-white/55 border border-white/[0.08]'
                        }`}
                      >
                        {label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}

          {current === 'ready' && (
            <motion.div
              key="ready"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-8 text-center"
            >
              <div className="w-16 h-16 mx-auto rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-3xl">
                ✨
              </div>
              <div>
                <h2 className="text-xl font-semibold text-white">{t('onboarding.readyTitle')}</h2>
                <p className="text-sm text-white/45 mt-3 leading-relaxed">{t('onboarding.readyDesc')}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="px-6 pb-10 max-w-md mx-auto w-full space-y-4">
        <div className="flex justify-center gap-1.5">
          {STEPS.map((_, i) => (
            <div
              key={STEPS[i]}
              className={`h-1 rounded-full transition-all ${
                i <= step ? 'w-6 bg-purple-500' : 'w-2 bg-white/15'
              }`}
            />
          ))}
        </div>
        <NeonButton variant="primary" fullWidth onClick={next}>
          <span className="flex items-center justify-center gap-2">
            {isLast ? t('onboarding.start') : t('onboarding.next')}
            {!isLast && <ChevronRight className="w-4 h-4" />}
          </span>
        </NeonButton>
        {step > 0 && (
          <button
            type="button"
            onClick={() => setStep((s) => s - 1)}
            className="w-full text-sm text-white/35 hover:text-white/55 transition"
          >
            {t('onboarding.back')}
          </button>
        )}
        {!isLast && (
          <button
            type="button"
            onClick={finish}
            className="w-full text-sm text-white/30 hover:text-white/50 transition"
          >
            {t('onboarding.skip')}
          </button>
        )}
      </div>
    </div>
  );
}
