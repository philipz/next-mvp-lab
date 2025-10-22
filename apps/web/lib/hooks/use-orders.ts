import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { apiClient } from '@/lib/api/client'
import type {
  OrderSummary,
  OrdersResponse,
  OrderDetail,
  OrderResponse,
  CreateOrderRequest,
  CreateOrderMutationResponse,
  CreateOrderResponse,
} from '@/lib/types/api'
import { cartKeys } from '@/lib/hooks/use-cart'
import { ensureOrderArray, type PagedResult } from '@/lib/types/api'

export const orderKeys = {
  all: () => ['orders'] as const,
  list: (page: number, pageSize: number) => [...orderKeys.all(), 'list', { page, pageSize }] as const,
  detail: (orderNumber: string) => [...orderKeys.all(), 'detail', orderNumber] as const,
}

const createPagedResult = (
  items: OrderSummary[],
  page: number,
  pageSize: number
): PagedResult<OrderSummary> => {
  const totalElements = items.length
  const totalPages = totalElements === 0 ? 0 : Math.max(Math.ceil(totalElements / pageSize), 1)
  const safePage = totalPages === 0 ? 1 : Math.min(page, totalPages)
  const startIndex = (safePage - 1) * pageSize
  const pageItems = totalPages === 0 ? [] : items.slice(startIndex, startIndex + pageSize)

  return {
    data: pageItems,
    totalElements,
    pageNumber: safePage,
    totalPages,
    isFirst: safePage <= 1,
    isLast: totalPages === 0 ? true : safePage >= totalPages,
    hasNext: totalPages === 0 ? false : safePage < totalPages,
    hasPrevious: totalPages === 0 ? false : safePage > 1,
  }
}

const mapOrders = (
  payload: OrdersResponse,
  page: number,
  pageSize: number
): PagedResult<OrderSummary> => {
  if (payload && typeof payload === 'object' && 'data' in (payload as Record<string, unknown>)) {
    const candidate = payload as Partial<PagedResult<OrderSummary>>
    const rawData = candidate.data as unknown
    const items = Array.isArray(rawData)
      ? (rawData as OrderSummary[])
      : ensureOrderArray(rawData as OrderSummary | undefined)

    const totalElements = typeof candidate.totalElements === 'number' ? candidate.totalElements : items.length
    const pageNumber = typeof candidate.pageNumber === 'number' ? candidate.pageNumber : page
    const totalPages =
      typeof candidate.totalPages === 'number'
        ? candidate.totalPages
        : totalElements === 0
        ? 0
        : Math.max(Math.ceil(totalElements / pageSize), 1)

    return {
      data: items,
      totalElements,
      pageNumber,
      totalPages,
      isFirst: candidate.isFirst ?? pageNumber <= 1,
      isLast: candidate.isLast ?? (totalPages === 0 ? true : pageNumber >= totalPages),
      hasNext: candidate.hasNext ?? (totalPages === 0 ? false : pageNumber < totalPages),
      hasPrevious: candidate.hasPrevious ?? pageNumber > 1,
    }
  }

  const items = ensureOrderArray(payload as OrderSummary | OrderSummary[])
  return createPagedResult(items, page, pageSize)
}

const mapOrderDetail = (payload: OrderResponse): OrderDetail => payload as OrderDetail

const mapCreateOrderResponse = (payload: CreateOrderMutationResponse): CreateOrderResponse =>
  payload as CreateOrderResponse

export const useOrders = (page = 1, pageSize = 10) =>
  useQuery({
    queryKey: orderKeys.list(page, pageSize),
    queryFn: async () => {
      const searchParams = new URLSearchParams({
        page: page.toString(),
        pageSize: pageSize.toString(),
      })
      const response = await apiClient.get<OrdersResponse>(`/api/orders?${searchParams.toString()}`)
      return mapOrders(response, page, pageSize)
    },
    staleTime: 2 * 60 * 1000,
  })

export const useOrder = (orderNumber: string) =>
  useQuery({
    queryKey: orderKeys.detail(orderNumber),
    queryFn: async () => {
      const response = await apiClient.get<OrderResponse>(`/api/orders/${encodeURIComponent(orderNumber)}`)
      return mapOrderDetail(response)
    },
    enabled: Boolean(orderNumber),
  })

export const useCreateOrder = () => {
  const queryClient = useQueryClient()
  const router = useRouter()

  return useMutation({
    mutationFn: async (payload: CreateOrderRequest) => {
      const response = await apiClient.post<CreateOrderMutationResponse>('/api/orders', payload)
      return mapCreateOrderResponse(response)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: orderKeys.all() })
      queryClient.invalidateQueries({ queryKey: cartKeys.all() })
      router.push('/orders')
    },
  })
}
