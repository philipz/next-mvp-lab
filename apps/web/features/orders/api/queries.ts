'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { client } from '@/lib/http';
import type { components } from '@/lib/types/openapi';
import { cartKeys } from '@/features/cart/api/queries';

// Type aliases for better readability
type OrderListResponse = components['schemas']['OrderListResponse'];
type OrderDetailResponse = components['schemas']['OrderDetailResponse'];
type Order = components['schemas']['Order'];
type OrderFormData = components['schemas']['OrderFormData'];

// Query key factory following the factory pattern
export const orderKeys = {
  all: () => ['orders'] as const,
  lists: () => [...orderKeys.all(), 'list'] as const,
  list: () => [...orderKeys.lists()] as const,
  details: () => [...orderKeys.all(), 'detail'] as const,
  detail: (orderNumber: string) => [...orderKeys.details(), orderNumber] as const,
};

/**
 * Hook to fetch list of all orders
 * @returns Query result with order summaries
 */
export function useOrders() {
  return useQuery({
    queryKey: orderKeys.list(),
    queryFn: async () => {
      const response = await client.GET<OrderListResponse>('/api/orders');
      return response.data;
    },
  });
}

/**
 * Hook to fetch order details by order number
 * @param orderNumber - Order number to fetch
 * @returns Query result with complete order details
 */
export function useOrder(orderNumber: string) {
  return useQuery({
    queryKey: orderKeys.detail(orderNumber),
    queryFn: async () => {
      const response = await client.GET<OrderDetailResponse>(
        `/api/orders/${orderNumber}`
      );
      return response.data;
    },
    enabled: !!orderNumber, // Only run query if orderNumber is provided
  });
}

/**
 * Hook to create a new order
 * Automatically invalidates orders and cart queries on success
 * Navigates to /orders page after successful order creation
 * @returns Mutation function to create order with form data
 */
export function useCreateOrder() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: async (formData: OrderFormData) => {
      const response = await client.POST<Order>('/api/orders', { body: formData });
      return response.data;
    },
    onSuccess: () => {
      // Invalidate orders queries to show new order in list
      queryClient.invalidateQueries({ queryKey: orderKeys.all() });

      // Invalidate cart queries since cart is cleared after order
      queryClient.invalidateQueries({ queryKey: cartKeys.all() });

      // Navigate to orders page
      router.push('/orders');
    },
  });
}
