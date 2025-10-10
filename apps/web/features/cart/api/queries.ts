import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { client } from '@/lib/http';
import type { components } from '@/lib/types/openapi';

// Type aliases for better readability
type Cart = components['schemas']['Cart'];
type AddToCartRequest = components['schemas']['AddToCartRequest'];
type UpdateCartRequest = components['schemas']['UpdateCartRequest'];

// Query key factory following the factory pattern
export const cartKeys = {
  all: () => ['cart'] as const,
  current: () => [...cartKeys.all(), 'current'] as const,
};

/**
 * Hook to fetch current shopping cart
 * @returns Query result with current cart state
 */
export function useCart() {
  return useQuery({
    queryKey: cartKeys.current(),
    queryFn: async () => {
      const response = await client.GET<Cart>('/api/cart');
      return response.data;
    },
  });
}

/**
 * Hook to add a book to cart
 * Automatically invalidates cart queries on success
 * @returns Mutation function to add book to cart by code
 */
export function useAddToCart() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (code: string) => {
      const body: AddToCartRequest = { code };
      const response = await client.POST<Cart>('/api/cart', { body });
      return response.data;
    },
    onSuccess: () => {
      // Invalidate cart queries to trigger refetch
      queryClient.invalidateQueries({ queryKey: cartKeys.all() });
    },
  });
}

/**
 * Hook to update cart item quantity
 * Automatically invalidates cart queries on success
 * @returns Mutation function to update cart quantity
 */
export function useUpdateCart() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ code, quantity }: UpdateCartRequest) => {
      const body: UpdateCartRequest = { code, quantity };
      const response = await client.POST<Cart>('/api/cart/update', { body });
      return response.data;
    },
    onSuccess: () => {
      // Invalidate cart queries to trigger refetch
      queryClient.invalidateQueries({ queryKey: cartKeys.current() });
    },
  });
}
