'use client'

import { useEffect, useState, type ReactNode } from 'react'

let initPromise: Promise<unknown> | null = null

const shouldEnableMocks = () =>
  process.env.NODE_ENV === 'development' &&
  process.env.NEXT_PUBLIC_USE_MOCKS === 'true'

export function MSWProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(!shouldEnableMocks())
  const [errored, setErrored] = useState(false)

  useEffect(() => {
    let cancelled = false

    if (typeof window === 'undefined' || !shouldEnableMocks()) {
      setReady(true)
      return () => {
        cancelled = true
      }
    }

    if (!initPromise) {
      initPromise = import('@/mocks/browser').then(({ worker }) =>
        worker.start({
          onUnhandledRequest: 'bypass',
        })
      )
    }

    initPromise
      ?.catch((error) => {
        if (!cancelled) {
          console.error('Failed to initialize MSW mocks', error)
          setErrored(true)
        }
      })
      .finally(() => {
        if (!cancelled) {
          setReady(true)
        }
      })

    return () => {
      cancelled = true
    }
  }, [])

  return (
    <>
      {!ready && (
        <div className="p-4 text-sm text-gray-600">Loading mocks...</div>
      )}
      {errored && (
        <div className="rounded border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          Mock server failed to start. API calls will hit the real backend.
        </div>
      )}
      {children}
    </>
  )
}
