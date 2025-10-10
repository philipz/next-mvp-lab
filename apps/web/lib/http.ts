export const client = {
  async GET(path: string, init?: RequestInit) {
    const res = await fetch(path, { ...init });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return { data: await res.json() };
  }
};
