# 花窩職人平台 — 開發計畫與進度紀錄

## 專案概述

YU Florist 客戶的「花窩職人平台」Demo — 將 mockup 轉化為可在手機上操作的互動 PWA。所有資料硬編碼，不串後端，目的是讓客戶體驗完整流程後再決定正式開發方向。

## 技術選型

| 項目 | 選擇 | 原因 |
|------|------|------|
| 框架 | Nuxt 4 (Vue 3) | 專案已建立，SSR/SSG/PWA 支援完整 |
| CSS | Tailwind CSS | 開發速度快，自訂主題方便 |
| 字體 | Noto Sans TC (Google Fonts) | 中文顯示品質好，免費 |
| Icon | @nuxt/icon (Lucide) | 輕量、風格統一 |
| PWA | @vite-pwa/nuxt | standalone 模式，手機加到主畫面像 App |
| 部署 | Vercel 免費方案 | 零成本 Demo |

## 設計系統

從 mockup 萃取的色彩 token（定義在 `tailwind.config.ts`）：

```
hana-header      #5C3344   深紫棕（header 背景漸層起點）
hana-header-light #7A4558  深紫棕（header 背景漸層終點）
hana-cream       #FAF6F0   頁面背景（米白）
hana-wine        #4A2032   主按鈕、深色強調
hana-gold        #8B6914   金額數字、重點資訊
hana-card        #FFFFFF   卡片底色
hana-text        #3D2B1F   主文字
hana-muted       #8C7B75   次要文字
hana-success     #5B8C5A   通過/綠色進度
hana-warning     #D4A017   製作中/待處理
hana-danger      #C0392B   退件/錯誤
hana-border      #E8DDD5   卡片邊框/分隔線
```

## 專案結構

```
app/
├── app.vue
├── assets/css/main.css              # Tailwind directives + 全域樣式 + 頁面轉場
├── layouts/default.vue              # Header + TabBar（sticky 頂部）+ <slot/>
├── pages/
│   ├── index.vue                    # 首頁儀表板
│   ├── scan.vue                     # 掃描 QR Code
│   ├── orders/[id].vue              # 訂單詳情 + 製作講義
│   ├── review.vue                   # 審核管理中心
│   └── revenue.vue                  # 我的分潤
├── components/
│   ├── layout/AppHeader.vue         # 花窩 logo + 大頭貼
│   ├── layout/TabBar.vue            # 4-tab 導航（首頁/掃描/審核/分潤）
│   ├── home/WelcomeBanner.vue       # 紫棕漸層歡迎卡
│   ├── home/QuickActions.vue        # 2×2 快捷功能
│   ├── home/TaskList.vue            # 進行中任務列表
│   ├── order/OrderHeader.vue        # 商品資訊 + 標籤
│   ├── order/InstructionTabs.vue    # 製作步驟/注意事項/品質標準 三 tab
│   ├── order/PhotoUpload.vue        # 照片選取 + 預覽（前端 only）
│   ├── review/ReviewCard.vue        # 審核卡片 + 通過/退件按鈕
│   ├── revenue/RevenueSummary.vue   # 分潤大數字摘要
│   ├── revenue/OrderProgress.vue    # 訂單進度 stepper 卡片
│   ├── revenue/SettlementItem.vue   # 分潤明細單筆
│   ├── ui/StatusBadge.vue           # 通用狀態標籤
│   └── ui/ProgressStepper.vue       # 6 步驟進度條（接案→入帳）
├── data/
│   ├── dashboard.ts                 # 首頁 mock data
│   ├── orders.ts                    # 訂單 + 講義 mock data
│   ├── reviews.ts                   # 審核列表 mock data
│   └── revenue.ts                   # 分潤 + 進度 + 明細 mock data
```

## 各頁面功能與互動

### 首頁（`/`）
- 歡迎卡片：「歡迎回來，秀美媽媽」+ 統計數字
- 快捷功能 2×2 grid，點擊跳轉對應頁面
- 進行中任務列表，點擊跳到訂單詳情

### 掃描接案（`/scan`）
- 模擬 QR Code 掃描框（CSS 動畫，不開真相機）
- 「模擬掃描」按鈕：1.2 秒動畫後跳到 demo 訂單
- 「手動輸入」備案入口

### 訂單詳情（`/orders/[id]`）
- 商品資訊 + 工藝標籤
- 三 tab 講義（製作步驟含編號圓圈、注意事項、品質標準）
- 照片上傳：可從手機相簿選取真實照片並顯示縮圖預覽（不上傳）
- 送出/暫存按鈕觸發 toast 提示

### 審核管理（`/review`）— Demo 重點
- 篩選 tab：全部 / 待審核 / 已完成
- 審核卡片含照片縮圖 + 狀態 badge
- **按「通過」→ 卡片即時變綠**
- **按「退件」→ 卡片即時變紅**
- 寄件通知按鈕觸發 toast
- 照片可點擊放大（lightbox overlay）
- 卡片狀態切換有 transition 動畫

### 我的分潤（`/revenue`）
- 大數字摘要卡（本月累積、入帳日、上月對比、通過率）
- 訂單進度：6 步驟 stepper（接案→製作→上傳→審核→寄件→入帳）
- 分潤明細列表（正金額綠色、負金額紅色）

## Demo 限制（已知，非 bug）

- 所有資料硬編碼，重整頁面會回到初始狀態
- 審核頁的狀態切換不會連動到其他頁面
- 照片上傳只在前端預覽，不實際儲存
- QR Code 掃描是模擬動畫，不開真相機
- PWA icon 目前是 placeholder，正式版需替換

## 開發進度

### Phase 0 — Demo UI 殼（當前）

- [x] 專案初始化 + Tailwind + PWA + 字體設定
- [x] Mock data 4 個檔案
- [x] Layout（AppHeader + TabBar）
- [x] 首頁（WelcomeBanner + QuickActions + TaskList）
- [x] 掃描頁（ScanFrame + 模擬掃描 + 手動輸入）
- [x] 訂單詳情（OrderHeader + InstructionTabs + PhotoUpload + toast）
- [x] 審核管理（ReviewCard + 即時狀態切換 + lightbox + toast）
- [x] 我的分潤（RevenueSummary + ProgressStepper + SettlementItem）
- [x] 頁面轉場動畫 + safe area 支援
- [x] Build 通過（零錯誤）
- [x] 修正 Nuxt 組件自動命名去重問題（OrderOrderHeader → OrderHeader 等）
- [x] 安裝 @iconify-json/lucide（本地 icon，消除 runtime 警告）
- [x] Dev server 全 5 路由 HTTP 200 確認
- [ ] 瀏覽器實測 + 視覺微調
- [ ] Vercel 部署
- [ ] 手機實測（iPhone Safari + Android Chrome）

#### 踩坑紀錄

1. **Nuxt 組件命名去重**：`components/order/OrderHeader.vue` 的自動命名是 `OrderHeader`（不是 `OrderOrderHeader`）。Nuxt 偵測到檔名開頭已包含目錄名時會去重。同理 `review/ReviewCard.vue` → `ReviewCard`、`revenue/RevenueSummary.vue` → `RevenueSummary`。
2. **Lucide icon 需本地安裝**：`@nuxt/icon` 預設從 CDN 拉 icon，dev 模式會有警告。加 `pnpm add -D @iconify-json/lucide` 改為本地解析，效能更好且離線可用。

### Phase 0.5 — 轉原生 App（已實作 iOS）

> 技術決策紀錄（2026-06-18 討論）+ 實作紀錄

**結論：用 Capacitor，不用 Flutter。**

| 路徑 | 現有程式碼復用率 | 額外工時 | 適合場景 |
|------|-----------------|---------|---------|
| **Capacitor（推薦）** | ~95% | 1-2 天 | 需要上架 App Store / Google Play |
| Flutter | 0%（全部重寫） | 4-6 週 | 需要高度客製原生動畫（本案不需要） |
| React Native | 0%（全部重寫） | 3-5 週 | 團隊已有 RN 經驗（本案不適用） |

**已完成的實作步驟：**
- [x] 安裝 `@capacitor/core` `@capacitor/cli` `@capacitor/ios`（v8.4.0）
- [x] 建立 `capacitor.config.ts`（appId: `com.yuflorist.hanawu`，webDir: `.output/public`）
- [x] `nuxt.config.ts` 加上 `ssr: false` 改為 SPA 模式（Capacitor 需要靜態檔案）
- [x] `pnpm generate` 產出靜態站到 `.output/public/`
- [x] `npx cap add ios` 建立 iOS 原生專案
- [x] `npx cap sync ios` 同步 web assets
- [x] `npx cap open ios` 開啟 Xcode

**更新程式碼到 iPhone 的指令：**
```bash
pnpm generate && npx cap sync ios
# 然後在 Xcode 按 ▶ Run
```

**在 Xcode 中裝到 iPhone 的步驟：**
1. 左側導覽器點擊最頂層 **App**（藍色 project icon）
2. 中間面板 → **Signing & Capabilities** tab → **Team** 下拉選你的 Apple ID
3. 左上角設備選擇器選你的 iPhone（USB 接上）
4. 按 ▶ Run
5. 首次裝機：iPhone 設定 → 一般 → VPN 與裝置管理 → 信任開發者憑證

**額外獲得的原生能力（未來可加）：**
- `@capacitor/camera` — QR Code 掃描改用真相機
- `@capacitor/push-notifications` — 推播通知
- `@capacitor/filesystem` — 本地檔案存取

**Android 也走同一條路（尚未實作，需要時加入）：**

```bash
npx cap add android         # 建立 Android 原生專案
pnpm generate               # 產出靜態站
npx cap sync android        # 同步 web assets
npx cap open android        # 開啟 Android Studio
```

| 比較 | iOS | Android |
|------|-----|---------|
| IDE | Xcode | Android Studio |
| 開發者帳號 | USD$99/年 | USD$25 一次性 |
| 免費裝實機 | 7 天有效期 | 無限制，USB 直接裝 |
| 開發平台限制 | macOS only | macOS / Windows / Linux |
| 上架審核 | 1-2 週 | 1-3 天 |

**注意事項：**
- 個人免費 Apple ID 也能裝到自己 iPhone，有效期 7 天，到期重裝即可（Demo 夠用）
- Android 更簡單 — 開啟 USB 偵錯就能裝，不需簽名或信任憑證
- iOS 審核約 1-2 週，WebView App 有時會被挑剔，但有實質功能通常會過
- 現有 Vue 組件、Tailwind 樣式、路由 iOS / Android 完全共用，零修改

#### 踩坑紀錄

3. **Capacitor 8 預設用 SPM**：Capacitor 8.4.0 新專案預設使用 Swift Package Manager（不是 CocoaPods）。iOS 目錄下有 `CapApp-SPM/` 而非 `Podfile`。CocoaPods 已非必要，但裝了不影響。
4. **Nuxt 需改為 SPA 模式**：Capacitor 載入的是本地靜態檔案，所以 `nuxt.config.ts` 必須加 `ssr: false`，並用 `pnpm generate` 產出到 `.output/public/`。

### Phase 1 — MVP（未來，需串後端）

> 以下為正式開發時的規劃，Demo 階段不實作。

- [ ] Supabase 串接（DB + Auth + Storage）
- [ ] 認證登入（LINE Login 或 OTP）
- [ ] 真實 QR Code 掃描（html5-qrcode 或 Capacitor Camera）
- [ ] 照片壓縮 + 雲端上傳
- [ ] 審核結果持久化 + 通知（LINE Notify）
- [ ] 分潤計算邏輯 + 對帳報表
- [ ] 管理後台（商品講義 CMS + 訂單管理）
