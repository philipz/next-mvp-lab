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
    pageNumber: 0,
    totalPages: 0,
    isFirst: true,
    isLast: true,
    hasNext: false,
    hasPrevious: false,
  } as RawPagedResult)

  const { data, ...metadata } = safePayload
  const items = Array.isArray(data) ? data.map((item) => mapItem(item)) : []

  return {
    ...metadata,
    data: items,
  }
}

export const ensureOrderArray = (payload: OrdersResponse): OrderSummary[] => {
  if (!payload) {
    return []
  }

  if (Array.isArray(payload)) {
    return payload as OrderSummary[]
  }

  return [payload as OrderSummary]
}
