import type { EmbedTokenResponse, HulyEmbedComponent } from './types.js';

export async function fetchEmbedToken(
  tokenEndpoint: string,
  component: HulyEmbedComponent
): Promise<EmbedTokenResponse> {
  const url = new URL(tokenEndpoint);
  url.searchParams.set('component', component);

  const response = await fetch(url.toString(), {
    method: 'GET',
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error(`Token fetch failed: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();

  if (typeof data.token !== 'string' || typeof data.expiresIn !== 'number') {
    throw new Error('Invalid token response: missing token or expiresIn');
  }

  return { token: data.token, expiresIn: data.expiresIn };
}

const MIN_REFRESH_INTERVAL_MS = 10_000;

export function createTokenRefresher(
  tokenEndpoint: string,
  component: HulyEmbedComponent,
  bufferSeconds: number,
  initialExpiresIn: number,
  onToken: (response: EmbedTokenResponse) => void,
  onError: (error: Error) => void
): () => void {
  let timerId: ReturnType<typeof setTimeout> | null = null;
  let destroyed = false;

  function scheduleRefresh(expiresIn: number): void {
    if (destroyed) return;

    const refreshMs = Math.max(
      (expiresIn - bufferSeconds) * 1000,
      MIN_REFRESH_INTERVAL_MS
    );

    timerId = setTimeout(async () => {
      if (destroyed) return;

      try {
        const response = await fetchEmbedToken(tokenEndpoint, component);
        if (destroyed) return;
        onToken(response);
        scheduleRefresh(response.expiresIn);
      } catch (err) {
        if (destroyed) return;
        onError(err instanceof Error ? err : new Error(String(err)));
      }
    }, refreshMs);
  }

  scheduleRefresh(initialExpiresIn);

  return () => {
    destroyed = true;
    if (timerId !== null) {
      clearTimeout(timerId);
      timerId = null;
    }
  };
}
