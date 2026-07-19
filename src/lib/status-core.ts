import type { StatusTarget } from "./status-types";

export interface HttpTarget {
  name: string;
  url: string;
}

export function healthUrl(baseUrl: string, path: string): string {
  const base = baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`;
  return new URL(path.replace(/^\//, ""), base).toString();
}

export async function checkHttpTarget(
  target: HttpTarget,
  timeoutMs: number,
  fetcher: typeof fetch = fetch,
): Promise<StatusTarget> {
  try {
    const response = await fetcher(target.url, {
      headers: { accept: "application/json" },
      cache: "no-store",
      signal: AbortSignal.timeout(timeoutMs),
    });
    if (!response.ok) return { name: target.name, status: "DOWN" };

    const body = await response.json() as { status?: unknown };
    return { name: target.name, status: body.status === "UP" ? "UP" : "DOWN" };
  } catch {
    return { name: target.name, status: "DOWN" };
  }
}

export function positiveInteger(value: string | undefined, fallback: number): number {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
}
