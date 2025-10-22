import React, { type ReactNode } from 'react'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { HttpResponse, http } from 'msw'
import { describe, it, expect, beforeAll, afterAll, afterEach } from 'vitest'
import { productKeys, useProduct, useProducts } from '@/lib/hooks/use-products'
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

afterEach(() => {
  server.resetHandlers()
})

describe('productKeys', () => {
  it('creates stable keys for list queries', () => {
    expect(productKeys.list(2, 25)).toEqual(['products', 'list', { page: 2, pageSize: 25 }])
  })
})

describe('useProducts', () => {
  it('fetches paginated products successfully', async () => {
    const { Wrapper } = createWrapper()
    const { result } = renderHook(() => useProducts(1, 5), { wrapper: Wrapper })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data?.data).toHaveLength(5)
    expect(result.current.data?.totalElements).toBeGreaterThan(0)
  })

  it('handles server errors', async () => {
    server.use(
      http.get('/api/products', () => {
        return HttpResponse.json({ message: 'boom' }, { status: 500 })
      }),
    )

    const { Wrapper } = createWrapper()
    const { result } = renderHook(() => useProducts(1, 5), { wrapper: Wrapper })

    await waitFor(() => expect(result.current.isError).toBe(true))
    expect(result.current.error).toBeInstanceOf(HttpError)
    if (result.current.error instanceof HttpError) {
      expect(result.current.error.status).toBe(500)
    }
  })
})

describe('useProduct', () => {
  it('fetches a single product', async () => {
    const { Wrapper } = createWrapper()
    const { result } = renderHook(() => useProduct('book-001'), { wrapper: Wrapper })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data?.code).toBe('book-001')
  })

  it('does not run when product code is missing', async () => {
    const { Wrapper } = createWrapper()
    const { result } = renderHook(() => useProduct(undefined), { wrapper: Wrapper })

    await waitFor(() => expect(result.current.isFetching).toBe(false))
    expect(result.current.data).toBeUndefined()
  })
})
