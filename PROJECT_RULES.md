# Tokyo Moment Vibes — PROJECT RULES

新しい Cursor チャットでこのファイルを読めば、開発を継続できます。

---

## ブランドコンセプト

- **名前:** Tokyo Moment Vibes
- **キャッチコピー:** Find Your Tokyo Moment. / Discover Tokyo, One Moment at a Time.
- **本質:** レストラン検索アプリではない。AIが「その瞬間」に最適な東京体験を提案するライフスタイルアプリ
- **対象:** 海外旅行者 + 東京を再発見したい日本人

---

## 絶対に守るコンセプト

1. **Moment first** — リスト表示より「雰囲気・体験・一瞬」を優先
2. **Local vs Traveler** — 同じスポットでも体験タグ・AIコピーが変わる
3. **Companion aware** — 一人/カップル/友達などで提案が変わる
4. **Bilingual** — JA/EN は直訳ではなく文化的に適応
5. **No generic travel app** — ガイドブック的な網羅性より、今夜の一瞬

---

## デザインルール

- ダークベース + グラスモーフィズム + ネオンピンク/パープルアクセント
- Framer Motion で軽いトランジション（過剰なアニメーション禁止）
- モバイルファースト（max-w-2xl、VIBESのみ max-w-6xl）
- Tailwind v4 + `@/` エイリアス
- **UI変更は意図的なときのみ** — リファクタ時は見た目を変えない

---

## UIルール

| 領域 | ルール |
|------|--------|
| Header | 場所・時間・体験モード・同行者・言語 |
| VIBES | Pinterest風グリッド、Today's AI Pick、詳細はリール風 |
| PLAN | タイムライン + マップ + AI/ローカル生成 |
| Reserve | 外部予約サイトへディープリンク（新規タブ） |
| Chat | 右下フローティング、条件変更でプラン再生成 |

---

## 命名規則

| 種別 | 規則 | 例 |
|------|------|-----|
| ページ | `*Page.jsx` | `HomePage.jsx` |
| 機能コンポーネント | `features/{domain}/` | `VibeDetail.jsx` |
| 共通UI | `components/ui/` | `NeonButton.jsx` |
| サービス | `*Service.js` | `planService.js` |
| Context | `*Context.jsx` | `AppStateContext.jsx` |
| Hook | `use*.js` | `usePlanGeneration.js` |
| データ | 複数形 | `spots.js`, `moods.js` |

---

## React設計

- **状態:** `AppStateContext` に集約（Language, Experience, Companion, Mood, Location, Time, Saved）
- **Props:** ページ間の受け渡しは最小化。Context + hooks を優先
- **インポート:** `@/` エイリアスを使用
- **遅延読込:** Map など重いコンポーネントは `lazy()`
- **ErrorBoundary:** VIBES タブに適用済み

---

## API設計

- クライアント → `src/services/` → Express `server/routes/api.js`
- APIキーはサーバー側（`GOOGLE_PLACES_API_KEY`, `OPENAI_API_KEY`）
- クライアント公開キーのみ `VITE_*` プレフィックス
- Google Places 未設定時は `data/spots.js` にフォールバック

### エンドポイント

| Method | Path | 用途 |
|--------|------|------|
| POST | `/api/generate-plan` | AIプラン生成 |
| POST | `/api/plan-from-text` | 自然言語 → プラン |
| POST | `/api/chat` | AIチャット + プラン再生成意図 |
| POST | `/api/places/search` | 場所検索 |
| GET | `/api/places/details` | 場所詳細 |

---

## コンポーネント設計

```
App
├── AppHeader (HomeHero, LocationSelector, TimeSelector, ExperienceSelector, CompanionSelector)
├── pages/ (Home, Food, Vibes, Saved, Plan)
├── features/
│   ├── chat/AIChat
│   ├── plan/PlanDetail, PlanTimeline, Map
│   ├── vibes/VibeDetail, VibeCard
│   └── spots/SpotCard, BookmarkButton, ReserveLinks
└── BottomNav
```

---

## 今後追加する機能（優先順）

1. Weather API 本実装
2. 予約プラットフォーム公式 API
3. ユーザーコレクションのクラウド同期
4. プラン共有（URL / SNS）
5. パフォーマンス最適化（spots データ分割）

---

## 開発フロー

```bash
npm install
cp .env.example .env   # APIキー設定
npm run dev            # クライアント + API 同時起動
npm run build          # 本番ビルド
npm run lint           # ESLint
```

**起動は `npm run dev` のみ。** 古いターミナルの dev サーバーは停止してから起動。

---

## 環境変数

| 変数 | 必須 | 用途 |
|------|------|------|
| `OPENAI_API_KEY` | AI機能に必須 | プラン・チャット |
| `VITE_GOOGLE_MAPS_API_KEY` | 任意 | インタラクティブマップ |
| `GOOGLE_PLACES_API_KEY` | 任意 | 写真・レビュー・営業時間 |
| `PORT` | 任意 | APIポート（default: 3001） |

---

## 参照ファイル

- 進捗: `PROJECT_STATUS.md`
- セットアップ: `README.md`
- 環境変数例: `.env.example`
