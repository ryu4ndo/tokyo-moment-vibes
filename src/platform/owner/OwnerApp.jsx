import { useEffect, useState } from 'react';
import {
  ownerLogin,
  ownerLogout,
  getOwnerSession,
  fetchOwnerBusiness,
  updateOwnerBusiness,
  fetchBusinessEvents,
  saveBusinessEvent,
  fetchBusinessCoupons,
  saveBusinessCoupon,
  fetchBusinessReviews,
  replyToReview,
  fetchBusinessAnalytics,
} from '@/platform/services/businessService';
import { fetchBillingPlans, createCheckout } from '@/platform/services/billingService';
import {
  PortalShell,
  StatCard,
  PortalNavLink,
  PortalInput,
  PortalTextarea,
  PortalButton,
  DataTable,
} from '@/platform/components/PortalShell';
import { Sparkles } from 'lucide-react';

function useOwnerSession() {
  const [session, setSession] = useState(getOwnerSession);
  return { session, setSession };
}

function OwnerLogin({ onLogin, locale }) {
  const isEn = locale === 'en';
  const [email, setEmail] = useState('owner@shop.example.com');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handle = async (provider) => {
    setLoading(true);
    try {
      const s = await ownerLogin({ provider, email, password });
      onLogin(s);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0e] flex items-center justify-center p-6">
      <div className="w-full max-w-md rounded-[24px] border border-white/[0.08] bg-[#111] p-8 space-y-6">
        <div className="text-center">
          <p className="text-[10px] font-bold tracking-[0.3em] text-purple-300/70 uppercase">Owner Portal</p>
          <h1 className="text-2xl font-semibold mt-2">{isEn ? 'Business login' : '店舗ログイン'}</h1>
        </div>
        <PortalInput label={isEn ? 'Email' : 'メール'} type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <PortalInput label={isEn ? 'Password' : 'パスワード'} type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <PortalButton className="w-full" disabled={loading} onClick={() => handle('email')}>
          {isEn ? 'Sign in with email' : 'メールでログイン'}
        </PortalButton>
        <PortalButton className="w-full" variant="ghost" disabled={loading} onClick={() => handle('google')}>
          {isEn ? 'Sign in with Google' : 'Googleでログイン'}
        </PortalButton>
        <a href="/" className="block text-center text-xs text-white/35 hover:text-white/55">
          {isEn ? '← Back to app' : '← アプリに戻る'}
        </a>
      </div>
    </div>
  );
}

function OwnerDashboard({ businessId, locale }) {
  const isEn = locale === 'en';
  const [data, setData] = useState(null);
  useEffect(() => {
    fetchBusinessAnalytics(businessId, locale).then(setData);
  }, [businessId, locale]);
  if (!data) return <p className="text-white/40">{isEn ? 'Loading...' : '読み込み中...'}</p>;
  const { analytics, advice } = data;
  const maxHour = Math.max(...Object.values(analytics.hourlyViews), 1);
  const maxDay = Math.max(...Object.values(analytics.weekdayViews), 1);
  return (
    <div className="space-y-8">
      <h2 className="text-xl font-semibold">{isEn ? 'Dashboard' : 'ダッシュボード'}</h2>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label={isEn ? 'Views' : '閲覧数'} value={analytics.views.toLocaleString()} />
        <StatCard label={isEn ? 'Saves' : '保存数'} value={analytics.saves.toLocaleString()} />
        <StatCard label={isEn ? 'AI picks' : 'AI表示'} value={analytics.aiRecommendations.toLocaleString()} />
        <StatCard label="Traveler" value={`${Math.round(analytics.travelerRatio * 100)}%`} sub={`Local ${Math.round(analytics.localRatio * 100)}%`} />
      </div>
      <div className="grid lg:grid-cols-2 gap-6">
        <section className="rounded-[16px] border border-white/[0.06] bg-[#111] p-4">
          <h3 className="text-sm font-semibold mb-3">{isEn ? 'Popular hours' : '人気時間帯'}</h3>
          <div className="flex items-end gap-2 h-24">
            {Object.entries(analytics.hourlyViews).map(([h, v]) => (
              <div key={h} className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full bg-purple-500/30 rounded-t-md" style={{ height: `${(v / maxHour) * 100}%`, minHeight: 4 }} />
                <span className="text-[9px] text-white/35">{h}:00</span>
              </div>
            ))}
          </div>
        </section>
        <section className="rounded-[16px] border border-white/[0.06] bg-[#111] p-4">
          <h3 className="text-sm font-semibold mb-3">{isEn ? 'Popular days' : '人気曜日'}</h3>
          <div className="flex items-end gap-2 h-24">
            {Object.entries(analytics.weekdayViews).map(([d, v]) => (
              <div key={d} className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full bg-blue-500/30 rounded-t-md" style={{ height: `${(v / maxDay) * 100}%`, minHeight: 4 }} />
                <span className="text-[9px] text-white/35">{d}</span>
              </div>
            ))}
          </div>
        </section>
      </div>
      <section className="rounded-[16px] border border-white/[0.06] bg-[#111] p-4">
        <h3 className="text-sm font-semibold mb-3">{isEn ? 'Popular tags & user attributes' : '人気タグ・ユーザー属性'}</h3>
        <div className="flex flex-wrap gap-2">
          {Object.entries(analytics.tagPopularity).map(([tag, count]) => (
            <span key={tag} className="px-2.5 py-1 rounded-lg bg-white/[0.04] text-xs text-white/60">#{tag} {count}</span>
          ))}
          {Object.entries(analytics.userAttributes).map(([attr, pct]) => (
            <span key={attr} className="px-2.5 py-1 rounded-lg bg-purple-500/10 text-xs text-purple-200/70">{attr} {pct}%</span>
          ))}
        </div>
      </section>
      <section className="rounded-[20px] border border-purple-500/20 bg-purple-500/[0.06] p-5 space-y-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-purple-300" />
          <h3 className="font-semibold">{isEn ? 'AI advice' : 'AI店舗アドバイス'}</h3>
        </div>
        <ul className="space-y-2">
          {advice.map((tip) => (
            <li key={tip} className="text-sm text-white/65 leading-relaxed">· {tip}</li>
          ))}
        </ul>
      </section>
    </div>
  );
}

function OwnerProfile({ businessId, locale }) {
  const isEn = locale === 'en';
  const [biz, setBiz] = useState(null);
  const [saved, setSaved] = useState(false);
  useEffect(() => {
    fetchOwnerBusiness(businessId).then(setBiz);
  }, [businessId]);
  if (!biz) return null;
  const set = (k, v) => setBiz((b) => ({ ...b, [k]: v }));
  const save = async () => {
    await updateOwnerBusiness(businessId, biz);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };
  return (
    <div className="space-y-6 max-w-2xl">
      <h2 className="text-xl font-semibold">{isEn ? 'Store profile' : '店舗情報'}</h2>
      <PortalInput label={isEn ? 'Name' : '店舗名'} value={biz.name} onChange={(e) => set('name', e.target.value)} />
      <PortalTextarea label={isEn ? 'Description' : '説明'} rows={4} value={biz.description} onChange={(e) => set('description', e.target.value)} />
      <PortalInput label={isEn ? 'Price range' : '価格帯'} value={biz.priceRange} onChange={(e) => set('priceRange', e.target.value)} />
      <PortalInput label={isEn ? 'Address' : '住所'} value={biz.address} onChange={(e) => set('address', e.target.value)} />
      <PortalInput label={isEn ? 'Phone' : '電話'} value={biz.phone} onChange={(e) => set('phone', e.target.value)} />
      <PortalInput label="Instagram" value={biz.instagram} onChange={(e) => set('instagram', e.target.value)} />
      <PortalInput label={isEn ? 'Hours open' : '開店'} value={biz.hours?.open} onChange={(e) => set('hours', { ...biz.hours, open: e.target.value })} />
      <PortalInput label={isEn ? 'Hours close' : '閉店'} value={biz.hours?.close} onChange={(e) => set('hours', { ...biz.hours, close: e.target.value })} />
      <PortalInput label={isEn ? 'Closed days (comma)' : '定休日（カンマ区切り）'} value={(biz.hours?.closedDays ?? []).join(', ')} onChange={(e) => set('hours', { ...biz.hours, closedDays: e.target.value.split(',').map((s) => s.trim()).filter(Boolean) })} />
      <PortalInput label="Website" value={biz.website} onChange={(e) => set('website', e.target.value)} />
      <PortalTextarea label={isEn ? 'Menu (one per line)' : 'メニュー（1行1品）'} rows={4} value={(biz.menu ?? []).join('\n')} onChange={(e) => set('menu', e.target.value.split('\n').filter(Boolean))} />
      <PortalTextarea label={isEn ? 'Photo URLs (one per line)' : '写真URL（1行1枚）'} rows={3} value={(biz.photos ?? []).join('\n')} onChange={(e) => set('photos', e.target.value.split('\n').filter(Boolean))} />
      <PortalTextarea label={isEn ? 'Video URLs (one per line)' : '動画URL（1行1本）'} rows={2} value={(biz.videos ?? []).join('\n')} onChange={(e) => set('videos', e.target.value.split('\n').filter(Boolean))} />
      <PortalButton onClick={save}>{saved ? (isEn ? 'Saved!' : '保存しました') : (isEn ? 'Save' : '保存')}</PortalButton>
    </div>
  );
}

function OwnerEvents({ businessId, locale }) {
  const isEn = locale === 'en';
  const [events, setEvents] = useState([]);
  const [form, setForm] = useState({ type: 'event', titleJa: '', titleEn: '', startDate: '', endDate: '', active: true });
  const reload = () => fetchBusinessEvents(businessId).then(setEvents);
  useEffect(() => { reload(); }, [businessId]);
  const add = async () => {
    await saveBusinessEvent(businessId, { ...form, descriptionJa: form.titleJa, descriptionEn: form.titleEn });
    setForm({ type: 'event', titleJa: '', titleEn: '', startDate: '', endDate: '', active: true });
    reload();
  };
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">{isEn ? 'Events & campaigns' : 'イベント・キャンペーン'}</h2>
      <div className="grid sm:grid-cols-2 gap-3 max-w-2xl">
        <PortalInput label={isEn ? 'Title (JA)' : 'タイトル'} value={form.titleJa} onChange={(e) => setForm({ ...form, titleJa: e.target.value })} />
        <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className="rounded-xl bg-white/[0.04] border border-white/[0.08] px-3 py-2.5 text-sm">
          <option value="limited_menu">{isEn ? 'Limited menu' : '期間限定メニュー'}</option>
          <option value="happy_hour">Happy Hour</option>
          <option value="popup">Popup</option>
          <option value="campaign">{isEn ? 'Campaign' : 'キャンペーン'}</option>
        </select>
        <PortalInput label={isEn ? 'Start' : '開始'} type="date" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} />
        <PortalInput label={isEn ? 'End' : '終了'} type="date" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} />
      </div>
      <PortalButton onClick={add}>{isEn ? 'Publish' : '掲載する'}</PortalButton>
      <DataTable
        columns={[
          { key: 'titleJa', label: isEn ? 'Title' : 'タイトル' },
          { key: 'type', label: 'Type' },
          { key: 'startDate', label: isEn ? 'Period' : '期間', render: (r) => `${r.startDate} – ${r.endDate}` },
        ]}
        rows={events}
      />
    </div>
  );
}

function OwnerCoupons({ businessId, locale }) {
  const isEn = locale === 'en';
  const [coupons, setCoupons] = useState([]);
  const defaultCoupon = { type: 'percent', labelJa: '10% OFF', discountPercent: 10, startDate: '2026-01-01', endDate: '2026-12-31', active: true };
  const reload = () => fetchBusinessCoupons(businessId).then(setCoupons);
  useEffect(() => { reload(); }, [businessId]);
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">{isEn ? 'Coupons' : 'クーポン'}</h2>
      <div className="flex flex-wrap gap-2">
        {['10% OFF', 'ドリンク無料', 'ランチ限定'].map((label) => (
          <PortalButton key={label} variant="ghost" onClick={() => saveBusinessCoupon(businessId, { ...defaultCoupon, labelJa: label, type: label.includes('%') ? 'percent' : 'free_item' }).then(reload)}>
            {label}
          </PortalButton>
        ))}
      </div>
      <DataTable columns={[{ key: 'labelJa', label: 'Coupon' }, { key: 'type', label: 'Type' }, { key: 'active', label: 'Active', render: (r) => (r.active ? '✓' : '—') }]} rows={coupons} />
    </div>
  );
}

function OwnerBilling({ businessId, locale }) {
  const isEn = locale === 'en';
  const [plans, setPlans] = useState([]);
  const [biz, setBiz] = useState(null);
  const [loading, setLoading] = useState(false);
  const params = new URLSearchParams(window.location.search);

  useEffect(() => {
    fetchBillingPlans().then((r) => setPlans(r.plans ?? []));
    fetchOwnerBusiness(businessId).then(setBiz);
  }, [businessId]);

  const checkout = async (plan) => {
    setLoading(true);
    try {
      const result = await createCheckout({ businessId, plan });
      if (result.url) window.location.href = result.url;
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-2xl">
      <h2 className="text-xl font-semibold">{isEn ? 'Plans & billing' : 'プラン・課金'}</h2>
      {(params.get('success') || params.get('demo')) && (
        <p className="text-sm text-green-300/80 rounded-xl border border-green-500/20 bg-green-500/10 p-4">
          {isEn ? 'Payment successful — your plan is now active.' : 'お支払いが完了しました。プランが有効になりました。'}
        </p>
      )}
      {biz && (
        <p className="text-sm text-white/45">
          {isEn ? 'Subscription' : 'サブスク'}: {biz.subscriptionStatus ?? (isEn ? 'Free' : '無料')}
          {biz.sponsored && ` · ${isEn ? 'Sponsored' : 'スポンサー掲載中'}`}
        </p>
      )}
      <div className="grid sm:grid-cols-2 gap-4">
        {plans.map((plan) => (
          <div key={plan.id} className="rounded-[20px] border border-white/[0.08] bg-[#111] p-5 space-y-3">
            <h3 className="font-semibold">{plan.label}</h3>
            <ul className="text-xs text-white/45 space-y-1">
              {plan.features?.map((f) => <li key={f}>· {f}</li>)}
            </ul>
            <PortalButton disabled={loading} onClick={() => checkout(plan.id)}>
              {plan.configured ? (isEn ? 'Subscribe' : '申し込む') : (isEn ? 'Try demo' : 'デモで試す')}
            </PortalButton>
          </div>
        ))}
      </div>
      <p className="text-xs text-white/30">
        {isEn ? 'Stripe Checkout — configure STRIPE_* env vars for live billing.' : 'Stripe Checkout — 本番は STRIPE_* 環境変数を設定してください。'}
      </p>
    </div>
  );
}

function OwnerReviews({ businessId, locale }) {
  const isEn = locale === 'en';
  const [reviews, setReviews] = useState([]);
  const [replyDraft, setReplyDraft] = useState({});
  useEffect(() => { fetchBusinessReviews(businessId).then(setReviews); }, [businessId]);
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">{isEn ? 'Reviews' : 'レビュー'}</h2>
      {reviews.map((r) => (
        <div key={r.id} className="rounded-[16px] border border-white/[0.06] bg-[#111] p-4 space-y-3">
          <p className="text-sm font-semibold">{r.author} · ★{r.rating}</p>
          <p className="text-sm text-white/60">{r.text}</p>
          {r.reply ? <p className="text-sm text-purple-200/80 pl-3 border-l-2 border-purple-500/30">{r.reply}</p> : (
            <div className="flex gap-2">
              <input value={replyDraft[r.id] ?? ''} onChange={(e) => setReplyDraft({ ...replyDraft, [r.id]: e.target.value })} placeholder={isEn ? 'Reply...' : '返信...'} className="flex-1 rounded-xl bg-white/[0.04] border border-white/[0.08] px-3 py-2 text-sm" />
              <PortalButton onClick={() => replyToReview(r.id, replyDraft[r.id]).then(() => fetchBusinessReviews(businessId).then(setReviews))}>{isEn ? 'Reply' : '返信'}</PortalButton>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export function OwnerApp({ locale = 'ja' }) {
  const { session, setSession } = useOwnerSession();
  const [page, setPage] = useState(() => {
    const p = window.location.pathname.replace('/owner', '') || '/';
    return p === '/' ? 'dashboard' : p.slice(1);
  });

  useEffect(() => {
    const onPop = () => {
      const p = window.location.pathname.replace('/owner', '') || '/';
      setPage(p === '/' ? 'dashboard' : p.slice(1));
    };
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  const navigate = (path) => {
    window.history.pushState({}, '', `/owner${path === 'dashboard' ? '' : `/${path}`}`);
    setPage(path);
  };

  if (!session) {
    return <OwnerLogin locale={locale} onLogin={setSession} />;
  }

  const isEn = locale === 'en';
  const nav = (
    <>
      {['dashboard', 'profile', 'events', 'coupons', 'reviews', 'billing'].map((id) => (
        <PortalNavLink key={id} to="#" active={page === id} onClick={(e) => { e.preventDefault(); navigate(id); }}>
          {{ dashboard: isEn ? 'Dashboard' : 'ダッシュボード', profile: isEn ? 'Profile' : '店舗情報', events: isEn ? 'Events' : 'イベント', coupons: isEn ? 'Coupons' : 'クーポン', reviews: isEn ? 'Reviews' : 'レビュー', billing: isEn ? 'Billing' : '課金' }[id]}
        </PortalNavLink>
      ))}
    </>
  );

  return (
    <PortalShell
      title={isEn ? 'Owner Portal' : 'オーナーポータル'}
      subtitle={isEn ? 'Manage your listing' : '店舗情報の管理'}
      nav={nav}
      locale={locale}
      onLogout={() => { ownerLogout(); setSession(null); }}
    >
      {page === 'dashboard' && <OwnerDashboard businessId={session.businessId} locale={locale} />}
      {page === 'profile' && <OwnerProfile businessId={session.businessId} locale={locale} />}
      {page === 'events' && <OwnerEvents businessId={session.businessId} locale={locale} />}
      {page === 'coupons' && <OwnerCoupons businessId={session.businessId} locale={locale} />}
      {page === 'reviews' && <OwnerReviews businessId={session.businessId} locale={locale} />}
      {page === 'billing' && <OwnerBilling businessId={session.businessId} locale={locale} />}
    </PortalShell>
  );
}
