import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { createElement, type ReactNode } from 'react';
import { HulyEmbedProvider } from '../context/HulyEmbedProvider.js';
import { useHulyMessages } from '../hooks/useHulyMessages.js';

vi.mock('@jariahh/core', async () => {
  const actual = await vi.importActual<typeof import('@jariahh/core')>('@jariahh/core');
  return {
    ...actual,
    isHulyMessage: vi.fn(),
    parseHulyMessage: vi.fn(),
  };
});

import { isHulyMessage, parseHulyMessage } from '@jariahh/core';

const mockIsHulyMessage = vi.mocked(isHulyMessage);
const mockParseHulyMessage = vi.mocked(parseHulyMessage);

const config = {
  hulyUrl: 'https://huly.test',
  defaultProject: 'TEST',
  tokenEndpoint: 'https://api.test/token',
};

function wrapper({ children }: { children: ReactNode }) {
  return createElement(HulyEmbedProvider, { config }, children);
}

describe('useHulyMessages', () => {
  let addSpy: ReturnType<typeof vi.spyOn>;
  let removeSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    vi.clearAllMocks();
    addSpy = vi.spyOn(window, 'addEventListener');
    removeSpy = vi.spyOn(window, 'removeEventListener');
  });

  it('registers message listener on mount', () => {
    renderHook(() => useHulyMessages(vi.fn()), { wrapper });
    expect(addSpy).toHaveBeenCalledWith('message', expect.any(Function));
  });

  it('removes message listener on unmount', () => {
    const { unmount } = renderHook(() => useHulyMessages(vi.fn()), { wrapper });
    unmount();
    expect(removeSpy).toHaveBeenCalledWith('message', expect.any(Function));
  });

  it('calls handler for valid messages', () => {
    const handler = vi.fn();
    const readyMsg = { type: 'huly-embed-ready' as const };
    mockIsHulyMessage.mockReturnValueOnce(true);
    mockParseHulyMessage.mockReturnValueOnce(readyMsg);

    renderHook(() => useHulyMessages(handler), { wrapper });

    const listener = addSpy.mock.calls[0][1] as EventListener;
    listener(new MessageEvent('message', { data: { type: 'huly-embed-ready' }, origin: 'https://huly.test' }));

    expect(handler).toHaveBeenCalledWith(readyMsg);
  });

  it('ignores non-huly messages', () => {
    const handler = vi.fn();
    mockIsHulyMessage.mockReturnValueOnce(false);

    renderHook(() => useHulyMessages(handler), { wrapper });

    const listener = addSpy.mock.calls[0][1] as EventListener;
    listener(new MessageEvent('message', { data: { type: 'other' }, origin: 'https://evil.com' }));

    expect(handler).not.toHaveBeenCalled();
    expect(mockParseHulyMessage).not.toHaveBeenCalled();
  });

  it('ignores messages where parseHulyMessage returns null', () => {
    const handler = vi.fn();
    mockIsHulyMessage.mockReturnValueOnce(true);
    mockParseHulyMessage.mockReturnValueOnce(null);

    renderHook(() => useHulyMessages(handler), { wrapper });

    const listener = addSpy.mock.calls[0][1] as EventListener;
    listener(new MessageEvent('message', { data: {}, origin: 'https://huly.test' }));

    expect(handler).not.toHaveBeenCalled();
  });
});
