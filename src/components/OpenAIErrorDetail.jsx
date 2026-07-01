import { motion } from 'framer-motion';

export function OpenAIErrorDetail({ detail, title = 'OpenAI API エラー詳細' }) {
  if (!detail) return null;

  const env = detail.env ?? {};

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-4 rounded-[24px] border border-red-500/20 bg-red-500/[0.06] backdrop-blur-xl p-5 text-left"
    >
      <div className="text-red-300/90 text-[10px] font-bold tracking-[0.2em] uppercase mb-4">{title}</div>

      <dl className="space-y-3 text-sm">
        <div>
          <dt className="text-white/35 mb-1 text-xs">エラーメッセージ</dt>
          <dd className="font-mono text-red-200/90 break-words text-xs">{detail.message}</dd>
        </div>

        <div className="grid sm:grid-cols-2 gap-3">
          <div>
            <dt className="text-white/35 mb-1 text-xs">HTTPステータス</dt>
            <dd className="font-mono text-white/80 text-xs">{detail.httpStatus ?? '—'}</dd>
          </div>
          <div>
            <dt className="text-white/35 mb-1 text-xs">エラーコード</dt>
            <dd className="font-mono text-white/80 text-xs">{detail.errorCode ?? '—'}</dd>
          </div>
          <div>
            <dt className="text-white/35 mb-1 text-xs">エラー種別</dt>
            <dd className="font-mono text-white/80 text-xs">{detail.errorName ?? '—'}</dd>
          </div>
          <div>
            <dt className="text-white/35 mb-1 text-xs">処理ステップ</dt>
            <dd className="font-mono text-white/80 text-xs">{detail.step ?? '—'}</dd>
          </div>
        </div>

        {detail.responseBody && (
          <div>
            <dt className="text-white/35 mb-1 text-xs">OpenAI APIレスポンス本文</dt>
            <dd className="font-mono text-xs text-white/70 bg-white/[0.03] rounded-2xl p-4 overflow-x-auto whitespace-pre-wrap break-words border border-white/[0.06]">
              {detail.responseBody}
            </dd>
          </div>
        )}

        {detail.cause && (
          <div>
            <dt className="text-white/35 mb-1 text-xs">原因 (cause)</dt>
            <dd className="font-mono text-white/70 break-words text-xs">{detail.cause}</dd>
          </div>
        )}

        <div className="pt-2 border-t border-white/[0.06]">
          <dt className="text-white/35 mb-2 text-xs">.env 読み込み状況</dt>
          <dd className="grid sm:grid-cols-2 gap-2 text-xs font-mono">
            <div className="bg-white/[0.03] rounded-xl p-3 border border-white/[0.06]">
              <span className="text-white/35">キー設定: </span>
              <span className={env.openaiApiKeyConfigured ? 'text-emerald-300' : 'text-red-300'}>
                {env.openaiApiKeyConfigured ? 'あり' : 'なし'}
              </span>
            </div>
            <div className="bg-white/[0.03] rounded-xl p-3 border border-white/[0.06]">
              <span className="text-white/35">形式 (sk-): </span>
              <span className={env.openaiApiKeyFormatValid ? 'text-emerald-300' : 'text-red-300'}>
                {env.openaiApiKeyFormatValid ? '有効' : '無効'}
              </span>
            </div>
            <div className="bg-white/[0.03] rounded-xl p-3 border border-white/[0.06]">
              <span className="text-white/35">モデル: </span>
              <span className="text-white/80">{env.openaiModel ?? '—'}</span>
            </div>
            <div className="bg-white/[0.03] rounded-xl p-3 border border-white/[0.06]">
              <span className="text-white/35">読み込み元: </span>
              <span className="text-white/80">{env.envSource ?? '—'}</span>
            </div>
          </dd>
        </div>
      </dl>
    </motion.div>
  );
}
