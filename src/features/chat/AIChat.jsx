import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Sparkles, X } from 'lucide-react';
import { sendChatMessage } from '@/services/chatService';
import { buildFallbackConciergeResponse } from '@/features/concierge/rankConciergeVibes';
import { ConciergeMessage } from '@/features/chat/ConciergeMessage';
import { ENRICHED_VIBES } from '@/data/vibes';
import { useLocale } from '@/locales/LocaleContext';
import { useAppState } from '@/contexts/AppStateContext';
import { useAiProfile } from '@/contexts/AiProfileContext';
import { useData } from '@/contexts/DataContext';
import { useConcierge } from '@/contexts/ConciergeContext';
import { buildAiContext } from '@/domain/ai/buildAiContext';
import { getMoodLabel } from '@/data/moods';

const QUICK_PROMPTS = {
  ja: [
    '渋谷で2時間暇',
    '今日は何食べよう？',
    '雨の日でも楽しめる場所ある？',
    '彼女と夜景デートしたい',
    '地元の人が行く居酒屋に行きたい',
    '予算5000円で夜まで遊びたい',
  ],
  en: [
    '2 hours free in Shibuya',
    'What should I eat today?',
    'Rainy day spots?',
    'Date night with city views',
    'Local izakaya locals love',
    'Night out under ¥5,000',
  ],
};

const DAY_LABELS = {
  ja: ['日', '月', '火', '水', '木', '金', '土'],
  en: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
};

export function AIChat({
  onRegeneratePlan,
  onNavigate,
  onOpenSpot,
  onToggleSave,
  onCreatePlanFromRecs,
  savedSpotIds,
  onRecordSearch,
}) {
  const { t, locale } = useLocale();
  const { isOpen, seedMessage, closeConcierge, currentPage, detailSpotId } = useConcierge();
  const { profile } = useAiProfile();
  const {
    experienceMode,
    companion,
    mood,
    location,
    freeTime,
    nextPlan,
    savedSpotIds: appSavedIds,
    recentlyViewedIds,
  } = useAppState();
  const { weather, events } = useData();

  const saved = savedSpotIds ?? appSavedIds;
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const listRef = useRef(null);
  const seededRef = useRef(false);

  const detailVibe = detailSpotId
    ? ENRICHED_VIBES.find((v) => v.spotId === detailSpotId)
    : null;

  const context = useMemo(() => {
    const now = new Date();
    const days = DAY_LABELS[locale] ?? DAY_LABELS.ja;
    return buildAiContext({
      locale,
      experienceMode,
      companion,
      mood: getMoodLabel(mood, locale),
      location,
      freeTime,
      nextPlan,
      weather,
      events,
      profile,
      savedSpotIds: saved,
      recentlyViewedIds,
      currentPage,
      detailSpotName: detailVibe?.shopName ?? null,
      detailSpotId,
      dayOfWeek: days[now.getDay()],
      timeOfDay: now.toLocaleTimeString(locale === 'en' ? 'en-US' : 'ja-JP', {
        hour: '2-digit',
        minute: '2-digit',
      }),
    });
  }, [
    locale,
    experienceMode,
    companion,
    mood,
    location,
    freeTime,
    nextPlan,
    weather,
    events,
    currentPage,
    saved,
    recentlyViewedIds,
    profile,
    detailVibe,
    detailSpotId,
  ]);

  const quickPrompts = QUICK_PROMPTS[locale] ?? QUICK_PROMPTS.ja;

  const scrollToBottom = useCallback(() => {
    setTimeout(() => listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' }), 60);
  }, []);

  const sendMessage = useCallback(
    async (text, { excludeSpotIds = [] } = {}) => {
      const trimmed = text.trim();
      if (!trimmed || loading) return;

      const userMsg = { role: 'user', content: trimmed };
      const apiMessages = [...messages, userMsg].map((m) =>
        m.role === 'user' ? m : { role: 'assistant', content: m.reply ?? m.content },
      );
      setMessages((prev) => [...prev, userMsg]);
      setInput('');
      onRecordSearch?.(trimmed);
      setLoading(true);
      setError(null);
      scrollToBottom();

      try {
        let result;
        try {
          result = await sendChatMessage({
            messages: apiMessages,
            context: { ...context, excludeSpotIds },
          });
        } catch {
          result = buildFallbackConciergeResponse({
            messages: apiMessages,
            context: { ...context, excludeSpotIds },
            locale,
          });
        }

        const assistantMsg = {
          role: 'assistant',
          reply: result.reply,
          followUpQuestions: result.followUpQuestions ?? [],
          recommendations: result.recommendations ?? [],
          mapCenter: result.mapCenter,
          excludeSpotIds: [
            ...(result.excludeSpotIds ?? []),
            ...(result.recommendations ?? []).map((r) => r.spotId),
          ],
        };

        setMessages((prev) => [...prev, assistantMsg]);
        scrollToBottom();

        if (result.shouldNavigate && result.navigateTo) {
          onNavigate?.(result.navigateTo);
        }
        if (result.shouldRegeneratePlan && result.updates) {
          onRegeneratePlan?.(result.updates, result.reply, result.shouldCreatePlan);
        }
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    },
    [loading, messages, context, locale, onNavigate, onRegeneratePlan, onRecordSearch, scrollToBottom],
  );

  useEffect(() => {
    if (!isOpen || !seedMessage || seededRef.current) return;
    seededRef.current = true;
    sendMessage(seedMessage);
  }, [isOpen, seedMessage, sendMessage]);

  useEffect(() => {
    if (!isOpen) seededRef.current = false;
  }, [isOpen]);

  const handleOpenMaps = useCallback(
    (rec) => {
      const url = `https://www.google.com/maps/dir/?api=1&destination=${rec.lat},${rec.lng}&travelmode=walking&hl=${locale === 'en' ? 'en' : 'ja'}`;
      window.open(url, '_blank');
    },
    [locale],
  );

  const handleShare = useCallback(async (rec) => {
    const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${rec.lat},${rec.lng}`;
    const payload = { title: rec.shopName, text: rec.reason, url: mapsUrl };
    try {
      if (navigator.share) await navigator.share(payload);
      else await navigator.clipboard.writeText(`${payload.title}\n${payload.text}\n${mapsUrl}`);
    } catch {
      /* cancelled */
    }
  }, []);

  const handleOpenSpot = useCallback(
    (rec) => {
      const vibe = ENRICHED_VIBES.find((v) => v.spotId === rec.spotId || v.id === rec.vibeId);
      if (vibe) {
        closeConcierge();
        onOpenSpot?.(vibe);
      }
    },
    [closeConcierge, onOpenSpot],
  );

  const handleAlternatives = useCallback(
    (excludeSpotIds) => {
      const msg = locale === 'en' ? 'Show me other options' : '別の候補を見せて';
      sendMessage(msg, { excludeSpotIds });
    },
    [locale, sendMessage],
  );

  const send = useCallback(() => sendMessage(input), [input, sendMessage]);

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[95] bg-black/80 backdrop-blur-xl"
            onClick={closeConcierge}
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 34, stiffness: 320 }}
              onClick={(e) => e.stopPropagation()}
              className="absolute bottom-0 left-0 right-0 mx-auto max-w-lg rounded-t-[28px] border border-white/[0.06] bg-black flex flex-col max-h-[92vh] shadow-[0_-24px_80px_rgba(0,0,0,0.6)]"
            >
              <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.05]">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-purple-500/25 to-blue-500/25 flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-purple-200" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-white">{t('concierge.title')}</p>
                    <p className="text-[10px] text-white/35 mt-0.5">{t('concierge.subtitle')}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={closeConcierge}
                  className="p-2 rounded-full bg-white/[0.06] hover:bg-white/[0.1] transition"
                >
                  <X className="w-5 h-5 text-white/60" />
                </button>
              </div>

              <div ref={listRef} className="flex-1 overflow-y-auto px-5 py-6 space-y-8 min-h-[240px]">
                {messages.length === 0 && !loading && (
                  <div className="py-4">
                    <p className="text-white/40 text-sm text-center mb-6 leading-relaxed font-light">
                      {t('concierge.welcome')}
                    </p>
                    <div className="flex flex-wrap gap-2 justify-center">
                      {quickPrompts.map((prompt) => (
                        <button
                          key={prompt}
                          type="button"
                          onClick={() => sendMessage(prompt)}
                          className="px-3.5 py-2 rounded-full bg-white/[0.04] border border-white/[0.07] text-xs text-white/55 hover:text-white/80 transition"
                        >
                          {prompt}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {messages.map((msg, i) => (
                  <ConciergeMessage
                    key={`msg-${i}`}
                    message={msg}
                    savedSpotIds={saved}
                    onFollowUp={sendMessage}
                    onOpenSpot={handleOpenSpot}
                    onToggleSave={onToggleSave}
                    onOpenMaps={handleOpenMaps}
                    onShare={handleShare}
                    onCreatePlan={(recs) => {
                      closeConcierge();
                      onCreatePlanFromRecs?.(recs);
                    }}
                    onAlternatives={handleAlternatives}
                  />
                ))}

                {loading && (
                  <div className="flex items-center gap-2 text-white/30 text-xs">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
                    {t('concierge.thinking')}
                  </div>
                )}
                {error && <p className="text-amber-300/90 text-xs">{error}</p>}
              </div>

              <div className="p-4 border-t border-white/[0.05] flex gap-2.5 bg-black">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && send()}
                  placeholder={t('concierge.inputPlaceholder')}
                  className="flex-1 rounded-full bg-white/[0.05] border border-white/[0.08] px-5 py-3.5 text-sm text-white/90 placeholder:text-white/25 focus:outline-none focus:border-purple-500/30 transition"
                />
                <button
                  type="button"
                  onClick={send}
                  disabled={loading || !input.trim()}
                  className="p-3.5 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 disabled:opacity-35 transition"
                >
                  <Send className="w-5 h-5 text-white" />
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export function ConciergeFab() {
  const { t } = useLocale();
  const { openConcierge, isOpen } = useConcierge();

  if (isOpen) return null;

  return (
    <motion.button
      type="button"
      onClick={() => openConcierge()}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      className="fixed bottom-[calc(5.5rem+env(safe-area-inset-bottom))] right-5 z-40 flex items-center gap-2.5 pl-4 pr-5 py-3.5 rounded-full bg-[#111] border border-white/[0.08] shadow-[0_8px_32px_rgba(0,0,0,0.5)] backdrop-blur-xl"
      aria-label={t('concierge.open')}
    >
      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
        <Sparkles className="w-3.5 h-3.5 text-white" />
      </div>
      <span className="text-xs font-semibold text-white/85">{t('concierge.fabLabel')}</span>
    </motion.button>
  );
}
