'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState, useEffect, type ReactNode } from 'react'
import { observeWebVitals, monitorPageLoad, monitorResourceLoading } from '@/lib/performance'

export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // Caching strategies
            staleTime: 5 * 60 * 1000, // 5 minutes - data stays fresh
            gcTime: 10 * 60 * 1000, // 10 minutes - garbage collection time
            
            // Refetch behavior
            refetchOnWindowFocus: false, // Don't refetch on window focus
            refetchOnReconnect: true, // Refetch when reconnecting
            refetchOnMount: true, // Refetch when component mounts
            
            // Retry configuration
            retry: (failureCount, error: any) => {
              // Don't retry on 4xx errors (client errors)
              if (error?.response?.status >= 400 && error?.response?.status < 500) {
                return false
              }
              // Retry up to 3 times for other errors
              return failureCount < 3
            },
            retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
          },
          mutations: {
            // Retry mutations on network errors
            retry: (failureCount, error: any) => {
              if (error?.response?.status >= 400 && error?.response?.status < 500) {
                return false
              }
              return failureCount < 2
            },
            retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
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

    // Initialize performance monitoring
    if (process.env.NODE_ENV === 'production') {
      observeWebVitals()
      monitorPageLoad()
      monitorResourceLoading()
    }

    initializeMocks()
  }, [])

  // Wait for MSW to be ready in development
  if (process.env.NODE_ENV === 'development' && !mswReady) {
    return null
  }

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}
