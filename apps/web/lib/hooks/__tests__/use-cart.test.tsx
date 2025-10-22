import React, { type ReactNode } from 'react'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { HttpResponse, http } from 'msw'
import { describe, it, expect, vi, beforeAll, afterAll, afterEach } from 'vitest'
import { useAddToCart, useCart, useClearCart, useUpdateCart, cartKeys } from '@/lib/hooks/use-cart'
import { server } from '@/mocks/server'
import { HttpError } from '@/lib/api/errors'

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  })

  const Wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )

  return { queryClient, Wrapper }
}

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))
afterAll(() => server.close())
afterEach(() => server.resetHandlers())

describe('useCart', () => {
  it('fetches the current cart', async () => {
    const { Wrapper } = createWrapper()
    const { result } = renderHook(() => useCart(), { wrapper: Wrapper })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data?.items?.length).toBeDefined()
  })

  it('surfaces server errors as HttpError', async () => {
    server.use(http.get('/api/cart', () => HttpResponse.json({ message: 'boom' }, { status: 500 })))
    const { Wrapper } = createWrapper()
    const { result } = renderHook(() => useCart(), { wrapper: Wrapper })

    await waitFor(() => expect(result.current.isError).toBe(true))
    expect(result.current.error).toBeInstanceOf(HttpError)
  })
})

describe('cart mutations', () => {
  it('adds new items to the cart and invalidates queries', async () => {
    const { Wrapper, queryClient } = createWrapper()
    const { result: addResult } = renderHook(() => useAddToCart(), { wrapper: Wrapper })
    const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries')

    await addResult.current.mutateAsync({ code: 'book-001', quantity: 2 })

    await waitFor(() => expect(addResult.current.isSuccess).toBe(true))
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: cartKeys.all() })
  })

  it('updates existing cart items', async () => {
    const { Wrapper } = createWrapper()
    const addHook = renderHook(() => useAddToCart(), { wrapper: Wrapper })
    await addHook.result.current.mutateAsync({ code: 'book-001', quantity: 1 })

    const updateHook = renderHook(() => useUpdateCart(), { wrapper: Wrapper })
    await updateHook.result.current.mutateAsync({ code: 'book-001', quantity: 3 })

    const cartHook = renderHook(() => useCart(), { wrapper: Wrapper })
    await waitFor(() => expect(cartHook.result.current.isSuccess).toBe(true))
    expect(cartHook.result.current.data?.items?.[0]?.quantity).toBe(3)
  })

  it('clears the cart using delete endpoint', async () => {
    const { Wrapper } = createWrapper()
    const addHook = renderHook(() => useAddToCart(), { wrapper: Wrapper })
    await addHook.result.current.mutateAsync({ code: 'book-002', quantity: 1 })

    server.use(
      http.delete('/api/cart', () => {
        return HttpResponse.json({ items: [], totalAmount: 0, itemCount: 0 })
      })
    )

    server.use(
      http.get('/api/cart', () => {
        return HttpResponse.json({ items: [], totalAmount: 0, itemCount: 0 })
      })
    )

    const clearHook = renderHook(() => useClearCart(), { wrapper: Wrapper })
    await clearHook.result.current.mutateAsync()

    const cartHook = renderHook(() => useCart(), { wrapper: Wrapper })
    await waitFor(() => expect(cartHook.result.current.isSuccess).toBe(true))
    expect(cartHook.result.current.data?.items?.length).toBe(0)
  })
})
