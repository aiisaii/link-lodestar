const DEFAULT_BASE = "http://localhost:4000";

export const API_BASE = (import.meta.env?.VITE_API_BASE as string) || DEFAULT_BASE;

export async function apiFetch<T>(path: string, init?: RequestInit & { timeoutMs?: number }): Promise<T> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), init?.timeoutMs ?? 15000);
  try {
    const res = await fetch(`${API_BASE}${path}`, {
      ...init,
      signal: controller.signal,
      headers: {
        "Content-Type": "application/json",
        ...(init?.headers || {}),
      },
    });
    if (!res.ok) throw new Error(`API error ${res.status}`);
    return (await res.json()) as T;
  } finally {
    clearTimeout(timeout);
  }
}

export async function pingApi(): Promise<boolean> {
  try {
    await apiFetch("/health", { timeoutMs: 4000 });
    return true;
  } catch {
    return false;
  }
}
