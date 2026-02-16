import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Subject } from 'rxjs';
import type { HulyEmbedMessage } from '@jariahh/core';
import { HulyEmbedComponent } from '../components/huly-embed.component';

describe('HulyEmbedComponent', () => {
  let mockEmbedService: any;
  let mockMessageService: any;
  let mockSanitizer: any;
  let messages$: Subject<HulyEmbedMessage>;
  let comp: HulyEmbedComponent;

  beforeEach(() => {
    messages$ = new Subject<HulyEmbedMessage>();
    mockEmbedService = {
      fetchToken: vi.fn().mockResolvedValue({ token: 'test-token', expiresIn: 3600 }),
      buildUrl: vi.fn().mockReturnValue('https://huly.test/embed?token=test'),
      createRefresher: vi.fn().mockReturnValue(vi.fn()),
    };
    mockMessageService = { messages$: messages$.asObservable() };
    mockSanitizer = {
      bypassSecurityTrustResourceUrl: vi.fn((url: string) => `safe:${url}`),
    };
    comp = new HulyEmbedComponent(mockEmbedService, mockMessageService, mockSanitizer);
    comp.component = 'create-issue';
  });

  it('starts in loading state', () => {
    expect(comp.loading()).toBe(true);
    expect(comp.embedUrl()).toBeNull();
    expect(comp.errorMessage()).toBeNull();
  });

  it('fetches token and builds URL on init', async () => {
    comp.ngOnInit();
    // Wait for async loadEmbed
    await vi.waitFor(() => {
      expect(comp.embedUrl()).toBe('safe:https://huly.test/embed?token=test');
    });
    expect(mockEmbedService.fetchToken).toHaveBeenCalledWith('create-issue');
    expect(mockEmbedService.buildUrl).toHaveBeenCalledWith('create-issue', 'test-token', {
      project: undefined,
      issue: undefined,
      externalUser: undefined,
    });
  });

  it('starts token refresher after load', async () => {
    comp.ngOnInit();
    await vi.waitFor(() => {
      expect(mockEmbedService.createRefresher).toHaveBeenCalledTimes(1);
    });
    expect(mockEmbedService.createRefresher).toHaveBeenCalledWith(
      'create-issue', 3600, expect.any(Function), expect.any(Function)
    );
  });

  it('sets errorMessage and loading=false on token fetch failure', async () => {
    mockEmbedService.fetchToken.mockRejectedValueOnce(new Error('auth failed'));
    comp.ngOnInit();
    await vi.waitFor(() => {
      expect(comp.errorMessage()).toBe('auth failed');
    });
    expect(comp.loading()).toBe(false);
  });

  it('emits ready and sets loading=false on Ready message', async () => {
    comp.ngOnInit();
    await vi.waitFor(() => expect(comp.embedUrl()).not.toBeNull());

    const readySpy = vi.fn();
    comp.ready.subscribe(readySpy);

    messages$.next({ type: 'huly-embed-ready' });
    expect(comp.loading()).toBe(false);
    expect(readySpy).toHaveBeenCalledTimes(1);
  });

  it('emits issueCreated on IssueCreated message', async () => {
    comp.ngOnInit();
    await vi.waitFor(() => expect(comp.embedUrl()).not.toBeNull());

    const spy = vi.fn();
    comp.issueCreated.subscribe(spy);

    const msg = { type: 'huly-embed-issue-created' as const, issueId: 'id1', identifier: 'TEST-1' };
    messages$.next(msg);
    expect(spy).toHaveBeenCalledWith(msg);
  });

  it('emits issueCancelled on cancelled IssueCreated', async () => {
    comp.ngOnInit();
    await vi.waitFor(() => expect(comp.embedUrl()).not.toBeNull());

    const spy = vi.fn();
    comp.issueCancelled.subscribe(spy);

    const msg = { type: 'huly-embed-issue-created' as const, cancelled: true as const };
    messages$.next(msg);
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('emits issueSelected on IssueSelected message', async () => {
    comp.ngOnInit();
    await vi.waitFor(() => expect(comp.embedUrl()).not.toBeNull());

    const spy = vi.fn();
    comp.issueSelected.subscribe(spy);

    const msg = { type: 'huly-embed-issue-selected' as const, issueId: 'id2', identifier: 'TEST-2' };
    messages$.next(msg);
    expect(spy).toHaveBeenCalledWith(msg);
  });

  it('updates iframeHeight on Resize message', async () => {
    comp.ngOnInit();
    await vi.waitFor(() => expect(comp.embedUrl()).not.toBeNull());

    messages$.next({ type: 'huly-embed-resize', height: 800 });
    expect(comp.iframeHeight()).toBe(800);
  });

  it('sets errorMessage on Error message', async () => {
    comp.ngOnInit();
    await vi.waitFor(() => expect(comp.embedUrl()).not.toBeNull());

    const spy = vi.fn();
    comp.embedError.subscribe(spy);

    messages$.next({ type: 'huly-embed-error', reason: 'auth-expired' });
    expect(comp.errorMessage()).toBe('auth-expired');
    expect(comp.loading()).toBe(false);
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('cleans up subscription and refresher on destroy', async () => {
    const destroyRefresher = vi.fn();
    mockEmbedService.createRefresher.mockReturnValue(destroyRefresher);

    comp.ngOnInit();
    await vi.waitFor(() => expect(comp.embedUrl()).not.toBeNull());

    comp.ngOnDestroy();
    expect(destroyRefresher).toHaveBeenCalledTimes(1);

    // Verify subscription is cleaned up (no errors on next)
    messages$.next({ type: 'huly-embed-ready' });
  });
});
