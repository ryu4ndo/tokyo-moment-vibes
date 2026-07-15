import { motion } from 'framer-motion';
import { ArrowLeft, Bell } from 'lucide-react';
import { useLocale } from '@/locales/LocaleContext';
import { useNotifications } from '@/contexts/NotificationContext';
import { EmptyState } from '@/components/ui/EmptyState';

export function NotificationInbox({ open, onClose, onSelectSpot, onOpenSearch }) {
  const { t } = useLocale();
  const { notifications, markRead, markAllRead } = useNotifications();

  if (!open) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[95] bg-black/95 backdrop-blur-xl"
    >
      <div className="max-w-lg mx-auto min-h-full flex flex-col">
        <header className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06]">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-full bg-white/[0.06] hover:bg-white/[0.1] transition"
              aria-label={t('common.back')}
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-lg font-semibold text-white">{t('notifications.title')}</h1>
          </div>
          {notifications.length > 0 && (
            <button
              type="button"
              onClick={markAllRead}
              className="text-xs text-purple-300/80 hover:text-purple-300 transition"
            >
              {t('notifications.markAllRead')}
            </button>
          )}
        </header>

        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-2">
          {notifications.length === 0 ? (
            <EmptyState
              icon={Bell}
              title={t('notifications.empty')}
              description={t('notifications.emptyDesc')}
            />
          ) : (
            notifications.map((n, i) => (
              <motion.button
                key={n.id}
                type="button"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                onClick={() => {
                  markRead(n.id);
                  if (n.spotId) onSelectSpot?.(n.spotId);
                  else if (n.action === 'search') {
                    onClose();
                    onOpenSearch?.();
                  }
                }}
                className={`w-full text-left rounded-[16px] border p-4 transition ${
                  n.read
                    ? 'border-white/[0.04] bg-white/[0.02]'
                    : 'border-purple-500/20 bg-purple-500/[0.06]'
                }`}
              >
                <div className="flex items-start gap-3">
                  <span className="text-xl shrink-0">{n.icon}</span>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-white">{n.title}</p>
                    <p className="text-xs text-white/50 mt-1 leading-relaxed">{n.body}</p>
                  </div>
                </div>
              </motion.button>
            ))
          )}
        </div>
      </div>
    </motion.div>
  );
}
