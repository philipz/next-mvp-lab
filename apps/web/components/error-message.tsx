'use client'

import type { ReactNode } from 'react'
import { HttpError } from '@/lib/api/errors'

interface ErrorMessageProps {
  error: unknown
  onRetry?: () => void
  title?: ReactNode
  description?: ReactNode
}

const isRetryable = (error: unknown): boolean => {
  if (error instanceof HttpError) {
    if (error.status === 408 || error.status === 499) {
      return true
    }
    if (error.status >= 500 || error.status === 0) {
      return true
    }
    return false
  }

  if (error instanceof Error) {
    const message = error.message.toLowerCase()
    return message.includes('network') || message.includes('timeout')
  }

  return false
}

const getMessage = (error: unknown): { title: string; body: string } => {
  if (error instanceof HttpError) {
    if (error.status >= 500) {
      return {
        title: 'Service unavailable',
        body: 'We could not reach the server. Please try again in a moment.',
      }
    }

    if (error.status === 408 || error.status === 499) {
      return {
        title: 'Request timed out',
        body: 'The request took too long to complete. Please try again.',
      }
    }

    if (error.status >= 400) {
      const fallback = error.message || 'We could not complete your request.'
      return {
        title: 'Something went wrong',
        body: fallback,
      }
    }

    return {
      title: 'Unexpected error',
      body: error.message || 'We could not complete your request.',
    }
  }

  if (error instanceof Error) {
    return {
      title: 'Unexpected error',
      body: error.message,
    }
  }

  return {
    title: 'Unexpected error',
    body: 'An unknown error occurred. Please try again.',
  }
}

export function ErrorMessage({ error, onRetry, title, description }: ErrorMessageProps) {
  const retryable = isRetryable(error)
  const message = getMessage(error)

  return (
    <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-red-800">
      <div className="mb-4 flex items-center gap-3">
        <svg
          className="h-6 w-6 flex-shrink-0 text-red-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
          />
        </svg>
        <div>
          <h3 className="text-lg font-semibold text-red-900">{title ?? message.title}</h3>
          <p className="text-sm text-red-700">{description ?? message.body}</p>
        </div>
      </div>

      {retryable && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-4 inline-flex items-center rounded bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Try again
        </button>
      )}
    </div>
  )
}
