import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { HulyMessageService } from '../services/huly-message.service';

vi.mock('@huly-embed/core', () => ({
  isHulyMessage: vi.fn(),
  parseHulyMessage: vi.fn(),
}));

import { isHulyMessage, parseHulyMessage } from '@huly-embed/core';

const mockIsHulyMessage = vi.mocked(isHulyMessage);
const mockParseHulyMessage = vi.mocked(parseHulyMessage);

describe('HulyMessageService', () => {
  let addSpy: ReturnType<typeof vi.spyOn>;
  let removeSpy: ReturnType<typeof vi.spyOn>;
  let mockNgZone: any;
  let mockEmbedService: any;
  let service: HulyMessageService;

  beforeEach(() => {
    vi.clearAllMocks();
    addSpy = vi.spyOn(window, 'addEventListener');
    removeSpy = vi.spyOn(window, 'removeEventListener');

    mockNgZone = {
      run: vi.fn((fn: Function) => fn()),
      runOutsideAngular: vi.fn((fn: Function) => fn()),
    };
    mockEmbedService = {
      allowedOrigins: ['https://huly.test'],
    };
  });

  afterEach(() => {
    service?.ngOnDestroy();
    addSpy.mockRestore();
    removeSpy.mockRestore();
  });

  function createService() {
    service = new HulyMessageService(mockEmbedService as any, mockNgZone as any);
    return service;
  }

  it('registers message listener via runOutsideAngular', () => {
    createService();
    expect(mockNgZone.runOutsideAngular).toHaveBeenCalledTimes(1);
    expect(addSpy).toHaveBeenCalledWith('message', expect.any(Function));
  });

  it('emits parsed message through messages$ when valid', () => {
    createService();
    const readyMsg = { type: 'huly-embed-ready' as const };
    mockIsHulyMessage.mockReturnValueOnce(true);
    mockParseHulyMessage.mockReturnValueOnce(readyMsg);

    const received: any[] = [];
    service.messages$.subscribe((msg) => received.push(msg));

    const listener = addSpy.mock.calls[0][1] as EventListener;
    listener(new MessageEvent('message', { data: { type: 'huly-embed-ready' }, origin: 'https://huly.test' }));

    expect(received).toHaveLength(1);
    expect(received[0]).toEqual(readyMsg);
  });

  it('does not emit when isHulyMessage returns false', () => {
    createService();
    mockIsHulyMessage.mockReturnValueOnce(false);

    const received: any[] = [];
    service.messages$.subscribe((msg) => received.push(msg));

    const listener = addSpy.mock.calls[0][1] as EventListener;
    listener(new MessageEvent('message', { data: { type: 'other' }, origin: 'https://evil.com' }));

    expect(received).toHaveLength(0);
    expect(mockParseHulyMessage).not.toHaveBeenCalled();
  });

  it('does not emit when parseHulyMessage returns null', () => {
    createService();
    mockIsHulyMessage.mockReturnValueOnce(true);
    mockParseHulyMessage.mockReturnValueOnce(null);

    const received: any[] = [];
    service.messages$.subscribe((msg) => received.push(msg));

    const listener = addSpy.mock.calls[0][1] as EventListener;
    listener(new MessageEvent('message', { data: {}, origin: 'https://huly.test' }));

    expect(received).toHaveLength(0);
  });

  it('emits inside NgZone via ngZone.run', () => {
    createService();
    mockIsHulyMessage.mockReturnValueOnce(true);
    mockParseHulyMessage.mockReturnValueOnce({ type: 'huly-embed-ready' as const });

    service.messages$.subscribe(() => {});

    const listener = addSpy.mock.calls[0][1] as EventListener;
    listener(new MessageEvent('message', { data: { type: 'huly-embed-ready' }, origin: 'https://huly.test' }));

    expect(mockNgZone.run).toHaveBeenCalledTimes(1);
  });

  it('removes event listener on destroy', () => {
    createService();
    service.ngOnDestroy();
    expect(removeSpy).toHaveBeenCalledWith('message', expect.any(Function));
  });

  it('completes subject on destroy', () => {
    createService();
    let completed = false;
    service.messages$.subscribe({ complete: () => { completed = true; } });
    service.ngOnDestroy();
    expect(completed).toBe(true);
  });
});
