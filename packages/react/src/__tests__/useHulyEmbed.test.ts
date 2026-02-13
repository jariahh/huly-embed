import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import { createElement, type ReactNode } from 'react';
import { HulyEmbedProvider } from '../context/HulyEmbedProvider.js';
import { useHulyEmbed } from '../hooks/useHulyEmbed.js';

vi.mock('@jariahh/core', async () => {
  const actual = await vi.importActual<typeof import('@jariahh/core')>('@jariahh/core');
  return {
    ...actual,
    fetchEmbedToken: vi.fn(),
    buildEmbedUrl: vi.fn(),
    createTokenRefresher: vi.fn(),
    getParentOrigin: vi.fn().mockReturnValue('https://parent.test'),
  };
});

import { fetchEmbedToken, buildEmbedUrl, createTokenRefresher } from '@jariahh/core';

const mockFetchToken = vi.mocked(fetchEmbedToken);
const mockBuildUrl = vi.mocked(buildEmbedUrl);
const mockCreateRefresher = vi.mocked(createTokenRefresher);

const config = {
  hulyUrl: 'https://huly.test',
  defaultProject: 'TEST',
  tokenEndpoint: 'https://api.test/token',
};

function wrapper({ children }: { children: ReactNode }) {
  return createElement(HulyEmbedProvider, { config }, children);
}

describe('useHulyEmbed', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockFetchToken.mockResolvedValue({ token: 'test-token', expiresIn: 3600 });
    mockBuildUrl.mockReturnValue('https://huly.test/embed?token=test');
    mockCreateRefresher.mockReturnValue(vi.fn());
  });

  it('starts with loading=true and no embedUrl', () => {
    // Never-resolving promise to keep it in loading state
    mockFetchToken.mockReturnValue(new Promise(() => {}));

    const { result } = renderHook(() => useHulyEmbed({ component: 'create-issue' }), { wrapper });
    expect(result.current.loading).toBe(true);
    expect(result.current.embedUrl).toBeNull();
    expect(result.current.error).toBeNull();
  });

  it('fetches token and builds URL on mount', async () => {
    const { result } = renderHook(() => useHulyEmbed({ component: 'create-issue' }), { wrapper });

    await waitFor(() => {
      expect(result.current.embedUrl).toBe('https://huly.test/embed?token=test');
    });

    expect(mockFetchToken).toHaveBeenCalledWith('https://api.test/token', 'create-issue');
    expect(mockBuildUrl).toHaveBeenCalledWith(expect.objectContaining({
      hulyUrl: 'https://huly.test',
      component: 'create-issue',
      token: 'test-token',
      project: 'TEST',
      parentOrigin: 'https://parent.test',
    }));
  });

  it('starts token refresher after loading', async () => {
    const { result } = renderHook(() => useHulyEmbed({ component: 'create-issue' }), { wrapper });

    await waitFor(() => {
      expect(result.current.embedUrl).not.toBeNull();
    });

    expect(mockCreateRefresher).toHaveBeenCalledWith(
      'https://api.test/token',
      'create-issue',
      60,
      3600,
      expect.any(Function),
      expect.any(Function),
    );
  });

  it('sets error on token fetch failure', async () => {
    mockFetchToken.mockRejectedValue(new Error('auth failed'));

    const { result } = renderHook(() => useHulyEmbed({ component: 'create-issue' }), { wrapper });

    await waitFor(() => {
      expect(result.current.error).toBe('auth failed');
    });
    expect(result.current.loading).toBe(false);
  });

  it('sets generic error for non-Error throws', async () => {
    mockFetchToken.mockRejectedValue('something');

    const { result } = renderHook(() => useHulyEmbed({ component: 'create-issue' }), { wrapper });

    await waitFor(() => {
      expect(result.current.error).toBe('Failed to load embed');
    });
  });

  it('destroys refresher on unmount', async () => {
    const destroyFn = vi.fn();
    mockCreateRefresher.mockReturnValue(destroyFn);

    const { result, unmount } = renderHook(() => useHulyEmbed({ component: 'create-issue' }), { wrapper });

    await waitFor(() => {
      expect(result.current.embedUrl).not.toBeNull();
    });

    unmount();
    expect(destroyFn).toHaveBeenCalledTimes(1);
  });

  it('retries on retry()', async () => {
    mockFetchToken.mockRejectedValueOnce(new Error('fail'));

    const { result } = renderHook(() => useHulyEmbed({ component: 'create-issue' }), { wrapper });

    await waitFor(() => {
      expect(result.current.error).toBe('fail');
    });

    // Reset mock to succeed
    mockFetchToken.mockResolvedValue({ token: 'retry-token', expiresIn: 3600 });
    mockBuildUrl.mockReturnValue('https://huly.test/embed?token=retry');

    act(() => {
      result.current.retry();
    });

    await waitFor(() => {
      expect(result.current.embedUrl).toBe('https://huly.test/embed?token=retry');
    });
    expect(result.current.error).toBeNull();
  });

  it('uses custom project instead of defaultProject', async () => {
    const { result } = renderHook(
      () => useHulyEmbed({ component: 'issue-list', project: 'CUSTOM' }),
      { wrapper }
    );

    await waitFor(() => {
      expect(result.current.embedUrl).not.toBeNull();
    });

    expect(mockBuildUrl).toHaveBeenCalledWith(expect.objectContaining({
      project: 'CUSTOM',
    }));
  });
});
