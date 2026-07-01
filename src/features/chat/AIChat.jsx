import { useCallback, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Send, Sparkles, X } from 'lucide-react';
import { sendChatMessage } from '@/services/chatService';
import { useLocale } from '@/locales/LocaleContext';
import { useAppState } from '@/contexts/AppStateContext';
import { getMoodLabel } from '@/data/moods';

const QUICK_PROMPTS = {
  ja: [
    '雨だから屋内だけ',
    '英語メニューがある店',
    '1万円以内',
    'バーを増やして',
  ],
  en: [
    'Indoor only — it\'s raining',
    'Places with English menu',
    'Under ¥10,000',
    'Add more bars',
  ],
};

export function AIChat({ onRegeneratePlan }) {
  const { t, locale } = useLocale();
  const {
    experienceMode,
    companion,
    mood,
    location,
    freeTime,
    nextPlan,
    weather,
  } = useAppState();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const listRef = useRef(null);

  const context = useMemo(
    () => ({
      locale,
      experienceMode,
      companion,
      mood: getMoodLabel(mood, locale),
      location,
      freeTime,
      nextPlan,
      weather,
    }),
    [locale, experienceMode, companion, mood, location, freeTime, nextPlan, weather]
  );

  const quickPrompts = QUICK_PROMPTS[locale] ?? QUICK_PROMPTS.ja;

  const sendMessage = useCallback(
    async (text) => {
      const trimmed = text.trim();
      if (!trimmed || loading) return;

      const userMsg = { role: 'user', content: trimmed };
      const nextMessages = [...messages, userMsg];
      setMessages(nextMessages);
      setInput('');
      setLoading(true);
      setError(null);

      try {
        const result = await sendChatMessage({ messages: nextMessages, context });
        setMessages((prev) => [...prev, { role: 'assistant', content: result.reply }]);
        setTimeout(() => listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' }), 50);

        if (result.shouldRegeneratePlan && result.updates) {
          onRegeneratePlan?.(result.updates, result.reply);
        }
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    },
    [loading, messages, context, onRegeneratePlan]
  );

  const send = useCallback(() => sendMessage(input), [input, sendMessage]);

  return (
    <>
      <motion.button
        type="button"
        onClick={() => setOpen(true)}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        className="fixed bottom-24 right-5 z-40 flex items-center gap-2 pl-4 pr-5 py-3 rounded-full glass-panel shadow-premium border border-white/[0.08]"
        aria-label={t('chat.open')}
      >
        <Sparkles className="w-4 h-4 text-pink-300/80" />
        <span className="text-xs font-semibold text-white/80">{t('chat.askLabel')}</span>
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[90] bg-black/70 backdrop-blur-md"
            onClick={() => setOpen(false)}
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 32, stiffness: 340 }}
              onClick={(e) => e.stopPropagation()}
              className="absolute bottom-0 left-0 right-0 mx-auto max-w-lg rounded-t-[28px] border border-white/[0.08] bg-[#0a0a0c] shadow-premium flex flex-col max-h-[88vh]"
            >
              <div className="flex items-center justify-between p-5 border-b border-white/[0.06]">
                <div className="flex items-center gap-2.5">
                  <Sparkles className="w-5 h-5 text-pink-300/70" />
                  <div>
                    <p className="font-semibold text-sm">{t('chat.askLabel')}</p>
                    <p className="text-[10px] text-white/35 mt-0.5">{t('chat.subtitle')}</p>
                  </div>
                </div>
                <button type="button" onClick={() => setOpen(false)} className="p-2 rounded-full glass-panel">
                  <X className="w-5 h-5 text-white/60" />
                </button>
              </div>

              <div ref={listRef} className="flex-1 overflow-y-auto p-5 space-y-3 min-h-[200px]">
                {messages.length === 0 && (
                  <div className="py-6">
                    <p className="text-white/35 text-sm text-center mb-5 leading-relaxed">{t('chat.placeholder')}</p>
                    <div className="flex flex-wrap gap-2 justify-center">
                      {quickPrompts.map((prompt) => (
                        <button
                          key={prompt}
                          type="button"
                          onClick={() => sendMessage(prompt)}
                          className="px-3 py-2 rounded-full glass-panel text-xs text-white/60 hover:text-white/85 transition"
                        >
                          {prompt}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                {messages.map((msg, i) => (
                  <div
                    key={`${msg.role}-${i}`}
                    className={`max-w-[88%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                      msg.role === 'user'
                        ? 'ml-auto bg-pink-500/15 border border-pink-500/20 text-white/90'
                        : 'bg-white/[0.04] border border-white/[0.06] text-white/75'
                    }`}
                  >
                    {msg.content}
                  </div>
                ))}
                {loading && (
                  <p className="text-white/30 text-xs animate-pulse px-1">{t('chat.thinking')}</p>
                )}
                {error && <p className="text-amber-300/90 text-xs px-1">{error}</p>}
              </div>

              <div className="p-4 border-t border-white/[0.06] flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && send()}
                  placeholder={t('chat.inputPlaceholder')}
                  className="flex-1 rounded-2xl glass-panel px-4 py-3 text-sm text-white/85 placeholder:text-white/25"
                />
                <button
                  type="button"
                  onClick={send}
                  disabled={loading || !input.trim()}
                  className="p-3 rounded-2xl bg-gradient-to-r from-pink-500/90 to-fuchsia-500/90 disabled:opacity-35 transition"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
