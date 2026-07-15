import { useEffect, useState } from 'react';
import {
  adminLogin,
  adminLogout,
  getAdminSession,
  fetchAdminMetrics,
  fetchAdminBusinesses,
  updateBusinessStatus,
  updateBusinessFlags,
  fetchPlatformEvents,
  savePlatformEvent,
  deletePlatformEvent,
  fetchFeaturedCollections,
  saveFeaturedCollection,
  fetchAdminUsers,
  updateUserStatus,
  fetchReports,
  fetchInquiries,
  fetchAiPriority,
  saveAiPriority,
  fetchAds,
  saveAd,
  fetchAdminSpots,
  updateAdminSpot,
} from '@/platform/services/adminService';
import {
  PortalShell,
  StatCard,
  PortalNavLink,
  PortalInput,
  PortalButton,
  DataTable,
} from '@/platform/components/PortalShell';
import { SponsoredBadge } from '@/platform/components/SponsoredBadge';
import { DEFAULT_AI_PRIORITY } from '@/platform/domain/types';

function useAdminSession() {
  const [session, setSession] = useState(getAdminSession);
  return { session, setSession };
}

function AdminLogin({ onLogin, locale }) {
  const isEn = locale === 'en';
  const [email, setEmail] = useState('admin@tokyomomentvibes.app');
  const [loading, setLoading] = useState(false);
  const handle = async () => {
    setLoading(true);
    try {
      const s = await adminLogin({ email });
      onLogin(s);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen bg-[#0a0a0e] flex items-center justify-center p-6">
      <div className="w-full max-w-md rounded-[24px] border border-white/[0.08] bg-[#111] p-8 space-y-6">
        <div className="text-center">
          <p className="text-[10px] font-bold tracking-[0.3em] text-purple-300/70 uppercase">Admin</p>
          <h1 className="text-2xl font-semibold mt-2">{isEn ? 'Platform admin' : '運営管理'}</h1>
        </div>
        <PortalInput label={isEn ? 'Email' : 'メール'} type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <PortalButton className="w-full" disabled={loading} onClick={handle}>
          {isEn ? 'Sign in' : 'ログイン'}
        </PortalButton>
        <a href="/" className="block text-center text-xs text-white/35 hover:text-white/55">
          {isEn ? '← Back to app' : '← アプリに戻る'}
        </a>
      </div>
    </div>
  );
}

function MiniBarChart({ data }) {
  const max = Math.max(...Object.values(data), 1);
  return (
    <div className="flex items-end gap-1.5 h-24">
      {Object.entries(data).map(([k, v]) => (
        <div key={k} className="flex-1 flex flex-col items-center gap-1">
          <div className="w-full bg-purple-500/30 rounded-t-md" style={{ height: `${(v / max) * 100}%`, minHeight: 4 }} />
          <span className="text-[9px] text-white/35">{k}</span>
        </div>
      ))}
    </div>
  );
}

function AdminOverview({ locale }) {
  const isEn = locale === 'en';
  const [metrics, setMetrics] = useState(null);
  useEffect(() => { fetchAdminMetrics().then(setMetrics); }, []);
  if (!metrics) return <p className="text-white/40">{isEn ? 'Loading...' : '読み込み中...'}</p>;
  return (
    <div className="space-y-8">
      <h2 className="text-xl font-semibold">{isEn ? 'Overview' : '概要'}</h2>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="DAU" value={metrics.dau.toLocaleString()} />
        <StatCard label="MAU" value={metrics.mau.toLocaleString()} />
        <StatCard label={isEn ? 'New users' : '新規ユーザー'} value={metrics.newUsers.toLocaleString()} />
        <StatCard label={isEn ? 'AI usage' : 'AI利用数'} value={metrics.aiUsage.toLocaleString()} sub={`${isEn ? 'Plans' : 'プラン'} ${metrics.plansCreated.toLocaleString()}`} />
      </div>
      <div className="grid lg:grid-cols-2 gap-6">
        <section className="rounded-[16px] border border-white/[0.06] bg-[#111] p-4">
          <h3 className="text-sm font-semibold mb-3">{isEn ? 'Popular areas' : '人気エリア'}</h3>
          <MiniBarChart data={Object.fromEntries(metrics.popularAreas.map((a) => [a.area, a.count]))} />
        </section>
        <section className="rounded-[16px] border border-white/[0.06] bg-[#111] p-4">
          <h3 className="text-sm font-semibold mb-3">{isEn ? 'Popular categories' : '人気カテゴリ'}</h3>
          <MiniBarChart data={Object.fromEntries(metrics.popularCategories.map((c) => [c.category, c.count]))} />
        </section>
      </div>
      <div className="grid lg:grid-cols-2 gap-6">
        <DataTable columns={[{ key: 'query', label: isEn ? 'Search ranking' : '検索ランキング' }, { key: 'count', label: 'Count' }]} rows={metrics.searchRanking} />
        <DataTable columns={[{ key: 'name', label: isEn ? 'Save ranking' : '保存ランキング' }, { key: 'count', label: 'Count' }]} rows={metrics.saveRanking} />
      </div>
    </div>
  );
}

function AdminSpots({ locale }) {
  const isEn = locale === 'en';
  const [spots, setSpots] = useState([]);
  const reload = () => fetchAdminSpots().then(setSpots);
  useEffect(() => { reload(); }, []);
  const toggle = async (spotId, field) => {
    const spot = spots.find((s) => s.spotId === spotId);
    await updateAdminSpot(spotId, { [field]: !spot[field] });
    reload();
  };
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">{isEn ? 'Spot management' : 'スポット管理'}</h2>
      <DataTable
        columns={[
          { key: 'name', label: isEn ? 'Name' : '名前' },
          { key: 'area', label: isEn ? 'Area' : 'エリア' },
          { key: 'featured', label: isEn ? 'Featured' : 'おすすめ', render: (r) => (
            <PortalButton variant="ghost" onClick={() => toggle(r.spotId, 'featured')}>{r.featured ? '★' : '—'}</PortalButton>
          )},
          { key: 'trending', label: isEn ? 'Trending' : 'トレンド', render: (r) => (
            <PortalButton variant="ghost" onClick={() => toggle(r.spotId, 'trending')}>{r.trending ? '🔥' : '—'}</PortalButton>
          )},
          { key: 'sponsored', label: isEn ? 'Sponsor' : 'スポンサー', render: (r) => (
            <span className="flex items-center gap-2">
              <PortalButton variant="ghost" onClick={() => toggle(r.spotId, 'sponsored')}>{r.sponsored ? '✓' : '—'}</PortalButton>
              {r.sponsored && <SponsoredBadge locale={locale} />}
            </span>
          )},
        ]}
        rows={spots.slice(0, 30)}
      />
    </div>
  );
}

function AdminEvents({ locale }) {
  const isEn = locale === 'en';
  const [events, setEvents] = useState([]);
  const [form, setForm] = useState({ type: 'festival', titleJa: '', titleEn: '', area: '渋谷', startDate: '', endDate: '', showOnToday: true, showOnVibes: true, active: true });
  const reload = () => fetchPlatformEvents().then(setEvents);
  useEffect(() => { reload(); }, []);
  const add = async () => {
    await savePlatformEvent(form);
    setForm({ type: 'festival', titleJa: '', titleEn: '', area: '渋谷', startDate: '', endDate: '', showOnToday: true, showOnVibes: true, active: true });
    reload();
  };
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">{isEn ? 'Event CMS' : 'イベント管理'}</h2>
      <p className="text-sm text-white/40">{isEn ? 'Manage Today & Vibes events: fireworks, festivals, seasonal, popups.' : 'Today・Vibesに表示する花火大会・お祭り・季節特集・ポップアップを管理'}</p>
      <div className="grid sm:grid-cols-2 gap-3 max-w-2xl">
        <PortalInput label={isEn ? 'Title (JA)' : 'タイトル'} value={form.titleJa} onChange={(e) => setForm({ ...form, titleJa: e.target.value })} />
        <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className="rounded-xl bg-white/[0.04] border border-white/[0.08] px-3 py-2.5 text-sm self-end">
          <option value="fireworks">{isEn ? 'Fireworks' : '花火大会'}</option>
          <option value="festival">{isEn ? 'Festival' : 'お祭り'}</option>
          <option value="seasonal">{isEn ? 'Seasonal' : '季節特集'}</option>
          <option value="popup">Popup</option>
          <option value="limited">{isEn ? 'Limited' : '期間限定'}</option>
        </select>
        <PortalInput label={isEn ? 'Area' : 'エリア'} value={form.area} onChange={(e) => setForm({ ...form, area: e.target.value })} />
        <PortalInput label={isEn ? 'Start' : '開始'} type="date" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} />
        <PortalInput label={isEn ? 'End' : '終了'} type="date" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} />
      </div>
      <PortalButton onClick={add}>{isEn ? 'Publish' : '掲載する'}</PortalButton>
      <DataTable
        columns={[
          { key: 'titleJa', label: isEn ? 'Title' : 'タイトル' },
          { key: 'type', label: 'Type' },
          { key: 'area', label: isEn ? 'Area' : 'エリア' },
          { key: 'active', label: 'Active', render: (r) => (r.active ? '✓' : '—') },
          { key: 'id', label: '', render: (r) => (
            <PortalButton variant="ghost" onClick={() => deletePlatformEvent(r.id).then(reload)}>{isEn ? 'Delete' : '削除'}</PortalButton>
          )},
        ]}
        rows={events}
      />
    </div>
  );
}

function AdminFeatures({ locale }) {
  const isEn = locale === 'en';
  const [features, setFeatures] = useState([]);
  useEffect(() => { fetchFeaturedCollections().then(setFeatures); }, []);
  const toggle = async (f) => {
    await saveFeaturedCollection({ ...f, active: !f.active });
    fetchFeaturedCollections().then(setFeatures);
  };
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">{isEn ? 'Featured collections' : '特集管理'}</h2>
      <div className="grid sm:grid-cols-2 gap-4">
        {features.map((f) => (
          <div key={f.id} className="rounded-[16px] border border-white/[0.06] bg-[#111] p-4 space-y-2">
            <h3 className="font-semibold">{isEn ? f.titleEn : f.titleJa}</h3>
            <p className="text-xs text-white/40">{isEn ? f.descriptionEn : f.descriptionJa}</p>
            <p className="text-[10px] text-white/30">{f.spotIds?.length ?? 0} spots · {f.season}</p>
            <PortalButton variant="ghost" onClick={() => toggle(f)}>{f.active ? (isEn ? 'Active' : '公開中') : (isEn ? 'Inactive' : '非公開')}</PortalButton>
          </div>
        ))}
      </div>
    </div>
  );
}

function AdminUsers({ locale }) {
  const isEn = locale === 'en';
  const [users, setUsers] = useState([]);
  const [reports, setReports] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  useEffect(() => {
    fetchAdminUsers().then(setUsers);
    fetchReports().then(setReports);
    fetchInquiries().then(setInquiries);
  }, []);
  const suspend = async (userId) => {
    await updateUserStatus(userId, 'suspended');
    fetchAdminUsers().then(setUsers);
  };
  return (
    <div className="space-y-8">
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">{isEn ? 'Users' : 'ユーザー一覧'}</h2>
        <DataTable
          columns={[
            { key: 'name', label: isEn ? 'Name' : '名前' },
            { key: 'email', label: 'Email' },
            { key: 'status', label: 'Status' },
            { key: 'id', label: '', render: (r) => r.status !== 'suspended' && (
              <PortalButton variant="ghost" onClick={() => suspend(r.id)}>{isEn ? 'Suspend' : '利用停止'}</PortalButton>
            )},
          ]}
          rows={users}
        />
      </section>
      <section className="space-y-4">
        <h3 className="font-semibold">{isEn ? 'Reports' : '通報管理'}</h3>
        <DataTable columns={[{ key: 'userId', label: 'User' }, { key: 'reason', label: isEn ? 'Reason' : '理由' }, { key: 'status', label: 'Status' }]} rows={reports} />
      </section>
      <section className="space-y-4">
        <h3 className="font-semibold">{isEn ? 'Inquiries' : '問い合わせ'}</h3>
        <DataTable columns={[{ key: 'email', label: 'Email' }, { key: 'subject', label: isEn ? 'Subject' : '件名' }, { key: 'status', label: 'Status' }]} rows={inquiries} />
      </section>
    </div>
  );
}

function AdminBusinesses({ locale }) {
  const isEn = locale === 'en';
  const [businesses, setBusinesses] = useState([]);
  const reload = () => fetchAdminBusinesses().then(setBusinesses);
  useEffect(() => { reload(); }, []);
  const setStatus = async (id, status) => { await updateBusinessStatus(id, status); reload(); };
  const setFlags = async (id, flags) => { await updateBusinessFlags(id, flags); reload(); };
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">{isEn ? 'Business management' : '店舗管理'}</h2>
      <DataTable
        columns={[
          { key: 'name', label: isEn ? 'Name' : '店舗名' },
          { key: 'area', label: isEn ? 'Area' : 'エリア' },
          { key: 'status', label: 'Status', render: (r) => (
            <select value={r.status} onChange={(e) => setStatus(r.id, e.target.value)} className="rounded-lg bg-white/[0.04] border border-white/[0.08] px-2 py-1 text-xs">
              <option value="pending">{isEn ? 'Pending' : '申請中'}</option>
              <option value="verified">{isEn ? 'Verified' : '認証済'}</option>
              <option value="suspended">{isEn ? 'Suspended' : '掲載停止'}</option>
            </select>
          )},
          { key: 'featured', label: isEn ? 'Featured' : 'おすすめ', render: (r) => (
            <PortalButton variant="ghost" onClick={() => setFlags(r.id, { featured: !r.featured })}>{r.featured ? '★' : '—'}</PortalButton>
          )},
          { key: 'sponsored', label: isEn ? 'Sponsor' : 'スポンサー', render: (r) => (
            <PortalButton variant="ghost" onClick={() => setFlags(r.id, { sponsored: !r.sponsored })}>{r.sponsored ? '✓' : '—'}</PortalButton>
          )},
        ]}
        rows={businesses}
      />
    </div>
  );
}

function AdminAiConfig({ locale }) {
  const isEn = locale === 'en';
  const [config, setConfig] = useState({ ...DEFAULT_AI_PRIORITY });
  const [saved, setSaved] = useState(false);
  useEffect(() => { fetchAiPriority().then(setConfig); }, []);
  const fields = [
    { key: 'eventBoost', label: isEn ? 'Event priority' : 'イベント優先' },
    { key: 'sponsorBoost', label: isEn ? 'Sponsor priority' : 'スポンサー優先' },
    { key: 'localBoost', label: isEn ? 'Local priority' : 'ローカル優先' },
    { key: 'newStoreBoost', label: isEn ? 'New store priority' : '新店舗優先' },
    { key: 'trendingBoost', label: isEn ? 'Trending priority' : 'トレンド優先' },
  ];
  const save = async () => {
    await saveAiPriority(config);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };
  return (
    <div className="space-y-6 max-w-lg">
      <h2 className="text-xl font-semibold">{isEn ? 'AI priority weights' : 'AIおすすめ優先順位'}</h2>
      <p className="text-sm text-white/40">{isEn ? 'Adjust how AI ranks spots in search and recommendations.' : 'AI検索・おすすめの優先度を調整します。'}</p>
      {fields.map(({ key, label }) => (
        <label key={key} className="block space-y-1">
          <span className="text-xs text-white/45">{label}</span>
          <input type="range" min={0} max={50} value={config[key] ?? 0} onChange={(e) => setConfig({ ...config, [key]: Number(e.target.value) })} className="w-full accent-purple-500" />
          <span className="text-xs text-purple-300">{config[key]}</span>
        </label>
      ))}
      <PortalButton onClick={save}>{saved ? (isEn ? 'Saved!' : '保存しました') : (isEn ? 'Save' : '保存')}</PortalButton>
    </div>
  );
}

function AdminAds({ locale }) {
  const isEn = locale === 'en';
  const [ads, setAds] = useState([]);
  const reload = () => fetchAds().then(setAds);
  useEffect(() => { reload(); }, []);
  const add = async (type) => {
    await saveAd({ type, labelJa: type === 'area' ? 'エリア広告' : 'スポンサー', labelEn: type === 'area' ? 'Area ad' : 'Sponsored', active: true, isSponsored: true, area: type === 'area' ? '渋谷' : undefined });
    reload();
  };
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">{isEn ? 'Ad placements' : '広告管理'}</h2>
      <p className="text-sm text-white/40">{isEn ? 'Sponsored content is always labeled separately from organic picks.' : 'スポンサー掲載は通常コンテンツと区別して表示されます。'}</p>
      <div className="flex flex-wrap gap-2">
        {['sponsor', 'area', 'event', 'featured'].map((type) => (
          <PortalButton key={type} variant="ghost" onClick={() => add(type)}>+ {type}</PortalButton>
        ))}
      </div>
      <DataTable
        columns={[
          { key: 'type', label: 'Type' },
          { key: 'labelJa', label: isEn ? 'Label' : 'ラベル' },
          { key: 'active', label: 'Active', render: (r) => (r.active ? '✓' : '—') },
          { key: 'isSponsored', label: '', render: () => <SponsoredBadge locale={locale} /> },
        ]}
        rows={ads}
      />
    </div>
  );
}

const PAGES = ['overview', 'spots', 'events', 'features', 'users', 'businesses', 'ai', 'ads'];

export function AdminApp({ locale = 'ja' }) {
  const { session, setSession } = useAdminSession();
  const [page, setPage] = useState(() => {
    const p = window.location.pathname.replace('/admin', '') || '/';
    return p === '/' ? 'overview' : p.slice(1);
  });

  useEffect(() => {
    const onPop = () => {
      const p = window.location.pathname.replace('/admin', '') || '/';
      setPage(p === '/' ? 'overview' : p.slice(1));
    };
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  const navigate = (path) => {
    window.history.pushState({}, '', `/admin${path === 'overview' ? '' : `/${path}`}`);
    setPage(path);
  };

  if (!session) {
    return <AdminLogin locale={locale} onLogin={setSession} />;
  }

  const isEn = locale === 'en';
  const labels = {
    overview: isEn ? 'Overview' : '概要',
    spots: isEn ? 'Spots' : 'スポット',
    events: isEn ? 'Events' : 'イベント',
    features: isEn ? 'Features' : '特集',
    users: isEn ? 'Users' : 'ユーザー',
    businesses: isEn ? 'Businesses' : '店舗',
    ai: 'AI',
    ads: isEn ? 'Ads' : '広告',
  };

  const nav = PAGES.map((id) => (
    <PortalNavLink key={id} to="#" active={page === id} onClick={(e) => { e.preventDefault(); navigate(id); }}>
      {labels[id]}
    </PortalNavLink>
  ));

  return (
    <PortalShell
      title={isEn ? 'Admin Dashboard' : '運営ダッシュボード'}
      subtitle={isEn ? 'Platform operations' : 'プラットフォーム運営'}
      nav={nav}
      locale={locale}
      onLogout={() => { adminLogout(); setSession(null); }}
    >
      {page === 'overview' && <AdminOverview locale={locale} />}
      {page === 'spots' && <AdminSpots locale={locale} />}
      {page === 'events' && <AdminEvents locale={locale} />}
      {page === 'features' && <AdminFeatures locale={locale} />}
      {page === 'users' && <AdminUsers locale={locale} />}
      {page === 'businesses' && <AdminBusinesses locale={locale} />}
      {page === 'ai' && <AdminAiConfig locale={locale} />}
      {page === 'ads' && <AdminAds locale={locale} />}
    </PortalShell>
  );
}
