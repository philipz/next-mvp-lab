'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { useState, useEffect, type ReactNode } from 'react'
import { HttpError } from '@/lib/api/errors'
import { observeWebVitals, monitorPageLoad, monitorResourceLoading } from '@/lib/performance'

const retryDelay = (attemptIndex: number) => Math.min(1000 * 2 ** attemptIndex, 30_000)

const shouldRetryRequest = (failureCount: number, error: unknown) => {
  if (error instanceof HttpError) {
    if (error.status === 408) {
      return failureCount < 3
    }
    if (error.status >= 400 && error.status < 500) {
      return false
    }
  }

  return failureCount < 3
}

export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 5 * 60 * 1000,
            gcTime: 10 * 60 * 1000,
            refetchOnWindowFocus: false,
            refetchOnReconnect: true,
            refetchOnMount: true,
            retry: shouldRetryRequest,
            retryDelay,
          },
          mutations: {
            retry: shouldRetryRequest,
            retryDelay,
          },
        },
      })
  )

  const [mswReady, setMswReady] = useState(false)

  useEffect(() => {
    async function initializeMocks() {
      if (process.env.NODE_ENV === 'development') {
        const { initMocks } = await import('../mocks')
        await initMocks()
      }
      setMswReady(true)
    }

    if (process.env.NODE_ENV === 'production') {
      observeWebVitals()
      monitorPageLoad()
      monitorResourceLoading()
    }

    initializeMocks()
  }, [])

  if (process.env.NODE_ENV === 'development' && !mswReady) {
    return null
  }

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {process.env.NODE_ENV === 'development' ? (
        <ReactQueryDevtools buttonPosition="bottom-right" initialIsOpen={false} />
      ) : null}
    </QueryClientProvider>
  )
}
