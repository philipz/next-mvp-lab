'use client'

import { useEffect, useRef } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { cartKeys } from '@/lib/hooks/use-cart'

const CHANNEL_NAME = 'bookstore-sync'
const CART_UPDATED = 'CART_UPDATED'
const FALLBACK_INTERVAL_MS = 30_000

const CART_MUTATION_KEYS = [
  ['cart', 'add'],
  ['cart', 'update'],
  ['cart', 'clear'],
] as const

type MutationKey = readonly unknown[] | string | undefined

const matchesMutationKey = (key: MutationKey) => {
  if (!key) {
    return false
  }

  if (typeof key === 'string') {
    return CART_MUTATION_KEYS.some((target) => target.join(':') === key)
  }

  return CART_MUTATION_KEYS.some(
    (target) => Array.isArray(key) && target.length === key.length && target.every((value, index) => key[index] === value)
  )
}

const postCartUpdated = (channel: BroadcastChannel | null) => {
  channel?.postMessage({ type: CART_UPDATED })
}

export const useBroadcastSync = () => {
  const queryClient = useQueryClient()
  const channelRef = useRef<BroadcastChannel | null>(null)
  const fallbackIntervalRef = useRef<number | null>(null)

  useEffect(() => {
    let didSetupChannel = false

    const invalidateCart = () => {
      queryClient.invalidateQueries({ queryKey: cartKeys.all() })
    }

    if (typeof window !== 'undefined' && typeof BroadcastChannel !== 'undefined') {
      const channel = new BroadcastChannel(CHANNEL_NAME)
      channel.onmessage = (event) => {
        if (event?.data?.type === CART_UPDATED) {
          invalidateCart()
        }
      }
      channelRef.current = channel
      didSetupChannel = true
    }

    if (!didSetupChannel && typeof window !== 'undefined') {
      fallbackIntervalRef.current = window.setInterval(() => {
        invalidateCart()
      }, FALLBACK_INTERVAL_MS)
    }

    const unsubscribe = queryClient.getMutationCache().subscribe((event) => {
      if (event?.type !== 'updated') {
        return
      }

      const mutation = event.mutation
      if (mutation.state.status !== 'success') {
        return
      }

      const key = mutation.options.mutationKey as MutationKey
      if (!matchesMutationKey(key)) {
        return
      }

      postCartUpdated(channelRef.current)
    })

    return () => {
      unsubscribe()
      channelRef.current?.close()
      channelRef.current = null

      if (fallbackIntervalRef.current !== null) {
        clearInterval(fallbackIntervalRef.current)
        fallbackIntervalRef.current = null
      }
    }
  }, [queryClient])
}
