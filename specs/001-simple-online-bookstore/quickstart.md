# Quick Start Guide: Simple Online Bookstore

**Feature**: Simple Online Bookstore  
**Date**: 2025-10-11  
**Status**: Ready for Implementation

## 概述

本指南提供線上書店功能的快速實作流程，基於規格驅動開發 (SDD) 方法論。

## 前置條件

- Node.js >= 18.17
- pnpm 9.0.0
- Git
- 已克隆專案並切換到 `001-simple-online-bookstore` 分支

## 實作流程

### Phase 1: API 契約與類型生成

#### 1.1 更新 OpenAPI 規格
```bash
# 複製契約到主要規格文件
cp specs/001-simple-online-bookstore/contracts/api.yaml docs/specs/api/openapi.yaml

# 生成 TypeScript 類型
pnpm gen:types
```

**驗證**: 檢查 `apps/web/lib/types/openapi.d.ts` 包含 Book, Cart, Order 等類型。

#### 1.2 擴展 HTTP 客戶端
編輯 `apps/web/lib/http.ts` 新增 POST 方法：

```typescript
// 新增 POST 方法支援
POST: async <T>(path: string, options?: RequestOptions): Promise<T> => {
  const response = await fetch(path, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    body: options?.body ? JSON.stringify(options.body) : undefined,
  })
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }
  return response.json()
}
```

### Phase 2: 基礎設施層

#### 2.1 建立 MSW 模擬處理器
編輯 `apps/web/mocks/handlers.ts` 新增書店 API：

```typescript
import { http, HttpResponse } from 'msw'

// 模擬書籍資料
const mockBooks = [
  { code: 'book-001', name: 'Game of Thrones', author: 'George R.R. Martin', price: 29.99, imageUrl: '/images/got.jpg' },
  { code: 'book-002', name: 'A Thousand Splendid Suns', author: 'Khaled Hosseini', price: 24.99, imageUrl: '/images/suns.jpg' },
  // ... 更多書籍
]

export const handlers = [
  // Books API
  http.get('/api/books', ({ request }) => {
    const url = new URL(request.url)
    const page = parseInt(url.searchParams.get('page') || '1')
    const pageSize = parseInt(url.searchParams.get('pageSize') || '10')
    
    return HttpResponse.json({
      data: mockBooks.slice((page - 1) * pageSize, page * pageSize),
      pagination: {
        page,
        pageSize,
        totalPages: Math.ceil(mockBooks.length / pageSize),
        totalItems: mockBooks.length,
      }
    })
  }),
  
  // Cart API - 實作 GET, POST, POST /update
  // Orders API - 實作 GET, POST, GET /:orderNumber
]
```

### Phase 3: 功能 API 層

#### 3.1 建立書籍功能 API
建立 `apps/web/features/books/api/queries.ts`：

```typescript
import { useQuery } from '@tanstack/react-query'
import { client } from '@/lib/http'
import type { BookListResponse } from '@/lib/types/openapi'

export const bookKeys = {
  all: () => ['books'] as const,
  lists: () => [...bookKeys.all(), 'list'] as const,
  list: (page: number, pageSize: number) => [...bookKeys.lists(), { page, pageSize }] as const,
}

export function useBooks(page = 1, pageSize = 10) {
  return useQuery({
    queryKey: bookKeys.list(page, pageSize),
    queryFn: () => client.GET<BookListResponse>(`/api/books?page=${page}&pageSize=${pageSize}`)
  })
}
```

#### 3.2 建立購物車功能 API
建立 `apps/web/features/cart/api/queries.ts`：

```typescript
// 實作 useCart, useAddToCart, useUpdateCart hooks
```

#### 3.3 建立訂單功能 API
建立 `apps/web/features/orders/api/queries.ts`：

```typescript
// 實作 useOrders, useOrder, useCreateOrder hooks
```

### Phase 4: UI 元件

#### 4.1 建立設計系統元件
依序建立以下元件：

1. **ProductCard** (`apps/web/design-system/product-card.tsx`)
   - 顯示單本書籍資訊
   - 包含封面、標題、作者、價格、購買按鈕

2. **ProductGrid** (`apps/web/design-system/product-grid.tsx`)
   - 5 欄響應式網格布局
   - 使用 ProductCard 元件

3. **Pagination** (`apps/web/design-system/pagination.tsx`)
   - 第一頁/上一頁/下一頁/最後一頁控制

4. **CartTable** (`apps/web/design-system/cart-table.tsx`)
   - 購物車商品展示
   - 數量調整和總計算

5. **OrderForm** (`apps/web/design-system/order-form.tsx`)
   - 客戶資訊表單
   - Zod 驗證整合

### Phase 5: 頁面生成與實作

#### 5.1 建立 UI 規格檔案
建立以下 YAML 規格：
- `apps/web/features/books/spec/page.book-list.yml`
- `apps/web/features/cart/spec/page.cart.yml`
- `apps/web/features/orders/spec/page.order-list.yml`
- `apps/web/features/orders/spec/page.order-detail.yml`

#### 5.2 生成頁面骨架
```bash
# 生成各個頁面
pnpm gen:page apps/web/features/books/spec/page.book-list.yml
pnpm gen:page apps/web/features/cart/spec/page.cart.yml
pnpm gen:page apps/web/features/orders/spec/page.order-list.yml
pnpm gen:page apps/web/features/orders/spec/page.order-detail.yml
```

#### 5.3 增強生成的頁面
手動新增以下功能到生成的頁面：
- 載入狀態 (loading states)  
- 錯誤處理 (error handling)
- 無障礙屬性 (accessibility)
- 響應式設計 (responsive design)

### Phase 6: 路由與導航

#### 6.1 更新根布局
編輯 `apps/web/app/layout.tsx` 新增書店標題列：

```typescript
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-TW">
      <body>
        <QueryClientProvider client={queryClient}>
          <header className="bg-gray-900 text-white p-4">
            <nav className="flex justify-between items-center">
              <Link href="/" className="text-xl font-bold">BookStore</Link>
              <Link href="/orders" className="hover:text-blue-300">訂單</Link>
            </nav>
          </header>
          <main>{children}</main>
        </QueryClientProvider>
      </body>
    </html>
  )
}
```

#### 6.2 設定首頁重導向
編輯 `apps/web/app/page.tsx`：

```typescript
import { redirect } from 'next/navigation'

export default function HomePage() {
  redirect('/books')
}
```

### Phase 7: 測試

#### 7.1 單元測試
為關鍵邏輯撰寫測試：
- 查詢鍵工廠 (`bookKeys`, `cartKeys`, `orderKeys`)
- HTTP 客戶端 GET/POST 方法
- 表單驗證邏輯

#### 7.2 元件測試
測試 UI 元件：
- ProductCard 渲染和互動
- CartTable 計算邏輯
- OrderForm 驗證

#### 7.3 E2E 測試
撰寫關鍵流程測試：
```bash
# 建立測試檔案
apps/web/e2e/books.spec.ts      # 書籍瀏覽
apps/web/e2e/cart.spec.ts       # 購物車操作
apps/web/e2e/checkout.spec.ts   # 完整結帳流程
```

## 開發工作流程

### 日常開發
```bash
# 啟動開發伺服器
pnpm dev

# 執行類型檢查
pnpm typecheck

# 執行單元測試
pnpm test

# 執行 E2E 測試
pnpm test:e2e
```

### 程式碼品質
```bash
# 執行 ESLint
pnpm lint

# 檢查測試覆蓋率
pnpm test --coverage
```

## 驗收檢查清單

### 功能驗收
- [ ] 書籍目錄顯示分頁網格 (5 欄)
- [ ] 書籍資訊完整 (封面、標題、作者、價格)
- [ ] 分頁控制正常運作
- [ ] 購買按鈕將書籍加入購物車
- [ ] 購物車顯示商品和總計
- [ ] 數量調整重新計算總額
- [ ] 訂單表單驗證正確
- [ ] 訂單提交成功並跳轉
- [ ] 訂單列表顯示歷史記錄
- [ ] 訂單詳情頁面可訪問

### 技術驗收
- [ ] TypeScript 嚴格模式無錯誤
- [ ] ESLint 檢查通過
- [ ] 單元測試覆蓋率 >80%
- [ ] E2E 測試通過
- [ ] 響應式設計 (320px-1920px)
- [ ] 無障礙性 (WCAG 2.1 AA)
- [ ] 效能指標達標 (Core Web Vitals)

### 憲章合規性
- [ ] 規格優先開發：所有功能都有對應規格
- [ ] 契約優先 API：OpenAPI 定義完整
- [ ] 功能模組化：清晰的模組邊界
- [ ] 類型安全：無 `any` 類型使用
- [ ] 用戶中心設計：優秀的 UX 和無障礙性

## 疑難排解

### 常見問題

**Q: 類型生成失敗**
```bash
# 檢查 OpenAPI 規格語法
pnpm gen:types --verbose
```

**A: 頁面生成錯誤**
```bash
# 確認 YAML 規格格式正確
pnpm gen:page --validate path/to/spec.yml
```

**Q: MSW 模擬不生效**
確認 `apps/web/app/layout.tsx` 或 `_app.tsx` 中已初始化 MSW worker。

### 效能優化

1. **圖片優化**: 使用 Next.js `<Image>` 元件
2. **程式碼分割**: 懶載入較重的元件
3. **快取策略**: 調整 TanStack Query 快取時間
4. **Bundle 分析**: 監控 bundle 大小

## 下一步

實作完成後，可考慮以下增強功能：
1. 搜尋和篩選功能
2. 用戶帳號系統
3. 支付整合
4. 訂單追蹤
5. 商品評論系統

## 支援資源

- [Next.js 文檔](https://nextjs.org/docs)
- [TanStack Query 指南](https://tanstack.com/query/latest)
- [OpenAPI 規格](https://swagger.io/specification/)
- [Tailwind CSS 文檔](https://tailwindcss.com/docs)
- [Vitest 測試框架](https://vitest.dev/)