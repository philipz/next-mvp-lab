# Implementation Plan: Simple Online Bookstore

**Branch**: `001-simple-online-bookstore` | **Date**: 2025-10-11 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-simple-online-bookstore/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

實作一個簡單的線上書店，包含書籍目錄瀏覽、購物車管理和訂單處理功能。系統採用 Next.js 14 App Router 架構，遵循規格驅動開發 (SDD) 方法，提供無需登入的流暢購書體驗。核心功能包括：分頁書籍展示、購物車商品管理、訂單表單填寫和訂單歷史查看。技術方案基於現有的 SDD Frontend Template，擴展書店專用的 API 契約、UI 元件和商業邏輯。

## Technical Context

**Language/Version**: TypeScript 5.5.4 on Node.js >= 18.17  
**Primary Dependencies**: Next.js 14.2.33, React 18.3.1, TanStack Query 5.90.2, Tailwind CSS 3.4.17, Zod 3.24.1  
**Storage**: Frontend-only (TanStack Query cache + future localStorage for cart persistence), Backend APIs via REST  
**Testing**: Vitest 2.1.8 (unit/component), Playwright 1.49.1 (E2E), @testing-library/react 16.1.0  
**Target Platform**: Web browsers (Chrome/Firefox/Safari/Edge last 2 versions), mobile responsive design  
**Project Type**: Web application (Next.js frontend with App Router)  
**Performance Goals**: <2s page load on 3G, <3s TTI, LCP <2.5s, FID <100ms, CLS <0.1 (Core Web Vitals)  
**Constraints**: <200KB gzipped bundle for main pages, 99.9% uptime, WCAG 2.1 AA accessibility compliance  
**Scale/Scope**: 1K-10K concurrent users (Phase 1), 10K-100K books catalog, 5 main pages, 20 functional requirements

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### 規格優先開發 (不可妥協) ✅
- [x] 功能規格已完成 (spec.md)
- [x] 需求記錄在 requirements.md 中
- [x] 技術設計將記錄在 design.md 中
- [x] 驗收標準將記錄在 YAML 規格檔中
- [x] 在規格批准前不會編寫程式碼

### 契約優先 API ✅
- [x] API 互動將在 OpenAPI 3.0+ 中定義 (contracts/)
- [x] TypeScript 類型將使用 openapi-typescript 生成
- [x] MSW 模擬將完全符合 OpenAPI 架構
- [x] 前後端可獨立工作並保證相容性

### 功能模組化 ✅
- [x] 功能將組織在 features/[feature-name]/ 下
- [x] 每個功能模組包含 API 層 (api/queries.ts)
- [x] 每個功能模組包含規格 (spec/)
- [x] 功能可獨立測試
- [x] 無跨功能直接依賴

### 類型安全 (不可妥協) ✅
- [x] 使用 TypeScript 嚴格模式
- [x] 禁用 any 類型
- [x] 使用 Zod 進行執行時驗證
- [x] 查詢鍵工廠強制類型安全
- [x] 表單驗證類型安全

### 以用戶為中心的設計 ✅
- [x] UI 決策優先考慮用戶體驗
- [x] 元件響應式 (行動優先)
- [x] 無障礙 (WCAG 2.1 AA)
- [x] 遵循效能預算 (Core Web Vitals)
- [x] 強制載入狀態、錯誤處理和空狀態

**結果**: 所有憲章原則均符合，無需例外處理。

## Project Structure

### Documentation (this feature)

```
specs/[###-feature]/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```
apps/web/                                 # Next.js 應用程式
├── app/                                 # Next.js App Router (頁面)
│   ├── layout.tsx                       # 根布局元件 (需增加書店標題列)
│   ├── page.tsx                         # 首頁 (重導向到 /books)
│   ├── books/
│   │   └── page.tsx                     # 書籍目錄頁面 (從 YAML 規格生成)
│   ├── cart/
│   │   └── page.tsx                     # 購物車 + 訂單表單頁面 (從 YAML 規格生成)
│   └── orders/
│       ├── page.tsx                     # 訂單列表頁面 (從 YAML 規格生成)
│       └── [orderNumber]/
│           └── page.tsx                 # 訂單詳情頁面
│
├── features/                            # 功能模組 (領域邏輯)
│   ├── books/                          # 書籍功能模組
│   │   ├── spec/
│   │   │   └── page.book-list.yml      # 書籍目錄 UI 規格
│   │   └── api/
│   │       └── queries.ts              # 書籍 TanStack Query hooks
│   ├── cart/                           # 購物車功能模組
│   │   ├── spec/
│   │   │   └── page.cart.yml           # 購物車 + 訂單表單 UI 規格
│   │   └── api/
│   │       └── queries.ts              # 購物車查詢和突變
│   └── orders/                         # 訂單功能模組
│       ├── spec/
│       │   ├── page.order-list.yml     # 訂單列表 UI 規格
│       │   └── page.order-detail.yml   # 訂單詳情 UI 規格
│       └── api/
│           └── queries.ts              # 訂單查詢和突變
│
├── design-system/                       # 可重用 UI 元件
│   ├── data-table.tsx                  # 現有 (用於訂單列表)
│   ├── product-grid.tsx                # 新增: 書籍目錄網格元件
│   ├── product-card.tsx                # 新增: 單本書卡片元件
│   ├── cart-table.tsx                  # 新增: 購物車顯示元件
│   ├── order-form.tsx                  # 新增: 訂單提交表單
│   └── pagination.tsx                  # 新增: 分頁控制元件
│
├── lib/                                # 共享工具
│   ├── http.ts                         # HTTP 客戶端 (需擴展支援 POST)
│   └── types/
│       └── openapi.d.ts                # 從 OpenAPI 生成 (不可手動編輯)
│
├── mocks/                              # MSW API 模擬
│   └── handlers.ts                     # 需新增書店 API 處理器
│
└── e2e/                                # Playwright E2E 測試
    ├── books.spec.ts                   # 書籍瀏覽測試
    ├── cart.spec.ts                    # 購物車測試
    └── checkout.spec.ts                # 完整結帳流程測試

docs/specs/api/
└── openapi.yaml                        # 需擴展書店端點

scripts/
└── gen-page-from-spec.ts              # 從 YAML 規格生成頁面
```

**Structure Decision**: 選擇 Web 應用程式結構 (Option 2 變體)，基於現有的 Next.js App Router 架構。採用功能基礎模組化設計，每個商業功能 (books, cart, orders) 都是自包含模組，具有清晰的邊界和獨立的 API 層。

## Phase 0: Research & Planning 

No research phase needed - all technical decisions are well-established based on existing SDD Frontend Template and clear technology stack from tech.md. All unknowns have been resolved in Technical Context section above.
