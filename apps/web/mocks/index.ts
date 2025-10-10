export async function initMocks() {
  if (typeof window === 'undefined') {
    // Server-side: do nothing for now (can add Node MSW server if needed)
    return
  }

  // Client-side: start MSW worker
  const { worker } = await import('./browser')

  return worker.start({
    onUnhandledRequest: 'bypass', // Don't warn about unhandled requests
  })
}
