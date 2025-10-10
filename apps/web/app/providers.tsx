'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState, useEffect, type ReactNode } from 'react'

export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 minute
            refetchOnWindowFocus: false,
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
