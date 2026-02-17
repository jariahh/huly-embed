import { useState, useEffect, useCallback, useRef } from 'react';
import type { HulyEmbedComponent, EmbedHideableField, EmbedTokenResponse } from '@huly-embed/core';
import { fetchEmbedToken, buildEmbedUrl, createTokenRefresher, getParentOrigin } from '@huly-embed/core';
import { useHulyEmbedConfig } from '../context/HulyEmbedProvider.js';

export interface UseHulyEmbedOptions {
  component: HulyEmbedComponent;
  project?: string;
  issue?: string;
  externalUser?: string;
  hideFields?: EmbedHideableField[];
}

export interface UseHulyEmbedResult {
  embedUrl: string | null;
  loading: boolean;
  error: string | null;
  retry: () => void;
}

export function useHulyEmbed(options: UseHulyEmbedOptions): UseHulyEmbedResult {
  const config = useHulyEmbedConfig();
  const [embedUrl, setEmbedUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const destroyRefresherRef = useRef<(() => void) | null>(null);

  const buildUrl = useCallback(
    (token: string) =>
      buildEmbedUrl({
        hulyUrl: config.hulyUrl,
        component: options.component,
        token,
        project: options.project ?? config.defaultProject,
        issue: options.issue,
        externalUser: options.externalUser,
        parentOrigin: getParentOrigin(),
        hideFields: options.hideFields,
      }),
    [config.hulyUrl, config.defaultProject, options.component, options.project, options.issue, options.externalUser, options.hideFields]
  );

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);

      try {
        const tokenResponse = await fetchEmbedToken(config.tokenEndpoint, options.component);
        if (cancelled) return;

        setEmbedUrl(buildUrl(tokenResponse.token));

        destroyRefresherRef.current?.();
        destroyRefresherRef.current = createTokenRefresher(
          config.tokenEndpoint,
          options.component,
          config.tokenRefreshBuffer ?? 60,
          tokenResponse.expiresIn,
          (response: EmbedTokenResponse) => {
            if (cancelled) return;
            setLoading(true);
            setEmbedUrl(buildUrl(response.token));
          },
          (err: Error) => {
            if (cancelled) return;
            setError(err.message);
            setLoading(false);
          }
        );
      } catch (err) {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : 'Failed to load embed');
        setLoading(false);
      }
    }

    load();

    return () => {
      cancelled = true;
      destroyRefresherRef.current?.();
      destroyRefresherRef.current = null;
    };
  }, [config.tokenEndpoint, options.component, config.tokenRefreshBuffer, buildUrl, retryCount]);

  const retry = useCallback(() => {
    setRetryCount((c) => c + 1);
  }, []);

  return { embedUrl, loading, error, retry };
}
