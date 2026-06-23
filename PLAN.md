# 花寓職人平台 — 開發計畫與進度紀錄

## 專案概述

YU Florist 的「花寓職人平台」— 管理員派發訂單給職人，職人製作後上傳成品照審核，通過後寄回基地結算分潤。

- **線上 Demo**：https://hanawu.vercel.app
- **Vercel 帳號**：karelom
- **Supabase 專案**：`nopulrmtnpavzqdbgduv`
- **部署模式**：SPA（`ssr: false`）+ Vercel
- **更新部署**：`vercel deploy --prod`

## 技術選型

| 項目 | 選擇 | 原因 |
|------|------|------|
| 框架 | Nuxt 4 (Vue 3) | SSR/SSG/PWA 完整支援 |
| CSS | Tailwind CSS | 自訂 `hana-*` 色彩主題 |
| DB / Auth / Storage | Supabase 免費方案 | 一站搞定，10 人規模可撐 20 個月 |
| 行動裝置 | Capacitor 8 (SPM) | 現有程式碼 95% 復用 |
| 部署 | Vercel 免費方案 | 零主機費 |

## 開發進度

### Phase 0 — Demo UI 殼 ✅

5 頁面 + 15 組件，高度還原 mockup，資料硬編碼。

### Phase 0.5 — Capacitor iOS ✅

```bash
pnpm generate && npx cap sync ios  # 更新後在 Xcode 按 Run
```

### Phase 1 — MVP（進行中）

**已完成：**
- [x] Supabase 專案 + init.sql（6 張表 + RLS + Storage + 索引 + 觸發器）
- [x] `@nuxtjs/supabase` 整合
- [x] TypeScript 型別系統（enums → dto → utils/CamelCaseKeys → index）
- [x] `utils/caseConverter.ts`（snakeToCamel / camelToSnake）
- [x] CSS 拆分到 `assets/styles/` partials
- [x] Email magic link 登入 + `/confirm` callback 頁
- [x] `useAuth` composable（fetchProfile 有快取 + getUser 取可靠 id）
- [x] `useGuard` composable（denyWith 統一轉導提示）
- [x] `auth.global.ts`（唯一載入 profile 的入口 + session 無效自動登出）
- [x] `admin.ts` middleware（只讀 isAdmin，不呼叫 fetchProfile）
- [x] TabBar 角色適配（職人 4 tab / 管理員 4 tab）
- [x] 職人帳號管理頁（`/admin/artisans`）+ server API（create / toggle）
- [x] 管理員帳號建立（David, role=admin）

**待做：**
- [ ] 商品模板管理頁（`/admin/products`）
- [ ] 訂單管理頁（`/admin/orders`）+ QR Code 生成
- [ ] 照片上傳（壓縮 + Supabase Storage）
- [ ] 審核管理頁（真實操作 + 退件率）
- [ ] 分潤管理頁 + 匯出 Excel
- [ ] App 內通知
- [ ] 整合測試 + 部署

---

## 驗證流程架構

### 三個 API 的定位

| API | 用途 | 何時用 |
|-----|------|--------|
| `useSupabaseUser()` | 快速判斷有沒有 session（不發 request） | middleware 判斷跳不跳 /login |
| `supabase.auth.getUser()` | 向 server 驗證 JWT，取可靠 user.id | fetchProfile 內部 |
| `fetchProfile()` | 查 DB 拿 name/role/isActive，存 useState 快取 | **只由 auth.global.ts 呼叫** |

### 流程

```
auth.global.ts（每次路由切換，最早跑）
  ├── !user && 非公開頁面 → denyWith('請先登入', '/login')
  ├── user && path === '/login' → navigateTo('/')
  └── user && !profile → await fetchProfile()
        ├── getUser() null → session 無效 → signOut + 跳 /login
        └── 成功 → 存 profile → 繼續

admin.ts（auth.global 之後跑，profile 保證已載入）
  └── !isAdmin → denyWith('您沒有管理員權限')

其他所有地方（TabBar, 頁面, 組件）→ 只讀 profile / isAdmin / isArtisan
```

### 登入模式

| 模式 | 設定 | 用途 |
|------|------|------|
| Email magic link | `AUTH_MODE = 'email'`（目前） | 開發測試用，免費 |
| 手機 SMS OTP | `AUTH_MODE = 'phone'` | 正式上線用，需接 Twilio（~NT$1.5/則） |

切換只改 `useAuth.ts` 的 `AUTH_MODE` 常數 + `login.vue` 自動適配。

---

## 資料庫（6 張表）

`supabase/init.sql` 一次執行。順序：建表 → 函數 → 索引 → RLS → Storage → 觸發器。

| 表 | 用途 |
|----|------|
| `profiles` | 用戶帳號（id 綁 auth.users，role: admin/artisan，is_active） |
| `products` | 商品講義模板（steps/notes/quality 分三個 jsonb 欄位） |
| `orders` | 訂單（從模板複製講義後脫鉤，含 cancel_reason） |
| `submissions` | 送審紀錄（一筆訂單可多次送審，退件次數用 COUNT 算） |
| `settlements` | 分潤記錄（shipping_status + payment_status） |
| `notifications` | App 內通知（user_id + is_read） |

### RLS 規則摘要

- 職人只看自己的 orders / submissions / settlements
- 管理員看全部 + 可寫
- `is_admin()` 函數用 `SECURITY DEFINER` 繞過 RLS 自引用

### 訂單狀態

```
draft → accepted → reviewing → approved → shipping → settled
                       ↓
                   rejected → reviewing（循環）
任何狀態 → cancelled（需填原因，接單後不可逆）
```

可換人/可改內容：`draft` / `accepted` / `rejected`
鎖定：`reviewing` 以後（備註除外）

---

## 前端架構

### 目錄結構（現在實際狀態）

```
app/
├── app.vue                              # 純 layout 殼，不做 auth 邏輯
├── assets/styles/                       # CSS partials（@import 在 @tailwind 之前）
├── layouts/
│   ├── default.vue                      # Header + TabBar + slot
│   └── auth.vue                         # 登入頁 layout（只有 logo）
├── middleware/
│   ├── auth.global.ts                   # 唯一載入 profile 的地方
│   └── admin.ts                         # 只讀 isAdmin
├── pages/
│   ├── login.vue                        # Email magic link / Phone OTP（依 AUTH_MODE）
│   ├── confirm.vue                      # Magic link callback（等 user 出現後跳 /）
│   ├── index.vue, scan.vue, review.vue, revenue.vue
│   ├── orders/[id].vue
│   └── admin/artisans.vue               # ✅ 已完成
├── composables/
│   ├── useAuth.ts                       # fetchProfile（有快取 + getUser）、sendOtp、signOut
│   ├── useGuard.ts                      # denyWith(reason, redirectTo)
│   └── useArtisans.ts                   # 職人 CRUD + 退件率統計
├── components/
│   ├── layout/AppHeader.vue, TabBar.vue # TabBar 依角色動態顯示
│   ├── admin/ArtisanForm.vue            # ✅ 已完成
│   └── （Demo 組件保留，待改為從 DB 讀取）
├── types/
│   ├── enums.ts                         # UPPER_SNAKE_CASE enum
│   ├── dto.ts                           # 鏡像 DB snake_case（文件用途）
│   ├── utils.ts                         # CamelCaseKeys<T> 型別轉換器
│   └── index.ts                         # 前端 Model = CamelCaseKeys<DTO> + enum override
├── utils/caseConverter.ts               # snakeToCamel / camelToSnake
└── data/                                # Demo mock data（待刪除，被 composable + DB 取代）

server/api/admin/
├── create-artisan.post.ts               # service_role 建帳號
└── toggle-artisan.post.ts               # 停用/啟用
```

### 設計規範

- **Supabase 查詢用 DTO 斷言**：`.single<ProfileDTO>()`，不用 database.types.ts
- **Composable 內做 DTO → Model 轉換**：`snakeToCamel<Order>(data)`
- **單一入口原則**：fetchProfile 只在 auth.global.ts 呼叫，其他只讀
- **useGuard.denyWith()** 統一處理轉導提示
- **Enum**: UPPER_SNAKE_CASE，**Property**: camelCase
- **主要函式和型別加 JSDoc**
- **CSS**: 共用放 `_*.css`，組件特有用 scoped style

---

## 踩坑紀錄

1. **Nuxt 組件命名去重**：`order/OrderHeader.vue` → `OrderHeader`。用 `.nuxt/components.d.ts` 確認。
2. **Lucide icon 需 `@iconify-json/lucide`**。
3. **ESLint 需 `typescript` devDependency**。
4. **init.sql 建表在函數之前**（`is_admin()` 引用 profiles）。
5. **Capacitor 8 預設 SPM**（不是 CocoaPods）。
6. **SPA + Capacitor**：`ssr: false` + `pnpm generate`。
7. **不用 `database.types.ts`**，改用 `.single<DTO>()` 斷言。
8. **CSS `@import` 在 `@tailwind` 之前**。
9. **新增檔案後跑 `npx nuxt prepare`** 重新生成型別。
10. **`useSupabaseUser().id` 可能 undefined**：用 `getUser()` 取可靠 id。
11. **Profile 載入散布多處 → 時序問題**：收攏到 auth.global.ts 單一入口。
12. **Supabase 免費 email 3 封/小時**：接 Resend SMTP 解除。
13. **Magic link 轉導失敗**：加 `/confirm` 頁面 + 排除在 auth middleware 外。
