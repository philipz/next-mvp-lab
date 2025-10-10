interface RequestOptions {
  body?: unknown;
  headers?: Record<string, string>;
}

export const client = {
  async GET<T = unknown>(path: string, init?: RequestInit): Promise<{ data: T }> {
    const res = await fetch(path, { ...init });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return { data: await res.json() };
  },

  async POST<T = unknown>(path: string, options?: RequestOptions): Promise<{ data: T }> {
    const res = await fetch(path, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      body: options?.body ? JSON.stringify(options.body) : undefined,
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return { data: await res.json() };
  }
};
