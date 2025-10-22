import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/lib/api/client'
import { HttpError } from '@/lib/api/errors'
import type {
  Cart,
  CartResponse,
  AddToCartRequest,
  AddToCartResponse,
  UpdateQuantityRequest,
  UpdateCartResponse,
} from '@/lib/types/api'

export const cartKeys = {
  all: () => ['cart'] as const,
  current: () => [...cartKeys.all(), 'current'] as const,
}

const mapCart = (payload: CartResponse | AddToCartResponse | UpdateCartResponse): Cart => {
  const fallback: Cart = {
    items: [],
    totalAmount: 0,
    itemCount: 0,
  }

  const resolved = (payload ?? {}) as Partial<Cart>
  const items = Array.isArray(resolved.items) ? resolved.items : []
  return { ...fallback, ...resolved, items }
}

type AddToCartInput = string | (Pick<AddToCartRequest, 'code'> & Partial<AddToCartRequest>)
type UpdateCartInput = UpdateQuantityRequest & { code: string }

export const useCart = () =>
  useQuery({
    queryKey: cartKeys.current(),
    queryFn: async () => {
      try {
        const response = await apiClient.get<CartResponse>('/api/cart')
        return mapCart(response)
      } catch (error) {
        if (error instanceof HttpError && error.status === 404) {
          const emptyCart: Cart = { items: [], totalAmount: 0, itemCount: 0 }
          return mapCart(emptyCart as CartResponse)
        }
        throw error
      }
    },
    staleTime: 30_000,
  })

export const useAddToCart = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ['cart', 'add'],
    mutationFn: async (input: AddToCartInput) => {
      const payload: AddToCartRequest =
        typeof input === 'string'
          ? { code: input, quantity: 1 }
          : { code: input.code, quantity: input.quantity ?? 1 }

      const response = await apiClient.post<AddToCartResponse>('/api/cart/items', payload)
      return mapCart(response)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cartKeys.all() })
    },
  })
}

export const useUpdateCart = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ['cart', 'update'],
    mutationFn: async ({ code, quantity }: UpdateCartInput) => {
      const response = await apiClient.put<UpdateCartResponse>(`/api/cart/items/${encodeURIComponent(code)}`, {
        quantity,
      })
      return mapCart(response)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cartKeys.all() })
    },
  })
}

export const useClearCart = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ['cart', 'clear'],
    mutationFn: async () => {
      await apiClient.delete<void>('/api/cart')
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cartKeys.all() })
    },
  })
}
