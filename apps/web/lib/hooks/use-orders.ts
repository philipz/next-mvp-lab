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
import { ensureOrderArray } from '@/lib/types/api'

export const orderKeys = {
  all: () => ['orders'] as const,
  list: (page: number, pageSize: number) => [...orderKeys.all(), 'list', { page, pageSize }] as const,
  detail: (orderNumber: string) => [...orderKeys.all(), 'detail', orderNumber] as const,
}

const mapOrders = (payload: OrdersResponse): OrderSummary[] => ensureOrderArray(payload)

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
      return mapOrders(response)
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
