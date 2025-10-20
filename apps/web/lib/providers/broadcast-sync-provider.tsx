'use client'

import { useBroadcastSync } from '@/lib/hooks/use-broadcast-sync'

export const BroadcastSyncProvider = () => {
  useBroadcastSync()
  return null
}
