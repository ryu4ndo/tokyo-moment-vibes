import { motion } from 'framer-motion';
import { ArrowLeft, Mail, FileText, Shield } from 'lucide-react';
import { useLocale } from '@/locales/LocaleContext';

const CONTENT = {
  terms: {
    ja: {
      title: '利用規約',
      lastUpdated: '2026-07-05',
      sections: [
        {
          heading: '1. サービスについて',
          body: 'Tokyo Moment Vibes（以下「本サービス」）は、AIを活用した東京体験の発見・プラン作成を支援するアプリです。本サービスは情報提供を目的とし、店舗の営業状況・予約可否等は各店舗にご確認ください。',
        },
        {
          heading: '2. アカウント',
          body: 'Apple、Google、またはゲストとしてご利用いただけます。アカウント情報は端末内および当社の定める方法で管理されます。',
        },
        {
          heading: '3. 禁止事項',
          body: '法令違反、他者の権利侵害、本サービスの不正利用、スクレイピング等を禁止します。',
        },
        {
          heading: '4. 免責',
          body: 'AIによる提案は参考情報です。実際の訪問・予約・安全についてはご自身の判断でお願いします。',
        },
      ],
    },
    en: {
      title: 'Terms of Service',
      lastUpdated: '2026-07-05',
      sections: [
        {
          heading: '1. About the service',
          body: 'Tokyo Moment Vibes helps international visitors and locals discover Tokyo through AI-curated moments and plans. Hours, availability, and reservations must be confirmed with each venue.',
        },
        {
          heading: '2. Accounts',
          body: 'You may sign in with Apple, Google, or continue as a guest. Account data is stored on your device and synced per our privacy policy.',
        },
        {
          heading: '3. Prohibited use',
          body: 'You may not use the service unlawfully, infringe others’ rights, or scrape or abuse our APIs.',
        },
        {
          heading: '4. Disclaimer',
          body: 'AI recommendations are suggestions only. You are responsible for your visits, bookings, and safety.',
        },
      ],
    },
  },
  privacy: {
    ja: {
      title: 'プライバシーポリシー',
      lastUpdated: '2026-07-05',
      sections: [
        {
          heading: '収集する情報',
          body: 'ログイン情報（名前・メールの一部）、保存スポット、閲覧履歴、検索履歴、AIプロフィール（嗜好シグナル）、位置エリア設定を端末内に保存します。',
        },
        {
          heading: '利用目的',
          body: 'パーソナライズされたおすすめ、プラン生成、通知の提供に使用します。第三者への販売は行いません。',
        },
        {
          heading: '外部サービス',
          body: 'OpenAI（AI生成）、Google Maps / Places（地図・店舗情報）を利用する場合、各社のポリシーが適用されます。',
        },
        {
          heading: 'お問い合わせ',
          body: 'データ削除・開示請求はお問い合わせ画面よりご連絡ください。',
        },
      ],
    },
    en: {
      title: 'Privacy Policy',
      lastUpdated: '2026-07-05',
      sections: [
        {
          heading: 'Data we collect',
          body: 'Login info (name, partial email), saved spots, view history, search history, AI taste signals, and area preferences stored on your device.',
        },
        {
          heading: 'How we use it',
          body: 'To personalize recommendations, generate plans, and send in-app notifications. We do not sell your data.',
        },
        {
          heading: 'Third parties',
          body: 'When enabled, OpenAI (AI) and Google Maps / Places (maps & venue data) apply their own policies.',
        },
        {
          heading: 'Contact',
          body: 'For deletion or access requests, use the Contact screen.',
        },
      ],
    },
  },
  contact: {
    ja: {
      title: 'お問い合わせ',
      lastUpdated: '2026-07-05',
      sections: [
        {
          heading: 'サポート',
          body: 'バグ報告、機能要望、データ削除のご依頼は以下までお願いします。',
        },
      ],
      email: 'support@tokyomomentvibes.app',
    },
    en: {
      title: 'Contact',
      lastUpdated: '2026-07-05',
      sections: [
        {
          heading: 'Support',
          body: 'For bugs, feature requests, or data deletion, reach us at:',
        },
      ],
      email: 'support@tokyomomentvibes.app',
    },
  },
};

export function LegalPage({ type = 'terms', onClose }) {
  const { locale } = useLocale();
  const lang = locale === 'en' ? 'en' : 'ja';
  const content = CONTENT[type]?.[lang] ?? CONTENT.terms.ja;
  const Icon = type === 'privacy' ? Shield : type === 'contact' ? Mail : FileText;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-black overflow-y-auto"
    >
      <div className="max-w-lg mx-auto min-h-full pb-16">
        <header className="sticky top-0 z-10 flex items-center gap-3 px-5 py-4 bg-black/90 backdrop-blur-2xl border-b border-white/[0.05]">
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full bg-white/[0.06] hover:bg-white/[0.1] transition"
            aria-label="Back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <Icon className="w-4 h-4 text-purple-300" />
          <h1 className="text-lg font-semibold text-white">{content.title}</h1>
        </header>

        <div className="px-5 py-8 space-y-8">
          {content.lastUpdated && (
            <p className="text-[10px] text-white/30 uppercase tracking-wider">
              {locale === 'en' ? 'Last updated' : '最終更新'}: {content.lastUpdated}
            </p>
          )}
          {content.sections.map((section) => (
            <section key={section.heading}>
              <h2 className="text-sm font-semibold text-white/80 mb-2">{section.heading}</h2>
              <p className="text-sm text-white/50 leading-relaxed">{section.body}</p>
            </section>
          ))}
          {content.email && (
            <a
              href={`mailto:${content.email}`}
              className="inline-flex items-center gap-2 text-sm text-purple-300 hover:text-purple-200 transition"
            >
              <Mail className="w-4 h-4" />
              {content.email}
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
}
