import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { fetchEmbedToken, createTokenRefresher } from '../token.js';

const mockFetch = vi.fn();
vi.stubGlobal('fetch', mockFetch);

beforeEach(() => {
  mockFetch.mockReset();
});

describe('fetchEmbedToken', () => {
  it('calls fetch with correct URL including component param', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ token: 'abc', expiresIn: 3600 }),
    });

    await fetchEmbedToken('https://api.test/token', 'create-issue');

    expect(mockFetch).toHaveBeenCalledTimes(1);
    const url = new URL(mockFetch.mock.calls[0][0]);
    expect(url.searchParams.get('component')).toBe('create-issue');
  });

  it('uses GET method with credentials include', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ token: 'abc', expiresIn: 3600 }),
    });

    await fetchEmbedToken('https://api.test/token', 'create-issue');

    expect(mockFetch.mock.calls[0][1]).toEqual({
      method: 'GET',
      credentials: 'include',
    });
  });

  it('returns token and expiresIn on success', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ token: 'my-token', expiresIn: 7200 }),
    });

    const result = await fetchEmbedToken('https://api.test/token', 'issue-list');
    expect(result).toEqual({ token: 'my-token', expiresIn: 7200 });
  });

  it('throws on non-ok response', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 401,
      statusText: 'Unauthorized',
    });

    await expect(fetchEmbedToken('https://api.test/token', 'create-issue'))
      .rejects.toThrow('Token fetch failed: 401 Unauthorized');
  });

  it('throws on invalid response body missing token', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ expiresIn: 3600 }),
    });

    await expect(fetchEmbedToken('https://api.test/token', 'create-issue'))
      .rejects.toThrow('Invalid token response');
  });

  it('throws on invalid response body missing expiresIn', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ token: 'abc' }),
    });

    await expect(fetchEmbedToken('https://api.test/token', 'create-issue'))
      .rejects.toThrow('Invalid token response');
  });
});

describe('createTokenRefresher', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('schedules refresh at (expiresIn - buffer) seconds', () => {
    const onToken = vi.fn();
    const onError = vi.fn();

    createTokenRefresher('https://api.test/token', 'create-issue', 60, 3600, onToken, onError);

    // Should not fire before (3600-60)*1000 = 3540000ms
    vi.advanceTimersByTime(3539999);
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it('calls onToken after refresh succeeds', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ token: 'new-token', expiresIn: 3600 }),
    });

    const onToken = vi.fn();
    const onError = vi.fn();

    createTokenRefresher('https://api.test/token', 'create-issue', 60, 3600, onToken, onError);

    vi.advanceTimersByTime(3540000);
    await vi.runOnlyPendingTimersAsync();

    expect(onToken).toHaveBeenCalledWith({ token: 'new-token', expiresIn: 3600 });
  });

  it('enforces minimum 10s refresh interval', () => {
    const onToken = vi.fn();
    const onError = vi.fn();

    // expiresIn=65, buffer=60 → (65-60)*1000=5000 < 10000 → should use 10000
    createTokenRefresher('https://api.test/token', 'create-issue', 60, 65, onToken, onError);

    vi.advanceTimersByTime(9999);
    expect(mockFetch).not.toHaveBeenCalled();

    vi.advanceTimersByTime(1);
    expect(mockFetch).toHaveBeenCalledTimes(1);
  });

  it('calls onError when fetch fails during refresh', async () => {
    mockFetch.mockRejectedValueOnce(new Error('network error'));

    const onToken = vi.fn();
    const onError = vi.fn();

    createTokenRefresher('https://api.test/token', 'create-issue', 60, 120, onToken, onError);

    vi.advanceTimersByTime(60000);
    await vi.runOnlyPendingTimersAsync();

    expect(onError).toHaveBeenCalledTimes(1);
    expect(onError.mock.calls[0][0].message).toBe('network error');
    expect(onToken).not.toHaveBeenCalled();
  });

  it('destroy function clears timer and prevents callbacks', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ token: 'x', expiresIn: 3600 }),
    });

    const onToken = vi.fn();
    const onError = vi.fn();

    const destroy = createTokenRefresher('https://api.test/token', 'create-issue', 60, 3600, onToken, onError);

    destroy();

    vi.advanceTimersByTime(4000000);
    await vi.runOnlyPendingTimersAsync();

    expect(onToken).not.toHaveBeenCalled();
    expect(onError).not.toHaveBeenCalled();
  });

  it('re-schedules after successful refresh', async () => {
    mockFetch
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ token: 'token1', expiresIn: 600 }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ token: 'token2', expiresIn: 600 }),
      });

    const onToken = vi.fn();
    const onError = vi.fn();

    createTokenRefresher('https://api.test/token', 'create-issue', 60, 600, onToken, onError);

    // First refresh at (600-60)*1000 = 540000ms
    await vi.advanceTimersByTimeAsync(540000);
    expect(onToken).toHaveBeenCalledTimes(1);
    expect(onToken).toHaveBeenCalledWith({ token: 'token1', expiresIn: 600 });

    // Second refresh at another 540000ms
    await vi.advanceTimersByTimeAsync(540000);
    expect(onToken).toHaveBeenCalledTimes(2);
    expect(onToken).toHaveBeenLastCalledWith({ token: 'token2', expiresIn: 600 });
  });
});
