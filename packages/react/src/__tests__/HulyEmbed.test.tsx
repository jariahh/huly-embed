import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { createElement, type ReactNode } from 'react';
import { HulyEmbedProvider } from '../context/HulyEmbedProvider.js';
import { HulyEmbed } from '../components/HulyEmbed.js';

vi.mock('@huly-embed/core', async () => {
  const actual = await vi.importActual<typeof import('@huly-embed/core')>('@huly-embed/core');
  return {
    ...actual,
    fetchEmbedToken: vi.fn(),
    buildEmbedUrl: vi.fn(),
    createTokenRefresher: vi.fn(),
    getParentOrigin: vi.fn().mockReturnValue('https://parent.test'),
    isHulyMessage: vi.fn(),
    parseHulyMessage: vi.fn(),
  };
});

import { fetchEmbedToken, buildEmbedUrl, createTokenRefresher, isHulyMessage, parseHulyMessage, EmbedMessageTypes } from '@huly-embed/core';

const mockFetchToken = vi.mocked(fetchEmbedToken);
const mockBuildUrl = vi.mocked(buildEmbedUrl);
const mockCreateRefresher = vi.mocked(createTokenRefresher);
const mockIsHulyMessage = vi.mocked(isHulyMessage);
const mockParseHulyMessage = vi.mocked(parseHulyMessage);

const config = {
  hulyUrl: 'https://huly.test',
  defaultProject: 'TEST',
  tokenEndpoint: 'https://api.test/token',
};

function Wrapper({ children }: { children: ReactNode }) {
  return createElement(HulyEmbedProvider, { config }, children);
}

function renderEmbed(props: Partial<React.ComponentProps<typeof HulyEmbed>> = {}) {
  return render(
    <Wrapper>
      <HulyEmbed component="create-issue" {...props} />
    </Wrapper>
  );
}

describe('HulyEmbed', () => {
  let addSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    vi.clearAllMocks();
    mockFetchToken.mockResolvedValue({ token: 'test-token', expiresIn: 3600 });
    mockBuildUrl.mockReturnValue('https://huly.test/embed?token=test');
    mockCreateRefresher.mockReturnValue(vi.fn());
    addSpy = vi.spyOn(window, 'addEventListener');
  });

  it('shows loading state initially', () => {
    mockFetchToken.mockReturnValue(new Promise(() => {}));
    renderEmbed();
    expect(document.querySelector('.huly-embed-loading')).toBeInTheDocument();
  });

  it('shows custom loading content', () => {
    mockFetchToken.mockReturnValue(new Promise(() => {}));
    renderEmbed({ loadingContent: <div data-testid="custom-loading">Loading...</div> });
    expect(screen.getByTestId('custom-loading')).toBeInTheDocument();
  });

  it('renders iframe with correct src after loading', async () => {
    renderEmbed();

    await vi.waitFor(() => {
      const iframe = document.querySelector('iframe');
      expect(iframe).not.toBeNull();
      expect(iframe!.src).toBe('https://huly.test/embed?token=test');
    });
  });

  it('shows error state and retry button on failure', async () => {
    mockFetchToken.mockRejectedValue(new Error('auth failed'));
    renderEmbed();

    await vi.waitFor(() => {
      expect(document.querySelector('.huly-embed-error')).toBeInTheDocument();
    });
    expect(screen.getByText('auth failed')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Retry' })).toBeInTheDocument();
  });

  it('shows custom error content', async () => {
    mockFetchToken.mockRejectedValue(new Error('fail'));
    renderEmbed({ errorContent: <div data-testid="custom-error">Oops</div> });

    await vi.waitFor(() => {
      expect(screen.getByTestId('custom-error')).toBeInTheDocument();
    });
  });

  it('retries on retry button click', async () => {
    mockFetchToken.mockRejectedValueOnce(new Error('fail'));
    renderEmbed();

    await vi.waitFor(() => {
      expect(screen.getByRole('button', { name: 'Retry' })).toBeInTheDocument();
    });

    mockFetchToken.mockResolvedValue({ token: 'retry-token', expiresIn: 3600 });
    mockBuildUrl.mockReturnValue('https://huly.test/embed?token=retry');

    fireEvent.click(screen.getByRole('button', { name: 'Retry' }));

    await vi.waitFor(() => {
      const iframe = document.querySelector('iframe');
      expect(iframe).not.toBeNull();
      expect(iframe!.src).toBe('https://huly.test/embed?token=retry');
    });
  });

  it('calls onReady when Ready message is received', async () => {
    const onReady = vi.fn();
    renderEmbed({ onReady });

    await vi.waitFor(() => {
      expect(document.querySelector('iframe')).not.toBeNull();
    });

    mockIsHulyMessage.mockReturnValueOnce(true);
    mockParseHulyMessage.mockReturnValueOnce({ type: EmbedMessageTypes.Ready });

    const listener = addSpy.mock.calls.find(c => c[0] === 'message')![1] as EventListener;
    listener(new MessageEvent('message', { data: { type: 'huly-embed-ready' }, origin: 'https://huly.test' }));

    expect(onReady).toHaveBeenCalledTimes(1);
  });

  it('calls onIssueCreated when IssueCreated message is received', async () => {
    const onIssueCreated = vi.fn();
    renderEmbed({ onIssueCreated });

    await vi.waitFor(() => {
      expect(document.querySelector('iframe')).not.toBeNull();
    });

    const msg = { type: EmbedMessageTypes.IssueCreated as const, issueId: 'id1', identifier: 'TEST-1' };
    mockIsHulyMessage.mockReturnValueOnce(true);
    mockParseHulyMessage.mockReturnValueOnce(msg);

    const listener = addSpy.mock.calls.find(c => c[0] === 'message')![1] as EventListener;
    listener(new MessageEvent('message', { data: msg, origin: 'https://huly.test' }));

    expect(onIssueCreated).toHaveBeenCalledWith(msg);
  });

  it('calls onIssueCancelled when cancelled IssueCreated message is received', async () => {
    const onIssueCancelled = vi.fn();
    renderEmbed({ onIssueCancelled });

    await vi.waitFor(() => {
      expect(document.querySelector('iframe')).not.toBeNull();
    });

    const msg = { type: EmbedMessageTypes.IssueCreated as const, cancelled: true as const };
    mockIsHulyMessage.mockReturnValueOnce(true);
    mockParseHulyMessage.mockReturnValueOnce(msg);

    const listener = addSpy.mock.calls.find(c => c[0] === 'message')![1] as EventListener;
    listener(new MessageEvent('message', { data: msg, origin: 'https://huly.test' }));

    expect(onIssueCancelled).toHaveBeenCalledTimes(1);
  });

  it('calls onIssueClosed when IssueClosed message is received', async () => {
    const onIssueClosed = vi.fn();
    renderEmbed({ onIssueClosed });

    await vi.waitFor(() => {
      expect(document.querySelector('iframe')).not.toBeNull();
    });

    const msg = { type: EmbedMessageTypes.IssueClosed as const, identifier: 'TEST-3' };
    mockIsHulyMessage.mockReturnValueOnce(true);
    mockParseHulyMessage.mockReturnValueOnce(msg);

    const listener = addSpy.mock.calls.find(c => c[0] === 'message')![1] as EventListener;
    listener(new MessageEvent('message', { data: msg, origin: 'https://huly.test' }));

    expect(onIssueClosed).toHaveBeenCalledWith(msg);
  });

  it('calls onResize and updates iframe height', async () => {
    const onResize = vi.fn();
    renderEmbed({ onResize });

    await vi.waitFor(() => {
      expect(document.querySelector('iframe')).not.toBeNull();
    });

    const msg = { type: EmbedMessageTypes.Resize as const, height: 800 };
    mockIsHulyMessage.mockReturnValueOnce(true);
    mockParseHulyMessage.mockReturnValueOnce(msg);

    const listener = addSpy.mock.calls.find(c => c[0] === 'message')![1] as EventListener;
    listener(new MessageEvent('message', { data: msg, origin: 'https://huly.test' }));

    expect(onResize).toHaveBeenCalledWith(msg);
    await vi.waitFor(() => {
      const iframe = document.querySelector('iframe');
      expect(iframe!.style.height).toBe('800px');
    });
  });

  it('calls onError when Error message is received', async () => {
    const onError = vi.fn();
    renderEmbed({ onError });

    await vi.waitFor(() => {
      expect(document.querySelector('iframe')).not.toBeNull();
    });

    const msg = { type: EmbedMessageTypes.Error as const, reason: 'auth-expired' };
    mockIsHulyMessage.mockReturnValueOnce(true);
    mockParseHulyMessage.mockReturnValueOnce(msg);

    const listener = addSpy.mock.calls.find(c => c[0] === 'message')![1] as EventListener;
    listener(new MessageEvent('message', { data: msg, origin: 'https://huly.test' }));

    expect(onError).toHaveBeenCalledWith(msg);
  });
});
