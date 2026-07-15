import { AlertCircle, RefreshCw } from 'lucide-react';
import { NeonButton } from '@/components/ui/NeonButton';

export function ErrorState({ title, description, onRetry, retryLabel = 'Retry' }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-6">
      <div className="w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-4">
        <AlertCircle className="w-6 h-6 text-red-300/80" />
      </div>
      <p className="text-base font-semibold text-white/75">{title}</p>
      {description && <p className="text-sm text-white/40 mt-2 max-w-sm leading-relaxed">{description}</p>}
      {onRetry && (
        <NeonButton variant="ghost" onClick={onRetry} className="mt-6">
          <span className="flex items-center gap-2">
            <RefreshCw className="w-4 h-4" />
            {retryLabel}
          </span>
        </NeonButton>
      )}
    </div>
  );
}
