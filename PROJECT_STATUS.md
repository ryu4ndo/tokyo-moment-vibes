# Tokyo Moment Vibes

## ブランド

**Find Your Tokyo Moment.**

---

## コンセプト

AIがその瞬間に最適な東京体験を提案するライフスタイルアプリ。  
レストラン検索アプリではなく、「東京の一瞬（Moment）」を発見する体験プラットフォーム。

---

## 完了

- ✅ ブランド変更（Tokyo Moment Vibes）
- ✅ Language切替（JA / EN、localStorage永続化）
- ✅ Local / Traveler 体験モード
- ✅ Companion 選択（Solo / Couple / Friends / Family / Business / Backpacker）
- ✅ VIBES グリッド・詳細・保存
- ✅ AIプラン生成（ローカル + OpenAI）
- ✅ Google Places / Maps 連携（APIキーあり時）
- ✅ 予約リンク（食べログ / Hot Pepper / TableCheck / OpenTable）
- ✅ AIチャット（条件変更 → プラン再生成）
- ✅ SAVED コレクション
- ✅ プロジェクト構成整理（2026-06）

---

## 開発中

- 🚧 Google Places 本番データの全画面統合
- 🚧 Weather API 連携
- 🚧 予約API（各プラットフォーム公式API）

---

## 未実装 / 改善余地

- ⬜ 本番デプロイパイプライン
- ⬜ E2Eテスト
- ⬜ ユーザー認証・クラウド保存
- ⬜ オフライン対応

---

## API

| サービス | 状態 | 備考 |
|---------|------|------|
| OpenAI | ✅ 実装済 | プラン生成・チャット・テキスト意図解析 |
| Google Maps | ✅ 実装済 | 埋め込み + JS API（`VITE_GOOGLE_MAPS_API_KEY`） |
| Google Places | ✅ 実装済 | サーバープロキシ（`GOOGLE_PLACES_API_KEY`） |
| Weather | ⬜ 予定 | 現在はモック天気 |
| Reservation | ⬜ 予定 | 現在はディープリンク |

---

## フォルダ構成（整理後）

```
src/
├── api/           # APIルート定義
├── assets/
├── components/    # 共通UI・レイアウト
├── contexts/      # AppStateContext（言語・体験・同行者・場所・時間など）
├── data/          # 静的データ（spots, vibes, moods）
├── features/      # 機能別（chat, plan, vibes, spots）
├── hooks/         # カスタムフック
├── locales/       # i18n
├── pages/         # タブ画面
├── services/      # APIクライアント
├── styles/
└── utils/
server/            # Express API
```

---

## 今後のロードマップ

| Phase | 内容 |
|-------|------|
| Phase 1 | MVP（現在地） |
| Phase 2 | Beta（本番API・パフォーマンス） |
| Phase 3 | Public Release |

---

## 現在の課題

- 開発サーバーが複数起動するとポートが枯渇する → `npm run dev` 1本に統一済み
- `spots.js` が大きい（将来的に分割推奨）
- ESLint: 一部既存の react-hooks 警告が残存（機能影響なし）

---

## 次にやること

1. `.env` に APIキーを設定し `npm run dev` で動作確認
2. Google Places 本番キーで VibeDetail の写真・レビューを検証
3. Weather API サービスを `src/services/weatherService.js` に追加
4. `spots.js` をエリア別に分割（`data/spots/`）

起動: `npm run dev` → http://localhost:5173
