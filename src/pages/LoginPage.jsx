import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useLocale } from '@/locales/LocaleContext';
import { NeonButton } from '@/components/ui/NeonButton';

function ProviderButton({ icon, label, onClick, variant = 'ghost' }) {
  return (
    <NeonButton variant={variant} fullWidth onClick={onClick}>
      <span className="flex items-center justify-center gap-3">
        <span className="text-lg">{icon}</span>
        {label}
      </span>
    </NeonButton>
  );
}

export function LoginPage({ onOpenLegal }) {
  const { t } = useLocale();
  const { loginWithApple, loginWithGoogle, loginAsGuest, isHydrating } = useAuth();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-[100] bg-black flex items-center justify-center p-6"
    >
      <div className="w-full max-w-sm space-y-10">
        <div className="text-center space-y-4">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
            <Sparkles className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-white">{t('auth.title')}</h1>
            <p className="text-sm text-white/45 mt-2 leading-relaxed">{t('auth.subtitle')}</p>
          </div>
        </div>

        <div className="space-y-3">
          <ProviderButton
            icon=""
            label={`  ${t('auth.apple')}`}
            onClick={loginWithApple}
            variant="white"
          />
          <ProviderButton icon="G" label={t('auth.google')} onClick={loginWithGoogle} />
          <button
            type="button"
            onClick={loginAsGuest}
            disabled={isHydrating}
            className="w-full py-3.5 text-sm font-medium text-white/45 hover:text-white/70 transition disabled:opacity-40"
          >
            {t('auth.guest')}
          </button>
        </div>

        <p className="text-[11px] text-white/25 text-center leading-relaxed">{t('auth.syncNote')}</p>
        <p className="text-[10px] text-white/20 text-center leading-relaxed">
          {t('auth.legalPrefix')}{' '}
          <button type="button" onClick={() => onOpenLegal?.('terms')} className="underline hover:text-white/40">
            {t('legal.terms')}
          </button>
          {' · '}
          <button type="button" onClick={() => onOpenLegal?.('privacy')} className="underline hover:text-white/40">
            {t('legal.privacy')}
          </button>
        </p>
      </div>
    </motion.div>
  );
}
