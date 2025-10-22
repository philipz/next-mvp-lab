import { HttpError } from './errors';

const DEFAULT_TIMEOUT_MS = 10_000;
const ABSOLUTE_URL_REGEX = /^https?:\/\//i;

const rawBaseUrl = process.env.NEXT_PUBLIC_API_URL?.trim();
const sanitizedBaseUrl =
  rawBaseUrl && rawBaseUrl.length > 0 ? rawBaseUrl.replace(/\/$/, '') : '/api';

export const API_BASE_URL = sanitizedBaseUrl;

const resolveUrl = (path: string): string => {
  if (ABSOLUTE_URL_REGEX.test(path)) {
    return path;
  }

  if (ABSOLUTE_URL_REGEX.test(API_BASE_URL)) {
    const base =
      API_BASE_URL.endsWith('/') || API_BASE_URL.length === 0
        ? API_BASE_URL
        : `${API_BASE_URL}/`;
    const relativePath = path.startsWith('/') ? path.slice(1) : path;
    return new URL(relativePath, base).toString();
  }

  const base = API_BASE_URL === '/' ? '' : API_BASE_URL;
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;

  if (base && normalizedPath.startsWith(base)) {
    return normalizedPath;
  }

  return `${base}${normalizedPath}`;
};

const createRequestSignal = (timeoutMs: number, external?: AbortSignal) => {
  const controller = new AbortController();
  const timeoutReason = Symbol('api-client-timeout');
  const timeoutId = setTimeout(() => controller.abort(timeoutReason), timeoutMs);
  let externalAbortHandler: (() => void) | undefined;

  if (external) {
    if (external.aborted) {
      controller.abort(external.reason ?? new Error('Request aborted'));
    } else {
      externalAbortHandler = () =>
        controller.abort(external.reason ?? new Error('Request aborted'));
      external.addEventListener('abort', externalAbortHandler, { once: true });
    }
  }

  const cleanup = () => {
    clearTimeout(timeoutId);
    if (external && externalAbortHandler) {
      external.removeEventListener('abort', externalAbortHandler);
    }
  };

  return { signal: controller.signal, cleanup, timeoutReason };
};

const extractError = async (
  response: Response
): Promise<{ message: string; details?: unknown }> => {
  const fallbackMessage = response.statusText || 'Request failed';
  const contentType = response.headers.get('content-type') ?? '';

  const isJson = /\bjson\b/i.test(contentType);
  if (isJson) {
    try {
      const body = await response.json();
      if (body && typeof body === 'object') {
        if ('message' in body && typeof (body as { message: unknown }).message === 'string') {
          return {
            message: (body as { message: string }).message,
            details: body,
          };
        }
        if ('error' in body && typeof (body as { error: unknown }).error === 'string') {
          return {
            message: (body as { error: string }).error,
            details: body,
          };
        }
      }
      return { message: fallbackMessage, details: body };
    } catch (error) {
      return { message: fallbackMessage, details: { cause: error } };
    }
  }

  try {
    const text = await response.text();
    if (text) {
      return { message: text };
    }
  } catch {
    // Ignore body parsing errors for non-text responses
  }

  return { message: fallbackMessage };
};

const parseResponse = async <T>(response: Response): Promise<T> => {
  if (response.status === 204 || response.status === 205 || response.status === 304) {
    return undefined as T;
  }

  const contentType = response.headers.get('content-type') ?? '';
  const isJson = /\bjson\b/i.test(contentType);
  if (isJson) {
    return (await response.json()) as T;
  }

  if (contentType.startsWith('text/')) {
    const text = await response.text();
    return text as unknown as T;
  }

  const buffer = await response.arrayBuffer();
  return buffer as unknown as T;
};

const request = async <T>(path: string, init: RequestInit = {}): Promise<T> => {
  const { signal, cleanup, timeoutReason } = createRequestSignal(
    DEFAULT_TIMEOUT_MS,
    init.signal ?? undefined
  );
  const headers = new Headers(init.headers);

  if (!headers.has('Accept')) {
    headers.set('Accept', 'application/json');
  }

  const resolvedUrl = resolveUrl(path);
  const requestInit: RequestInit = {
    ...init,
    signal,
    headers,
    credentials:
      init.credentials ??
      (ABSOLUTE_URL_REGEX.test(resolvedUrl) ? 'omit' : 'same-origin'),
  };

  try {
    const response = await fetch(resolvedUrl, requestInit);

    if (!response.ok) {
      const { message, details } = await extractError(response);
      if (response.status === 401 || response.status === 403) {
        const sessionDetails =
          details && typeof details === 'object'
            ? { ...(details as Record<string, unknown>), code: 'SESSION_EXPIRED' }
            : { code: 'SESSION_EXPIRED', details };
        throw new HttpError(
          response.status,
          message || 'Session expired. Please refresh to continue.',
          sessionDetails
        );
      }

      throw new HttpError(response.status, message, details);
    }

    return await parseResponse<T>(response);
  } catch (error) {
    if (signal.aborted && signal.reason === timeoutReason) {
      throw new HttpError(408, 'Request timed out');
    }

    if (error instanceof HttpError) {
      throw error;
    }

    if (error instanceof Error && error.name === 'AbortError') {
      throw new HttpError(499, 'Request was aborted', { cause: error });
    }

    if (error instanceof Error) {
      throw new HttpError(0, error.message, { cause: error });
    }

    throw new HttpError(0, 'Unknown network error', { cause: error });
  } finally {
    cleanup();
  }
};

const buildRequestInit = (
  method: 'POST' | 'PUT' | 'DELETE',
  body: unknown,
  init?: RequestInit
): RequestInit => {
  const headers = new Headers(init?.headers);
  const hasBody = body !== undefined && body !== null;
  const isForm = typeof FormData !== 'undefined' && body instanceof FormData;
  const isBlob = typeof Blob !== 'undefined' && body instanceof Blob;
  const isArrayBuffer = typeof ArrayBuffer !== 'undefined' && body instanceof ArrayBuffer;
  const isArrayBufferView =
    typeof ArrayBuffer !== 'undefined' && ArrayBuffer.isView(body as ArrayBufferView);
  const isString = typeof body === 'string';
  const shouldJsonify =
    hasBody && !isForm && !isBlob && !isArrayBuffer && !isArrayBufferView && !isString;

  if (shouldJsonify && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  const requestInit: RequestInit = {
    ...init,
    method,
    headers,
  };

  if (shouldJsonify) {
    requestInit.body = JSON.stringify(body);
  } else if (hasBody) {
    requestInit.body = body as BodyInit;
  } else if (init?.body) {
    requestInit.body = init.body;
  }

  return requestInit;
};

export const apiClient = {
  get<T>(path: string, init?: RequestInit): Promise<T> {
    return request<T>(path, init);
  },
  post<T>(path: string, body?: unknown, init?: RequestInit): Promise<T> {
    return request<T>(path, buildRequestInit('POST', body, init));
  },
  put<T>(path: string, body?: unknown, init?: RequestInit): Promise<T> {
    return request<T>(path, buildRequestInit('PUT', body, init));
  },
  delete<T>(path: string, init?: RequestInit): Promise<T> {
    return request<T>(path, buildRequestInit('DELETE', undefined, init));
  },
};
