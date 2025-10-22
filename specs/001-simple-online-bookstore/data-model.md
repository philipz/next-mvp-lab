# Data Model: Simple Online Bookstore

**Feature**: Simple Online Bookstore  
**Date**: 2025-10-11  
**Status**: Draft

## 實體概覽

線上書店系統包含 5 個核心實體，支援書籍瀏覽、購物車管理和訂單處理的完整流程。

## 核心實體

### 1. Book (書籍)
表示書籍目錄中的一本書。

**屬性**:
- `code: string` - 唯一書籍識別碼 (例如: "book-001")
- `name: string` - 完整書名
- `author: string` - 作者姓名
- `price: number` - 美金價格 (例如: 19.20)
- `imageUrl: string` - 書籍封面圖片 URL

**驗證規則**:
- `code`: 必填，唯一，格式: "book-{number}"
- `name`: 必填，最大長度 200 字元
- `author`: 必填，最大長度 100 字元
- `price`: 必填，大於 0，最多 2 位小數
- `imageUrl`: 必填，有效的 URL 格式

**業務規則**:
- 書籍一旦建立，code 不可更改
- 價格僅支援美金，格式為 $XX.XX
- 封面圖片必須是可訪問的 URL

### 2. Cart (購物車)
表示用戶的購物車，採用簡化模型 (單一商品)。

**屬性**:
- `item: CartItem | null` - 購物車中的商品 (單一商品模型)
- `totalAmount: number` - 計算後的總金額 (價格 × 數量)

**業務規則**:
- 同一時間只能有一個商品在購物車中
- 總金額自動計算，不可手動設定
- 空購物車時 item 為 null，totalAmount 為 0

### 3. CartItem (購物車商品)
表示購物車中的一個商品項目。

**屬性**:
- `code: string` - 書籍代碼 (外鍵到 Book.code)
- `name: string` - 書籍名稱 (冗餘儲存便於顯示)
- `price: number` - 單價 (冗餘儲存便於計算)
- `quantity: number` - 數量 (最小值: 1)

**驗證規則**:
- `code`: 必填，必須是有效的書籍代碼
- `name`: 必填，與對應書籍名稱一致
- `price`: 必填，與對應書籍價格一致
- `quantity`: 必填，最小值 1，最大值 99

**業務規則**:
- 數量變更時自動重新計算購物車總額
- 商品名稱和價格在加入購物車時快照保存

### 4. Customer (客戶)
表示下單時收集的客戶資訊。

**屬性**:
- `name: string` - 客戶姓名
- `email: string` - 客戶信箱
- `phone: string` - 客戶電話

**驗證規則**:
- `name`: 必填，最大長度 100 字元
- `email`: 必填，有效的信箱格式
- `phone`: 必填，非空字串 (第一階段無格式驗證)

**業務規則**:
- 信箱用於訂單確認通知
- 電話用於配送聯絡
- 客戶資訊僅在訂單期間收集，不持久化為用戶帳號

### 5. Order (訂單)
表示已完成的購買訂單。

**屬性**:
- `orderNumber: string` - 唯一訂單編號 (例如: "ORD-20251011-001")
- `status: string` - 訂單狀態 (例如: "NEW", "CONFIRMED", "SHIPPED")
- `customer: Customer` - 客戶資訊
- `deliveryAddress: string` - 配送地址
- `items: CartItem[]` - 訂購的商品項目
- `totalAmount: number` - 訂單總金額
- `createdAt: string` - 建立時間 (ISO 8601 格式)

**驗證規則**:
- `orderNumber`: 必填，唯一，格式: "ORD-{YYYYMMDD}-{序號}"
- `status`: 必填，有效狀態值
- `customer`: 必填，符合 Customer 驗證規則
- `deliveryAddress`: 必填，最大長度 500 字元
- `items`: 必填，至少一個商品
- `totalAmount`: 必填，等於所有 items 的小計總和
- `createdAt`: 必填，有效的 ISO 8601 時間戳

**業務規則**:
- 訂單編號自動生成，包含日期和序號
- 訂單建立後狀態從 "NEW" 開始
- 訂單總金額必須與商品小計總和一致
- 訂單一旦建立不可修改商品內容

## 實體關係

```
Book (1) -----> (0..1) CartItem -----> (1) Cart
                  |
                  |
                  v
               Order (1) -----> (1..*) CartItem
                  |
                  |
                  v
               Customer (1)
```

**關係說明**:
1. **Book → CartItem**: 一本書可以被加入購物車 (0或1次，因為簡化模型)
2. **CartItem → Cart**: 購物車包含一個商品項目 (簡化模型)
3. **Order → CartItem**: 訂單包含一個或多個商品項目 (快照)
4. **Order → Customer**: 每個訂單關聯一個客戶資訊

## 狀態轉換

### 購物車狀態
- **空購物車** → 加入商品 → **有商品購物車**
- **有商品購物車** → 更新數量 → **有商品購物車**
- **有商品購物車** → 清空/結帳 → **空購物車**

### 訂單狀態
- **NEW** (新建) → **CONFIRMED** (已確認) → **SHIPPED** (已出貨) → **DELIVERED** (已送達)

可能的狀態：
- `NEW`: 訂單剛建立
- `CONFIRMED`: 訂單已確認，準備處理
- `PROCESSING`: 處理中 (可選)
- `SHIPPED`: 已出貨
- `DELIVERED`: 已送達
- `CANCELLED`: 已取消 (可選)

## API 響應模型

### BookListResponse
```typescript
interface BookListResponse {
  data: Book[]
  pagination: {
    page: number          // 目前頁碼 (1-indexed)
    pageSize: number      // 每頁項目數 (10-20)
    totalPages: number    // 總頁數
    totalItems: number    // 總書籍數
  }
}
```

### OrderListResponse
```typescript
interface OrderListResponse {
  orders: Array<{
    orderNumber: string
    status: string
  }>
}
```

### OrderDetailResponse
```typescript
interface OrderDetailResponse {
  order: Order
}
```

## 請求模型

### AddToCartRequest
```typescript
interface AddToCartRequest {
  code: string  // 要加入的書籍代碼
}
```

### UpdateCartRequest
```typescript
interface UpdateCartRequest {
  code: string      // 書籍代碼
  quantity: number  // 新數量 (最小值: 1)
}
```

### OrderFormData
```typescript
interface OrderFormData {
  customer: {
    name: string      // 客戶姓名 (必填)
    email: string     // 有效信箱 (必填)
    phone: string     // 電話號碼 (必填)
  }
  deliveryAddress: string  // 完整配送地址 (必填)
}
```

## 資料驗證策略

### 前端驗證 (Zod Schema)
- 即時表單驗證
- API 響應驗證
- 類型安全保證

### API 契約驗證 (OpenAPI)
- 請求/響應格式驗證
- 自動生成 TypeScript 類型
- MSW 模擬對齊

### 業務邏輯驗證
- 購物車數量限制
- 訂單總額計算驗證
- 狀態轉換規則

## 效能考量

### 快取策略
- **書籍目錄**: 快取 5 分鐘 (較少變動)
- **購物車**: 快取 1 分鐘 (頻繁更新)
- **訂單**: 快取 2 分鐘 (中等頻率)

### 分頁策略
- 書籍目錄: 每頁 10-20 本書
- 訂單列表: 每頁 20 筆訂單
- 使用 offset/limit 分頁 (簡化實作)

### 資料冗餘
- CartItem 包含 name/price 快照，減少關聯查詢
- Order 包含完整 Customer 資料，支援資料一致性