import type { components, operations } from '@/lib/types/openapi'

type RawPagedResult = components['schemas']['PagedResult']

export type Product = components['schemas']['ProductDto']
export type Cart = components['schemas']['CartDto']
export type CartItem = components['schemas']['CartItemDto']
export type AddToCartRequest = components['schemas']['AddToCartRequest']
export type UpdateQuantityRequest = components['schemas']['UpdateQuantityRequest']
export type OrderSummary = components['schemas']['OrderView']
export type OrderDetail = components['schemas']['OrderDto']
export type CreateOrderRequest = components['schemas']['CreateOrderRequest']
export type CreateOrderResponse = components['schemas']['CreateOrderResponse']

export type ProductsResponse = operations['getProducts']['responses'][200]['content']['*/*']
export type ProductResponse = operations['getProductByCode']['responses'][200]['content']['*/*']
export type CartResponse = operations['getCart']['responses'][200]['content']['*/*']
export type AddToCartResponse = operations['addItem']['responses'][201]['content']['*/*']
export type UpdateCartResponse = operations['updateItemQuantity']['responses'][200]['content']['*/*']
export type OrdersResponse = operations['listOrders']['responses'][200]['content']['*/*']
export type OrderResponse = operations['getOrder']['responses'][200]['content']['*/*']
export type CreateOrderMutationResponse = operations['createOrder']['responses'][201]['content']['*/*']

export type PagedResult<T> = Omit<RawPagedResult, 'data'> & { data: T[] }

export const toPagedResult = <T>(
  payload: RawPagedResult | undefined,
  mapItem: (item: unknown) => T
): PagedResult<T> => {
  const safePayload = payload ?? ({
    data: [],
    totalElements: 0,
    pageNumber: 1,
    totalPages: 0,
    isFirst: true,
    isLast: true,
    hasNext: false,
    hasPrevious: false,
  } as RawPagedResult)

  const { data, pagination, ...metadata } = safePayload as RawPagedResult & {
    pagination?: Record<string, unknown>
  }
  const normalizedMeta = { ...metadata }

  if (pagination && typeof pagination === 'object') {
    const { page, totalItems, totalPages, hasNext, hasPrevious } = pagination as {
      page?: number
      totalItems?: number
      totalPages?: number
      hasNext?: boolean
      hasPrevious?: boolean
    }

    if (typeof page === 'number') {
      normalizedMeta.pageNumber = page
      normalizedMeta.isFirst = page <= 1
    }

    if (typeof totalItems === 'number') {
      normalizedMeta.totalElements = totalItems
    }

    if (typeof totalPages === 'number') {
      normalizedMeta.totalPages = totalPages
      if (typeof page === 'number') {
        normalizedMeta.isLast = page >= totalPages
        normalizedMeta.hasNext = page < totalPages
        normalizedMeta.hasPrevious = page > 1
      }
    }

    if (typeof hasNext === 'boolean') {
      normalizedMeta.hasNext = hasNext
    }

    if (typeof hasPrevious === 'boolean') {
      normalizedMeta.hasPrevious = hasPrevious
    }
  }

  const items = data.map((item) => mapItem(item))

  return {
    ...normalizedMeta,
    data: items,
  }
}

export const ensureOrderArray = (
  payload?: OrderSummary | OrderSummary[]
): OrderSummary[] => {
  if (!payload) return []
  return Array.isArray(payload) ? payload : [payload]
}
