import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

const importClient = async () => {
  vi.resetModules()
  return import('../client')
}

const backupEnv = {
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
}

const restoreEnv = () => {
  process.env.NEXT_PUBLIC_API_URL = backupEnv.NEXT_PUBLIC_API_URL
}

const originalFetch = globalThis.fetch

beforeEach(() => {
  vi.restoreAllMocks()
  globalThis.fetch = originalFetch
  process.env.NEXT_PUBLIC_API_URL = '/api'
})

afterEach(() => {
  restoreEnv()
  vi.useRealTimers()
  globalThis.fetch = originalFetch
})

describe('API_BASE_URL', () => {
  it('uses NEXT_PUBLIC_API_URL when provided and trims trailing slash', async () => {
    process.env.NEXT_PUBLIC_API_URL = 'https://api.example.com/'
    const { API_BASE_URL } = await importClient()
    expect(API_BASE_URL).toBe('https://api.example.com')
  })

  it('falls back to /api when env not set', async () => {
    delete process.env.NEXT_PUBLIC_API_URL
    const { API_BASE_URL } = await importClient()
    expect(API_BASE_URL).toBe('/api')
  })
})

describe('apiClient', () => {
  const mockJsonResponse = (body: unknown, init?: ResponseInit) =>
    new Response(JSON.stringify(body), {
      status: 200,
      headers: { 'content-type': 'application/json' },
      ...init,
    })

  it('uses same-origin credentials for relative API paths', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue(mockJsonResponse({ success: true }))
    vi.stubGlobal('fetch', fetchMock)
    const { apiClient } = await importClient()

    await apiClient.get('/books')

    expect(fetchMock).toHaveBeenCalledWith(
      '/api/books',
      expect.objectContaining({ credentials: 'same-origin' })
    )
  })

  it('respects absolute environment base URLs when resolving paths', async () => {
    process.env.NEXT_PUBLIC_API_URL = 'https://backend.internal'
    const fetchMock = vi
      .fn()
      .mockResolvedValue(mockJsonResponse({ success: true }))
    vi.stubGlobal('fetch', fetchMock)
    const { apiClient } = await importClient()

    await apiClient.get('/status')

    expect(fetchMock).toHaveBeenCalledWith(
      'https://backend.internal/status',
      expect.objectContaining({ credentials: 'omit' }),
    )
  })

  it('throws HttpError for 4xx responses with json body', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      mockJsonResponse({ message: 'Invalid input' }, { status: 400 }),
    )
    vi.stubGlobal('fetch', fetchMock)
    const { apiClient } = await importClient()

    await expect(apiClient.get('/bad-request')).rejects.toMatchObject({
      status: 400,
      message: 'Invalid input',
    })
  })

  it('throws HttpError for 5xx responses', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      mockJsonResponse({ message: 'Server exploded' }, { status: 503 }),
    )
    vi.stubGlobal('fetch', fetchMock)
    const { apiClient } = await importClient()

    await expect(apiClient.get('/unstable')).rejects.toMatchObject({
      status: 503,
      message: 'Server exploded',
    })
  })

  it('marks 401 responses as session expired', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      mockJsonResponse({ message: 'Unauthorized' }, { status: 401 }),
    )
    vi.stubGlobal('fetch', fetchMock)
    const { apiClient } = await importClient()

    await expect(apiClient.get('/secure')).rejects.toMatchObject({
      status: 401,
      message: 'Unauthorized',
      details: expect.objectContaining({ code: 'SESSION_EXPIRED' }),
    })
  })

  it('wraps network errors in HttpError with status 0', async () => {
    const networkError = new Error('Network down')
    const fetchMock = vi.fn().mockRejectedValue(networkError)
    vi.stubGlobal('fetch', fetchMock)
    const { apiClient } = await importClient()

    await expect(apiClient.get('/offline')).rejects.toMatchObject({
      status: 0,
      message: 'Network down',
      details: expect.objectContaining({ cause: networkError }),
    })
  })

  it('schedules request timeout with default window', async () => {
    vi.useFakeTimers()
    const setTimeoutSpy = vi.spyOn(globalThis, 'setTimeout')
    const clearTimeoutSpy = vi.spyOn(globalThis, 'clearTimeout')

    const fetchMock = vi.fn().mockResolvedValue(mockJsonResponse({ success: true }))
    vi.stubGlobal('fetch', fetchMock)
    const { apiClient } = await importClient()

    await apiClient.get('/fast-endpoint')

    expect(setTimeoutSpy).toHaveBeenCalled()
    expect(setTimeoutSpy.mock.calls[0]?.[1]).toBe(10_000)
    expect(clearTimeoutSpy).toHaveBeenCalled()
  })
})
